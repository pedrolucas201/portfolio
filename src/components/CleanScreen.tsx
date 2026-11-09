import { useEffect, useRef } from 'react'

// "Tela limpa": as iniciais como trilhas de circuito que reagem ao cursor (afastam e voltam como mola),
// nós que acendem perto do cursor e "pacotes" de luz correndo pelas trilhas (clique ou automático).
// A física roda num requestAnimationFrame mexendo direto no SVG: o React não re-renderiza a cada quadro.
const U = 48 // passo da grade do fundo
const LETTERS: [number, number][][] = [
  [[1, 5.5], [1, 0.5], [3.5, 0.5], [3.5, 3], [1, 3]], // P
  [[4.5, 0.5], [4.5, 5.5], [6.5, 5.5]], // L
]
const STEP = 12 // espaçamento dos pontos que dobram o traço
const RADIUS = 110 // alcance do cursor
const PUSH = 2.4
const SPRING = 0.06
const DAMPING = 0.82
const PACKET_SPEED = 0.55 // pontos por quadro
const AUTO_PACKET_MS = 2600

type Pt = { rx: number; ry: number; x: number; y: number; vx: number; vy: number }
type Trace = { pts: Pt[]; corners: number[] }
type Packet = { trace: number; u: number }

// Subdivide cada letra em pontos a cada STEP px; guarda onde ficam os cantos (os nós).
function build(): Trace[] {
  return LETTERS.map((letter) => {
    const pts: Pt[] = []
    const corners: number[] = []
    letter.forEach(([cx, cy], i) => {
      const [x, y] = [cx * U, cy * U]
      if (i > 0) {
        const [px, py] = [letter[i - 1][0] * U, letter[i - 1][1] * U]
        const n = Math.max(1, Math.round(Math.hypot(x - px, y - py) / STEP))
        for (let k = 1; k < n; k++) {
          const t = k / n
          const ix = px + (x - px) * t
          const iy = py + (y - py) * t
          pts.push({ rx: ix, ry: iy, x: ix, y: iy, vx: 0, vy: 0 })
        }
      }
      corners.push(pts.length)
      pts.push({ rx: x, ry: y, x, y, vx: 0, vy: 0 })
    })
    return { pts, corners }
  })
}

const pathOf = (pts: Pt[]) => 'M' + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L')

// O botão de voltar é o flutuante do App; aqui fica o Esc.
type Props = { onBack: () => void }

export function CleanScreen({ onBack }: Props) {
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onBack()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  useEffect(() => {
    const el = svg.current
    if (!el) return
    const traces = build()
    const paths = [...el.querySelectorAll<SVGPathElement>('[data-trace]')]
    const nodes = [...el.querySelectorAll<SVGCircleElement>('[data-node]')]
    const packets = [...el.querySelectorAll<SVGCircleElement>('[data-packet]')]
    const draw = () => {
      for (const p of paths) p.setAttribute('d', pathOf(traces[Number(p.dataset.trace)].pts))
    }
    draw()
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let mouse: { x: number; y: number } | null = null
    const live: Packet[] = []
    const toSvg = (e: PointerEvent) => {
      const m = el.getScreenCTM()
      if (!m) return null
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
      return { x: pt.x, y: pt.y }
    }
    const spawn = () => traces.forEach((_, i) => live.push({ trace: i, u: 0 }))
    const onMove = (e: PointerEvent) => (mouse = toSvg(e))
    const onLeave = () => (mouse = null)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', spawn)
    const auto = setInterval(spawn, AUTO_PACKET_MS)
    spawn()

    let frame = 0
    const tick = () => {
      for (const t of traces) {
        for (const p of t.pts) {
          let fx = (p.rx - p.x) * SPRING
          let fy = (p.ry - p.y) * SPRING
          if (mouse) {
            const dx = p.x - mouse.x
            const dy = p.y - mouse.y
            const d = Math.hypot(dx, dy) || 1
            if (d < RADIUS) {
              const f = ((RADIUS - d) / RADIUS) * PUSH
              fx += (dx / d) * f
              fy += (dy / d) * f
            }
          }
          p.vx = (p.vx + fx) * DAMPING
          p.vy = (p.vy + fy) * DAMPING
          p.x += p.vx
          p.y += p.vy
        }
      }
      draw()

      // nós acompanham o canto e acendem perto do cursor
      let n = 0
      for (const t of traces) {
        for (const ci of t.corners) {
          const p = t.pts[ci]
          const near = mouse ? Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / RADIUS) : 0
          const c = nodes[n++]
          c.setAttribute('cx', p.x.toFixed(1))
          c.setAttribute('cy', p.y.toFixed(1))
          c.setAttribute('r', (6 + near * 5).toFixed(1))
          c.style.fill = near > 0.2 ? 'var(--color-accent)' : 'var(--color-bg)'
        }
      }

      // pacotes andam pela trilha; os que chegam no fim somem
      for (let i = live.length - 1; i >= 0; i--) {
        live[i].u += PACKET_SPEED
        if (live[i].u >= traces[live[i].trace].pts.length - 1) live.splice(i, 1)
      }
      packets.forEach((c, i) => {
        const pk = live[i]
        if (!pk) return c.setAttribute('opacity', '0')
        const pts = traces[pk.trace].pts
        const a = pts[Math.floor(pk.u)]
        const b = pts[Math.min(pts.length - 1, Math.floor(pk.u) + 1)]
        const f = pk.u % 1
        c.setAttribute('cx', (a.x + (b.x - a.x) * f).toFixed(1))
        c.setAttribute('cy', (a.y + (b.y - a.y) * f).toFixed(1))
        c.setAttribute('opacity', '1')
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearInterval(auto)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', spawn)
    }
  }, [])

  const nodeCount = LETTERS.reduce((sum, l) => sum + l.length, 0)
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <svg
        ref={svg}
        viewBox={`${-U * 0.5} ${-U * 0.5} ${U * 8.5} ${U * 7}`}
        className="w-full max-w-lg cursor-crosshair touch-none select-none"
        role="img"
        aria-label="PL"
      >
        {LETTERS.map((_, i) => (
          <g key={i}>
            <path data-trace={i} fill="none" stroke="var(--color-line)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <path data-trace={i} className="draw" fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinejoin="round" pathLength={1} />
            <path data-trace={i} className="flow" fill="none" stroke="var(--color-fg)" strokeOpacity={0.5} strokeWidth={1.5} />
          </g>
        ))}
        {Array.from({ length: nodeCount }, (_, i) => (
          <circle key={i} data-node r={6} stroke="var(--color-accent)" strokeWidth={2} fill="var(--color-bg)" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} data-packet r={4.5} fill="var(--color-fg)" opacity={0} style={{ filter: 'drop-shadow(0 0 6px var(--color-accent))' }} />
        ))}
      </svg>
    </div>
  )
}
