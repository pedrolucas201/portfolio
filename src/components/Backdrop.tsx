import { useEffect, useRef } from 'react'

// Fundo do console: grade fina + "pulsos" de rede atravessando + uma "lanterna" que acende a grade em volta
// do mouse. Só CSS: o mouse muda duas variáveis CSS (--mx/--my) direto no DOM, sem re-render do React.
const pulses = [
  { top: '18%', delay: '0s', dur: '9s' },
  { top: '46%', delay: '3s', dur: '12s' },
  { top: '74%', delay: '6s', dur: '10s' },
]

const grid = (color: string) =>
  `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`

export function Backdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    // Toque não tem cursor; movimento reduzido dispensa o efeito.
    if (!el || !window.matchMedia?.('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`)
        el.style.setProperty('--my', `${e.clientY}px`)
        el.style.setProperty('--lit', '1')
      })
    }
    const onLeave = () => el.style.setProperty('--lit', '0')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [--lit:0] [--mx:50vw] [--my:30vh]">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: grid('var(--color-line)'),
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 75%)',
        }}
      />
      {/* Lanterna: a mesma grade, em azul, visível só num círculo em volta do cursor. */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 'calc(var(--lit) * 0.55)',
          backgroundImage: grid('var(--color-accent)'),
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(220px circle at var(--mx) var(--my), black, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 'var(--lit)',
          background: 'radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, var(--color-accent) 7%, transparent), transparent 70%)',
        }}
      />
      {pulses.map((p) => (
        <span
          key={p.top}
          className="absolute h-px w-40 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
          style={{ top: p.top, animation: `sweep ${p.dur} linear ${p.delay} infinite` }}
        />
      ))}
      <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-accent/5 blur-3xl" />
    </div>
  )
}
