import { useEffect, useRef, useState } from 'react'
import type { Content, Incident, LogLine } from '../content'

const levelColor: Record<LogLine['level'], string> = {
  err: 'text-err',
  warn: 'text-warn',
  ok: 'text-accent',
  info: 'text-info',
}

type Props = { incident: Incident; labels: Content['ui']['incident'] }

// O log "toca" quando o card entra na tela; o botão roda de novo.
export function IncidentReplay({ incident: i, labels }: Props) {
  const ref = useRef<HTMLElement>(null)
  // Sem IntersectionObserver (navegador antigo, teste): toca direto.
  const [run, setRun] = useState(() => (typeof IntersectionObserver === 'undefined' ? 1 : 0))
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(1), io.disconnect()), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!run) return
    let n = 0
    const t = setInterval(() => {
      n++
      setShown(n)
      if (n >= i.log.length) clearInterval(t)
    }, 420)
    return () => clearInterval(t)
  }, [run, i.log.length])

  const max = Math.max(...i.backoffMinutes)
  const done = shown >= i.log.length

  return (
    <article ref={ref} className="rounded-xl border border-line bg-panel/80 p-4 backdrop-blur">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] text-muted">
            {i.date} · {i.service}
          </p>
          <h3 className="mt-0.5 font-semibold">{i.title}</h3>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">{labels.resolved}</span>
      </header>

      <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-bg p-3 font-mono text-[12px] leading-relaxed">
        {/* Todas as linhas ocupam espaço desde o início: o card não cresce e não empurra a página. */}
        {i.log.map((l, idx) => (
          <p key={`${run}-${idx}`} className={`whitespace-nowrap ${idx < shown ? 'animate-rise' : 'invisible'}`}>
            <span className="text-muted">{l.t.padEnd(8, ' ')}</span>{' '}
            <span className={levelColor[l.level]}>{l.text}</span>
            {idx === shown && !done && <span className="visible animate-blink text-accent">▍</span>}
          </p>
        ))}
      </div>

      <div className="mt-4">
        <p className="mb-2 font-mono text-[11px] tracking-widest text-muted uppercase">{labels.backoff}</p>
        <div className="flex h-20 items-end gap-2" role="img" aria-label={`${labels.backoff}: ${i.backoffMinutes.join(', ')}`}>
          {i.backoffMinutes.map((m, idx) => (
            <div key={m} className="flex h-full flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-accent/30 to-accent transition-[height] duration-700"
                  style={{ height: done ? `${(m / max) * 100}%` : '4%', transitionDelay: `${idx * 90}ms` }}
                />
              </div>
              <span className="font-mono text-[11px] text-muted">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        {(
          [
            [labels.symptom, i.symptom],
            [labels.cause, i.cause],
            [labels.fix, i.fix],
          ] as const
        ).map(([term, text]) => (
          <div key={term}>
            <dt className="font-mono text-[11px] tracking-widest text-muted uppercase">{term}</dt>
            <dd className="mt-1 leading-relaxed">{text}</dd>
          </div>
        ))}
      </dl>

      <footer className="mt-4 flex gap-4 text-sm">
        <a href={i.link.href} className="text-info underline-offset-4 hover:underline">
          {i.link.label} ↗
        </a>
        <button type="button" onClick={() => {
            setShown(0)
            setRun((r) => r + 1)
          }} className="font-mono text-[12px] text-muted hover:text-accent">
          ↻ {labels.replay}
        </button>
      </footer>
    </article>
  )
}
