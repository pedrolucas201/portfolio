import { useEffect, useState } from 'react'
import type { Content } from '../content'

const STEP_MS = 280

type Props = { boot: Content['ui']['boot']; name: string; onDone: () => void }

// Abertura curta (~2 s) que já responde o essencial. O site está montado por baixo: não é pedágio.
export function Boot({ boot, name, onDone }: Props) {
  const [shown, setShown] = useState(0)
  const total = boot.lines.length + 1

  useEffect(() => {
    if (shown > total) {
      const t = setTimeout(onDone, 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((n) => n + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [shown, total, onDone])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onDone()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  return (
    <div
      role="status"
      aria-label={boot.done}
      className={`fixed inset-0 z-50 grid place-items-center bg-bg/95 px-4 backdrop-blur transition-opacity duration-300 ${shown > total ? 'opacity-0' : ''}`}
    >
      <div className="w-full max-w-md rounded-xl border border-line bg-panel p-5 font-mono text-[13px] shadow-2xl shadow-black/60">
        <p className="mb-4 flex items-center justify-between text-muted">
          <span>
            <span className="text-accent">●</span> {name.toLowerCase().replace(' ', '.')}
            <span className="text-muted">/health</span>
          </span>
          <button type="button" onClick={onDone} className="rounded px-1 hover:text-fg">
            [{boot.skip}]
          </button>
        </p>
        <ul className="space-y-1.5">
          {boot.lines.map(([k, v], idx) => (
            <li key={k} className={`flex justify-between gap-4 ${idx < shown ? 'animate-rise' : 'invisible'}`}>
              <span className="text-muted">{k}</span>
              <span className="text-accent">{v}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 h-1 overflow-hidden rounded bg-line">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${Math.min(100, (shown / total) * 100)}%` }}
          />
        </div>
        <p className="mt-3 h-5 text-accent">
          {shown >= total ? `✓ ${boot.done}` : <span className="animate-blink">▍</span>}
        </p>
      </div>
    </div>
  )
}
