import type { Content } from '../content'
import type { Activity } from '../hooks/useGithubActivity'

type Props = { activity: Activity | null | 'error'; labels: Content['ui']['deploys']; lang: string }

const ROWS = 6
const EMPTY_DAYS = new Array<number>(90).fill(0)

// O layout é o mesmo carregando, com dados ou com erro: a página nunca "pula" quando o GitHub responde.
export function Deploys({ activity, labels, lang }: Props) {
  const data = activity && activity !== 'error' ? activity : null
  const perDay = data?.perDay ?? EMPTY_DAYS
  const max = Math.max(1, ...perDay)
  const fmt = new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short' })
  const rows = data ? data.commits.slice(0, ROWS) : []

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-xl border border-line bg-panel/80 p-4 backdrop-blur">
        <p className="mb-3 font-mono text-[11px] tracking-widest text-muted uppercase">{labels.activity}</p>
        <div className="flex h-24 items-end gap-px" role="img" aria-label={labels.activity}>
          {perDay.map((n, i) => (
            <span
              key={i}
              className={`flex-1 rounded-sm transition-[height] duration-500 ${n ? 'bg-ok' : 'bg-line'}`}
              style={{ height: `${n ? 15 + (n / max) * 85 : 6}%`, opacity: n ? 0.45 + (n / max) * 0.55 : 1 }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-line bg-panel/80 p-4 backdrop-blur">
        <p className="mb-2 font-mono text-[11px] tracking-widest text-muted uppercase">{labels.title}</p>
        <ul className="divide-y divide-line">
          {Array.from({ length: ROWS }, (_, i) => {
            const c = rows[i]
            if (!c)
              return (
                <li key={i} className="h-[53px] py-2" aria-hidden={activity !== 'error' || i > 0}>
                  {activity === 'error' && i === 0 ? (
                    <span className="font-mono text-sm text-muted">{labels.empty}</span>
                  ) : (
                    <span className={`block h-full rounded bg-line/40 ${activity ? '' : 'animate-pulse'}`} />
                  )}
                </li>
              )
            return (
              <li key={c.repo + c.sha} className="h-[53px] py-2">
                <a href={c.url} className="group grid grid-cols-[auto_1fr] gap-x-3 font-mono text-[12px]">
                  <span className="text-ok">{c.sha}</span>
                  <span className="truncate text-fg group-hover:text-info">{c.message}</span>
                  <span className="text-muted">{fmt.format(new Date(c.date))}</span>
                  <span className="truncate text-muted">{c.repo}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
