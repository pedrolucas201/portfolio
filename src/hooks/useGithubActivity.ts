import { useEffect, useState } from 'react'
import { GITHUB_USER, PUBLIC_REPOS } from '../content'

export type Commit = { repo: string; sha: string; message: string; date: string; url: string }
export type Activity = { commits: Commit[]; perDay: number[] }

const DAYS = 90

type ApiCommit = { sha: string; html_url: string; commit: { message: string; author: { date: string } } }

// Commits reais dos repositórios públicos da lista fechada. Sem token: 1 requisição por repo,
// bem abaixo do limite anônimo da API (60/h).
async function fetchRepo(repo: string, since: string, signal: AbortSignal): Promise<Commit[]> {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?per_page=100&since=${since}`
  const res = await fetch(url, { signal })
  if (!res.ok) return []
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

export function useGithubActivity(): Activity | null | 'error' {
  const [state, setState] = useState<Activity | null | 'error'>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    const now = new Date()
    const since = new Date(now.getTime() - DAYS * 86_400_000).toISOString()
    Promise.all(PUBLIC_REPOS.map((r) => fetchRepo(r, since, ctrl.signal)))
      .then((lists) => {
        const commits = lists.flat().sort((a, b) => b.date.localeCompare(a.date))
        setState(commits.length ? { commits, perDay: bucketByDay(commits, now) } : 'error')
      })
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) setState('error')
        return e
      })
    return () => ctrl.abort()
  }, [])

  return state
}
