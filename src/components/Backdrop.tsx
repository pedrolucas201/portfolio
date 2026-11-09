// Fundo do console: grade fina + "pulsos" de rede atravessando. Só CSS, sem canvas.
const pulses = [
  { top: '18%', delay: '0s', dur: '9s' },
  { top: '46%', delay: '3s', dur: '12s' },
  { top: '74%', delay: '6s', dur: '10s' },
]

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 30% 20%, black 20%, transparent 75%)',
        }}
      />
      {pulses.map((p) => (
        <span
          key={p.top}
          className="absolute h-px w-40 bg-gradient-to-r from-transparent via-ok to-transparent opacity-60"
          style={{ top: p.top, animation: `sweep ${p.dur} linear ${p.delay} infinite` }}
        />
      ))}
      <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-ok/5 blur-3xl" />
    </div>
  )
}
