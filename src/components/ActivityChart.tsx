import type { Content } from '../content'
import type { Activity } from '../hooks/useGithubActivity'

type Props = { activity: Activity | null; labels: Content['ui']['activity']; lang: string }

const EMPTY_DAYS = new Array<number>(90).fill(0)

// Commits públicos por dia nos últimos 90 dias. Mesmo tamanho carregando ou pronto (sem "pulo" na página).
// Se a API ao vivo falhou, mostra o retrato do build com a data dele.
export function ActivityChart({ activity, labels, lang }: Props) {
  const perDay = activity?.perDay ?? EMPTY_DAYS
  const max = Math.max(1, ...perDay)
  const fmt = new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short' })

  return (
    <div className="rounded-xl border border-line bg-bg/50 p-3">
      <p className="mb-3 flex flex-wrap justify-between gap-2 font-mono text-[11px] tracking-widest text-muted uppercase">
        <span>
          {labels.title}
          {activity && <span className="ml-2 text-accent normal-case tracking-normal">{activity.total}</span>}
        </span>
        {activity?.snapshotAt && (
          <span className="normal-case tracking-normal">
            {labels.snapshot} {fmt.format(new Date(activity.snapshotAt))}
          </span>
        )}
      </p>
      <div className={`flex h-20 items-end gap-px ${activity ? '' : 'animate-pulse'}`} role="img" aria-label={labels.title}>
        {perDay.map((n, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm transition-[height] duration-500 ${n ? 'bg-accent' : 'bg-line'}`}
            style={{ height: `${n ? 15 + (n / max) * 85 : 6}%`, opacity: n ? 0.45 + (n / max) * 0.55 : 1 }}
          />
        ))}
      </div>
    </div>
  )
}
