import { useState } from 'react'
import type { Content } from '../content'
import { inProduction, usedIn } from '../lib/stack'
import { Section } from './Section'
import { StatusDot } from './StatusDot'

type Props = { c: Content; onOpen: (serviceId: string) => void }

// Stack interativa: escolhe a tecnologia e a "consulta" mostra em quais serviços ela roda.
export function StackPage({ c, onOpen }: Props) {
  const [tech, setTech] = useState('Go')
  const hits = usedIn(c, tech)
  const p = c.ui.stackPage

  return (
    <Section id="stack" title={c.ui.nav.stack}>
      <p className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        {p.intro}
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {p.legend}
        </span>
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {c.stackGroups.map((g) => (
          <fieldset key={g.label} className="rounded-xl border border-line bg-panel/80 p-4 backdrop-blur">
            <legend className="sr-only">{g.label}</legend>
            <p aria-hidden className="mb-3 font-mono text-[11px] tracking-widest text-accent uppercase">
              {g.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((t) => {
                const selected = t === tech
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTech(t)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[12px] transition-colors ${
                      selected ? 'border-accent bg-accent/15 text-fg' : 'border-line bg-bg/60 text-muted hover:border-accent/50 hover:text-fg'
                    }`}
                  >
                    {t}
                    {inProduction(c, t) && <span aria-label={p.legend} className="size-1.5 rounded-full bg-accent" />}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div aria-live="polite" className="mt-3 rounded-xl border border-line bg-bg/80 p-4 font-mono text-[12px]">
        <p className="text-muted">
          <span className="text-accent">&gt;</span> {p.query} <span className="text-fg">'{tech}'</span>
          {inProduction(c, tech) && <span className="ml-2 rounded border border-accent/40 px-1.5 text-[11px] text-accent">{p.legend}</span>}
        </p>
        {hits.length ? (
          <>
            <p className="mt-3 mb-1.5 text-[11px] tracking-widest text-muted uppercase">
              {p.usedIn} · {hits.length}
            </p>
            <ul className="divide-y divide-line">
              {hits.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(s.id)}
                    className="flex w-full items-center justify-between gap-3 py-2 text-left hover:text-accent"
                  >
                    <span className="font-sans text-sm">{s.name}</span>
                    <StatusDot status={s.status} label={c.ui.statusLabel[s.status]} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-muted">{p.none}</p>
        )}
      </div>

      <ul className="mt-6 space-y-1 text-sm text-muted">
        {c.education.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </Section>
  )
}
