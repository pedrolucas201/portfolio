import { useState } from 'react'
import { ACTIVITY_REPOS, type Content } from '../content'
import snapshot from '../github-snapshot.json'
import type { Activity } from '../hooks/useGithubActivity'
import { ActivityChart } from './ActivityChart'
import { Section } from './Section'

type RepoActivity = {
  private: boolean
  total: number
  capped: boolean
  lastDate: string | null
  recent: { date: string; message?: string; url?: string }[]
}

const repos = (snapshot as { repos?: Record<string, RepoActivity> }).repos ?? {}
// Card → aba do serviço no site. pierfans/invo são somas de vários repos de cliente (ver github-snapshot.mjs).
const SERVICE_OF: Record<string, string> = {
  pierfans: 'pierfans',
  invo: 'invo',
  'pede-direto': 'pede-direto',
  dashunlock: 'dashunlock',
  'gas-manager': 'gas',
  portfolio: 'portfolio',
}
const DAY = 86_400_000

type Props = { c: Content; lang: string; onOpen: (id: string) => void; activity: Activity | null }

// "Agora" lido do git (retrato do build), mais o que não aparece em commit.
export function NowPage({ c, lang, onOpen, activity }: Props) {
  const p = c.ui.nowPage
  const [now] = useState(Date.now)
  const fmt = new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short' })
  const services = [...c.work, ...c.projects]
  const cards = ['pierfans', 'invo', ...ACTIVITY_REPOS]
    .filter((r) => repos[r]?.lastDate)
    .map((r) => ({ repo: r, a: repos[r], service: services.find((s) => s.id === SERVICE_OF[r]) }))
    .sort((x, y) => y.a.lastDate!.localeCompare(x.a.lastDate!))

  return (
    <Section id="now" title={c.ui.nav.now}>
      <div className="rounded-2xl border border-line bg-panel/80 p-4 backdrop-blur sm:p-5">
        <h3 className="font-semibold">{p.title}</h3>
        <p className="mt-0.5 text-sm text-muted">{p.subtitle}</p>

        <div className="mt-4">
          <ActivityChart activity={activity} labels={c.ui.activity} lang={lang} />
        </div>

        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {cards.map(({ repo, a, service }) => {
            const name = service ? service.name.split(' · ')[0] : repo
            const days = Math.max(0, Math.floor((now - new Date(a.lastDate!).getTime()) / DAY))
            const head = (
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{name}</span>
                <span className="font-mono text-[11px] text-muted">
                  {a.total}
                  {a.capped ? '+' : ''} {p.commits} · {p.last} {days}d
                </span>
              </span>
            )
            return (
              <li key={repo} className="rounded-xl border border-line bg-bg/50 p-3 transition-colors hover:border-accent/40">
                {service ? (
                  <button type="button" onClick={() => onOpen(service.id)} className="w-full text-left hover:text-accent">
                    {head}
                  </button>
                ) : (
                  head
                )}
                <ul className="mt-2.5 space-y-1 font-mono text-[12px]">
                  {a.recent.map((r, i) => (
                    <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-2">
                      <span className="text-accent">{fmt.format(new Date(r.date))}</span>
                      {r.message && r.url ? (
                        <a href={r.url} className="truncate text-fg/85 hover:text-accent">
                          {r.message}
                        </a>
                      ) : (
                        <span className="truncate text-muted italic">{p.private}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
