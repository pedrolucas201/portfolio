import { useEffect, useState } from 'react'
import type { Content } from '../content'
import { careerUptime } from '../lib/uptime'

type Props = { c: Content; onPalette: () => void; onLang: () => void }

export function TopBar({ c, onPalette, onLang }: Props) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Recife', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 whitespace-nowrap border-b border-line bg-bg/80 px-4 py-2.5 font-mono text-[11px] text-muted backdrop-blur">
      <span className="flex items-center gap-1.5 text-accent">
        <span aria-hidden className="size-1.5 animate-pulse-ring rounded-full bg-accent" />
        uptime {careerUptime(now)}
      </span>
      <span className="hidden sm:inline">· {c.ui.top.since}</span>
      <span className="ml-auto tabular-nums">
        <span className="hidden sm:inline">{c.ui.top.local} </span>
        {time}
      </span>
      <button type="button" onClick={onLang} className="rounded border border-line px-2 py-0.5 hover:text-fg lg:hidden">
        {c.ui.switchLang}
      </button>
      <button type="button" onClick={onPalette} className="rounded border border-line px-2 py-0.5 hover:text-fg lg:hidden">
        {c.ui.palette.hint}
      </button>
    </div>
  )
}
