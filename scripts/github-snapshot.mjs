// Grava src/github-snapshot.json com os commits públicos atuais. O site mostra esse retrato quando a
// API do GitHub falha ao vivo (limite de 60/h sem token, rede, 403/429).
// Roda no prebuild. Se a API falhar aqui também, mantém o arquivo anterior e não quebra o build.
import { readFileSync, writeFileSync } from 'node:fs'

const USER = 'pedrolucas201'
const REPOS = readFileSync('src/content.ts', 'utf8').match(/PUBLIC_REPOS = \[([^\]]+)\]/)[1].match(/'([^']+)'/g).map((s) => s.slice(1, -1))
const DAYS = 90
const now = new Date()
const since = new Date(now.getTime() - DAYS * 86_400_000).toISOString()

try {
  const lists = await Promise.all(
    REPOS.map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/${USER}/${repo}/commits?per_page=100&since=${since}`)
      if (res.status === 404) return [] // repo ainda não existe
      if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`)
      return (await res.json()).map((c) => ({
        repo,
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split('\n')[0],
        date: c.commit.author.date,
        url: c.html_url,
      }))
    }),
  )
  const commits = lists.flat().sort((a, b) => b.date.localeCompare(a.date))
  if (!commits.length) throw new Error('nenhum commit')
  const perDay = new Array(DAYS).fill(0)
  for (const c of commits) {
    const age = Math.floor((now - new Date(c.date)) / 86_400_000)
    if (age >= 0 && age < DAYS) perDay[DAYS - 1 - age]++
  }
  const snapshot = { generatedAt: now.toISOString(), total: commits.length, perDay, commits: commits.slice(0, 6) }
  writeFileSync('src/github-snapshot.json', JSON.stringify(snapshot, null, 2) + '\n')
  console.log(`github-snapshot: ${commits.length} commits`)
} catch (e) {
  console.warn(`github-snapshot: mantido o anterior (${e.message})`)
}
