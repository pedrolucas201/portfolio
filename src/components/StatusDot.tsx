import type { Status } from '../content'

const color: Record<Status, string> = {
  ok: 'bg-ok',
  testing: 'bg-warn',
  ended: 'bg-off',
  off: 'bg-off',
}

export function StatusDot({ status, label }: { status: Status; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted">
      <span aria-hidden className={`size-2 rounded-full ${color[status]} ${status === 'ok' ? 'animate-pulse-ring' : ''}`} />
      {label}
    </span>
  )
}
