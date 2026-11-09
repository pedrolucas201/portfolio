import type { Diagram as DiagramData } from '../content'

// Diagrama de fluxo em SVG puro: nós em % do quadro, arestas com "tráfego" animado.
export function Diagram({ data, title }: { data: DiagramData; title: string }) {
  const at = (id: string) => data.nodes.find((n) => n.id === id)!
  return (
    <figure className="mt-4">
      <figcaption className="mb-2 font-mono text-[11px] tracking-widest text-muted uppercase">{title}</figcaption>
      <div className="relative h-44 rounded-lg border border-line bg-bg/60">
        <svg className="absolute inset-0 size-full" aria-hidden>
          {data.edges.map((e) => {
            const a = at(e.from)
            const b = at(e.to)
            return (
              <g key={e.from + e.to}>
                <line x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`} stroke="var(--color-line)" strokeWidth={2} />
                <line className="flow" x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`} stroke="var(--color-ok)" strokeWidth={1.5} />
              </g>
            )
          })}
        </svg>
        {data.edges
          .filter((e) => e.label)
          .map((e) => {
            const a = at(e.from)
            const b = at(e.to)
            return (
              <span
                key={`l-${e.from}-${e.to}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded bg-panel px-1.5 font-mono text-[10px] text-warn"
                style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2}%` }}
              >
                {e.label}
              </span>
            )
          })}
        <ul>
          {data.nodes.map((n) => (
            <li
              key={n.id}
              className="absolute max-w-28 -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-panel-2 px-2 py-1 text-center font-mono text-[11px] leading-tight text-fg shadow-lg shadow-black/40"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.label}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
