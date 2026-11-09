import { useState } from 'react'
import type { Content, Service } from '../content'
import { Diagram } from './Diagram'
import { StatusDot } from './StatusDot'

type Props = { service: Service; ui: Content['ui']; defaultOpen?: boolean }

export function ServiceCard({ service: s, ui, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = `svc-${s.id}`
  return (
    <li className="rounded-xl border border-line bg-panel/80 backdrop-blur transition-colors hover:border-accent/40">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="flex w-full flex-col gap-1 p-4 text-left"
      >
        <span className="flex w-full items-center justify-between gap-3">
          <span className="font-semibold">{s.name}</span>
          <StatusDot status={s.status} label={ui.statusLabel[s.status]} />
        </span>
        {(s.role || s.period) && (
          <span className="text-sm text-muted">{[s.role, s.period].filter(Boolean).join(' · ')}</span>
        )}
        <span className="mt-1 text-sm leading-relaxed text-fg/90">{s.summary}</span>
        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          {s.stack.map((t) => (
            <span key={t} className="rounded border border-line bg-bg/60 px-1.5 py-0.5 font-mono text-[11px] text-muted">
              {t}
            </span>
          ))}
          {(s.diagram || s.links) && (
            <span className="ml-auto font-mono text-[11px] text-accent">
              {open ? `− ${ui.service.close}` : `+ ${ui.service.open}`}
            </span>
          )}
        </span>
      </button>
      {s.live && (
        <p className="-mt-1 px-4 pb-4">
          <a
            href={s.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/20"
          >
            <span aria-hidden className="size-1.5 animate-pulse-ring rounded-full bg-accent" />
            {ui.service.live}
            <span className="font-mono text-[11px] text-accent/80">{s.live.replace(/^https?:\/\//, '')} ↗</span>
          </a>
        </p>
      )}
      {open && (s.diagram || s.links) && (
        <div id={panelId} className="animate-rise border-t border-line px-4 pb-4">
          {s.diagram && <Diagram data={s.diagram} title={ui.service.architecture} />}
          {s.links && (
            <p className="mt-3 flex flex-wrap gap-4 text-sm">
              {s.links.map((l) => (
                <a key={l.href} href={l.href} className="text-info underline-offset-4 hover:underline">
                  {l.label} ↗
                </a>
              ))}
            </p>
          )}
        </div>
      )}
    </li>
  )
}
