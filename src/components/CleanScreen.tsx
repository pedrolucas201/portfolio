import { useEffect } from 'react'

// "Tela limpa": some o painel e ficam as iniciais desenhadas como trilhas de circuito na grade do fundo,
// com o mesmo tráfego tracejado dos diagramas. Esc ou o botão voltam pra aba.
const U = 48 // passo da grade do fundo
const TRACES = [
  // P: haste, barra de cima, descida e volta pra haste
  `M${U},${U * 5.5} V${U * 0.5} H${U * 3.5} V${U * 3} H${U}`,
  // L
  `M${U * 4.5},${U * 0.5} V${U * 5.5} H${U * 6.5}`,
]
const NODES: [number, number][] = [
  [1, 5.5], [1, 0.5], [3.5, 0.5], [3.5, 3], [1, 3],
  [4.5, 0.5], [4.5, 5.5], [6.5, 5.5],
].map(([x, y]) => [x * U, y * U])

type Props = { backLabel: string; onBack: () => void }

export function CleanScreen({ backLabel, onBack }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onBack()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <svg viewBox={`0 0 ${U * 7.5} ${U * 6}`} className="w-full max-w-md" role="img" aria-label="PL">
        {TRACES.map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--color-line)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} className="draw" fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinejoin="round" pathLength={1} />
            <path d={d} className="flow" fill="none" stroke="var(--color-fg)" strokeOpacity={0.55} strokeWidth={1.5} />
          </g>
        ))}
        {NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={6}
            className="animate-pulse-ring text-accent"
            fill="var(--color-bg)"
            stroke="var(--color-accent)"
            strokeWidth={2}
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </svg>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-full border border-line bg-panel/80 px-4 py-2 text-sm backdrop-blur hover:border-accent hover:text-accent"
      >
        ← {backLabel}
      </button>
    </div>
  )
}
