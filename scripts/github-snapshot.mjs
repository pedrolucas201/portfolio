// Grava src/github-snapshot.json no build:
//  - commits públicos agregados (fallback da aba deploys quando a API ao vivo falha);
//  - atividade por repositório da aba "agora" (inclui repo privado: só contagem e datas, NUNCA mensagem).
// Roda no prebuild. O que falhar mantém o valor anterior, sem quebrar o build.
// Repo privado precisa de token: GITHUB_TOKEN, ou o `gh auth token` da máquina. Sem token (ex.: Vercel),
// o repo privado fica com o retrato anterior.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const USER = 'pedrolucas201'
const FILE = 'src/github-snapshot.json'
const listFrom = (name) =>
  readFileSync('src/content.ts', 'utf8')
    .match(new RegExp(`${name} = \\[([^\\]]+)\\]`))[1]
    .match(/'([^']+)'/g)
    .map((s) => s.slice(1, -1))
const PUBLIC = listFrom('PUBLIC_REPOS')
const ACTIVITY = listFrom('ACTIVITY_REPOS')
const DAYS = 90
const now = new Date()
const since = new Date(now.getTime() - DAYS * 86_400_000).toISOString()

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}
const auth = token()
const headers = auth ? { Authorization: `Bearer ${auth}` } : {}

async function commits(repo) {
  const res = await fetch(`https://api.github.com/repos/${USER}/${repo}/commits?per_page=100&since=${since}`, { headers })
  if (res.status === 404) return null // não existe (ainda) ou é privado sem token
  if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`)
  return (await res.json()).map((c) => ({
    repo,
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split('\n')[0],
    date: c.commit.author.date,
    url: c.html_url,
  }))
}

async function isPrivate(repo) {
  const res = await fetch(`https://api.github.com/repos/${USER}/${repo}`, { headers })
  return res.ok ? (await res.json()).private : true
}

const previous = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {}
const out = { ...previous }

try {
  const lists = await Promise.all(PUBLIC.map(commits))
  const all = lists.flat().filter(Boolean).sort((a, b) => b.date.localeCompare(a.date))
  if (!all.length) throw new Error('nenhum commit')
  const perDay = new Array(DAYS).fill(0)
  for (const c of all) {
    const age = Math.floor((now - new Date(c.date)) / 86_400_000)
    if (age >= 0 && age < DAYS) perDay[DAYS - 1 - age]++
  }
  Object.assign(out, { generatedAt: now.toISOString(), total: all.length, perDay, commits: all.slice(0, 6) })
  console.log(`github-snapshot: ${all.length} commits públicos`)
} catch (e) {
  console.warn(`github-snapshot: commits públicos mantidos (${e.message})`)
}

out.repos = { ...(previous.repos ?? {}) }
for (const repo of ACTIVITY) {
  try {
    const list = await commits(repo)
    if (!list) {
      console.warn(`github-snapshot: ${repo} inacessível, mantido o anterior`)
      continue
    }
    const priv = await isPrivate(repo)
    out.repos[repo] = {
      private: priv,
      total: list.length,
      capped: list.length === 100,
      lastDate: list[0]?.date ?? null,
      // Repo privado: só a data. Mensagem e link nunca saem daqui.
      recent: list.slice(0, 3).map((c) => (priv ? { date: c.date } : { date: c.date, message: c.message, url: c.url })),
    }
    console.log(`github-snapshot: ${repo} ${list.length} commits${priv ? ' (privado)' : ''}`)
  } catch (e) {
    console.warn(`github-snapshot: ${repo} mantido o anterior (${e.message})`)
  }
}
// Trabalho de cliente (Pierfans, Invo): repositórios de outras contas, somados num card por empresa.
// O mapa empresa → repositórios fica em activity.private.json, fora do git, porque os nomes dos repos
// entregariam o cliente (NDA). Aqui só saem contagem e datas dos commits do próprio Pedro.
const PRIVATE_MAP = 'activity.private.json'
if (existsSync(PRIVATE_MAP)) {
  const groups = JSON.parse(readFileSync(PRIVATE_MAP, 'utf8'))
  for (const [key, fullNames] of Object.entries(groups)) {
    try {
      const dates = []
      let capped = false
      for (const full of fullNames) {
        const res = await fetch(`https://api.github.com/repos/${full}/commits?per_page=100&since=${since}&author=${USER}`, { headers })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const list = await res.json()
        capped ||= list.length === 100
        dates.push(...list.map((c) => c.commit.author.date))
      }
      dates.sort((a, b) => b.localeCompare(a))
      out.repos[key] = {
        private: true,
        total: dates.length,
        capped,
        lastDate: dates[0] ?? null,
        recent: dates.slice(0, 3).map((date) => ({ date })),
      }
      console.log(`github-snapshot: ${key} ${dates.length} commits (privado, ${fullNames.length} repos)`)
    } catch (e) {
      console.warn(`github-snapshot: ${key} mantido o anterior (${e.message})`)
    }
  }
} else {
  console.warn(`github-snapshot: sem ${PRIVATE_MAP} (normal fora da máquina do Pedro), cards de cliente mantidos`)
}

out.reposAt = now.toISOString()

writeFileSync(FILE, JSON.stringify(out, null, 2) + '\n')
