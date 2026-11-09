import { useEffect, useState } from 'react'
import { GITHUB_USER, PUBLIC_REPOS } from '../content'
import snapshot from '../github-snapshot.json'

export type Commit = { repo: string; sha: string; message: string; date: string; url: string }
// snapshotAt preenchido = dado do build, porque a API ao vivo falhou.
export type Activity = { commits: Commit[]; total: number; perDay: number[]; snapshotAt?: string }

const DAYS = 90

type ApiCommit = { sha: string; html_url: string; commit: { message: string; author: { date: string } } }

export const fallback: Activity = { ...snapshot, snapshotAt: snapshot.generatedAt }

// Commits reais dos repositórios públicos da lista fechada. Sem token: 1 requisição por repo.
// Repo inexistente (404) conta como vazio; qualquer outra falha (403/429 do limite, rede) derruba pro retrato.
async function fetchRepo(repo: string, since: string, signal: AbortSignal): Promise<Commit[]> {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?per_page=100&since=${since}`
  const res = await fetch(url, { signal })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as ApiCommit[]
  return data.map((c) => ({
    repo,
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split('\n')[0],
    date: c.commit.author.date,
    url: c.html_url,
  }))
}

export function bucketByDay(commits: Commit[], now: Date, days = DAYS): number[] {
  const perDay = new Array<number>(days).fill(0)
  const dayMs = 86_400_000
  for (const c of commits) {
    const age = Math.floor((now.getTime() - new Date(c.date).getTime()) / dayMs)
    if (age >= 0 && age < days) perDay[days - 1 - age]++
  }
  return perDay
}

export function useGithubActivity(): Activity | null {
  const [state, setState] = useState<Activity | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    const now = new Date()
    const since = new Date(now.getTime() - DAYS * 86_400_000).toISOString()
    Promise.all(PUBLIC_REPOS.map((r) => fetchRepo(r, since, ctrl.signal)))
      .then((lists) => {
        const commits = lists.flat().sort((a, b) => b.date.localeCompare(a.date))
        setState(commits.length ? { commits, total: commits.length, perDay: bucketByDay(commits, now) } : fallback)
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState(fallback)
      })
    return () => ctrl.abort()
  }, [])

  return state
}
