import { useState } from 'react'
import type { Content, Service } from '../content'
import { Diagram } from './Diagram'
import { Icon } from './Icon'
import { StatusDot } from './StatusDot'

type Props = { service: Service; ui: Content['ui']; defaultOpen?: boolean }

export function ServiceCard({ service: s, ui, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = `svc-${s.id}`
  const expandable = Boolean(s.diagram || s.links)
  return (
    <li className="rounded-xl border border-line bg-panel/80 backdrop-blur transition-colors hover:border-accent/40">
      <button
        type="button"
        aria-expanded={expandable ? open : undefined}
        aria-controls={expandable ? panelId : undefined}
        onClick={() => expandable && setOpen(!open)}
        className={`flex w-full flex-col gap-1 p-4 pb-2 text-left ${expandable ? '' : 'cursor-default'}`}
      >
        <span className="flex w-full items-center justify-between gap-3">
          <span className="font-semibold">{s.name}</span>
          <StatusDot status={s.status} label={ui.statusLabel[s.status]} />
        </span>
        {(s.role || s.period) && <span className="text-sm text-muted">{[s.role, s.period].filter(Boolean).join(' · ')}</span>}
        <span className="mt-1 text-sm leading-relaxed text-fg/90">{s.summary}</span>
      </button>

      {/* Rodapé fora do botão: o link "ver no ar" não pode ficar aninhado dentro de outro botão. */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-4">
        {s.stack.map((t) => (
          <span key={t} className="rounded border border-line bg-bg/60 px-1.5 py-0.5 font-mono text-[11px] text-muted">
            {t}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-2">
          {s.live && (
            <a
              href={s.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg/60 px-2.5 py-1 text-[12px] font-medium hover:border-accent hover:text-accent"
            >
              {ui.service.live}
              <Icon name="external" className="size-3.5" />
            </a>
          )}
          {expandable && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen(!open)}
              className="rounded-md px-1.5 py-1 font-mono text-[11px] text-accent hover:bg-accent/10"
            >
              {open ? `− ${ui.service.close}` : `+ ${ui.service.open}`}
            </button>
          )}
        </span>
      </div>

      {open && expandable && (
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
