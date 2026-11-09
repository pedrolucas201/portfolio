import type { Content } from '../content'
import type { Activity } from '../hooks/useGithubActivity'

type Props = { activity: Activity | null; labels: Content['ui']['deploys']; lang: string }

const ROWS = 6
const EMPTY_DAYS = new Array<number>(90).fill(0)

// O layout é o mesmo carregando e com dados: a página nunca "pula" quando o GitHub responde.
// Se a API falhou, mostra o retrato do build com a data dele.
export function Deploys({ activity, labels, lang }: Props) {
  const perDay = activity?.perDay ?? EMPTY_DAYS
  const max = Math.max(1, ...perDay)
  const fmt = new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short' })
  const rows = activity ? activity.commits.slice(0, ROWS) : []

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-xl border border-line bg-panel/80 p-4 backdrop-blur">
        <p className="mb-3 flex justify-between font-mono text-[11px] tracking-widest text-muted uppercase">
          {labels.activity}
          {activity?.snapshotAt && (
            <span className="normal-case tracking-normal">
              {labels.snapshot} {fmt.format(new Date(activity.snapshotAt))}
            </span>
          )}
        </p>
        <div className="flex h-24 items-end gap-px" role="img" aria-label={labels.activity}>
          {perDay.map((n, i) => (
            <span
              key={i}
              className={`flex-1 rounded-sm transition-[height] duration-500 ${n ? 'bg-accent' : 'bg-line'}`}
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
                <li key={i} aria-hidden className="h-[53px] py-2">
                  <span className={`block h-full rounded bg-line/40 ${activity ? '' : 'animate-pulse'}`} />
                </li>
              )
            return (
              <li key={c.repo + c.sha} className="h-[53px] py-2">
                <a href={c.url} className="group grid grid-cols-[auto_1fr] gap-x-3 font-mono text-[12px]">
                  <span className="text-accent">{c.sha}</span>
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
