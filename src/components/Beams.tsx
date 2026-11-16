import { useEffect, useRef } from 'react'

// Feixes de luz correndo pelas linhas da grade do fundo, com um brilho onde dois feixes se cruzam.
// Técnica adaptada do Grid Beam da Cult UI (MIT, © Nolly Studio, github.com/nolly-studio/cult-ui):
// lá a grade é dividida em N×M e todo divisor tem feixe; aqui os feixes seguem a grade de 48 px
// do <Backdrop>, são poucos e numa cor só.
// Custo: ~12 traços por quadro, sem gradiente radial. Não roda com movimento reduzido, para com a aba
// oculta e só começa quando o navegador fica ocioso (não disputa o primeiro paint).
const CELL = 48
const COLORS = ['96,165,250', '103,232,249'] // accent, info
const EVERY = 4 // uma linha da grade a cada 4 ganha feixe

type Beam = { line: number; speed: number; offset: number; color: string }

const beams = (count: number, seed: number): Beam[] =>
  Array.from({ length: Math.max(1, Math.floor(count / EVERY)) }, (_, i) => ({
    line: (i * EVERY + ((i * 7 + seed) % 3) + 1) * CELL,
    speed: 0.05 + ((i * 13 + seed) % 5) * 0.012, // fração da tela por segundo
    offset: ((i * 37 + seed * 11) % 100) / 100,
    color: COLORS[(i + seed) % 2],
  }))

export function Beams() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let w = 0
    let h = 0
    let rows: Beam[] = []
    let cols: Beam[] = []
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rows = beams(Math.floor(h / CELL), 1)
      cols = beams(Math.floor(w / CELL), 2)
    }

    let frame = 0
    let start = 0
    let last = 0
    // Celular: 30 fps poupa bateria (rAF contínuo com a tela ligada pesa); no desktop, ~60.
    const minGap = window.matchMedia?.('(pointer: coarse)').matches ? 32 : 15
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      if (now - last < minGap) return // teto de fps: tela de 120/144 Hz não desenha em dobro
      last = now
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      const len = CELL * 2.2
      const heads = (list: Beam[], span: number) => list.map((b) => ((t * b.speed + b.offset) % 1) * (span + 2 * len) - len)
      const hx = heads(rows, w)
      const vy = heads(cols, h)

      // Halo largo e fraco + núcleo fino e forte, os dois com o mesmo degradê (cauda → cabeça → cauda).
      const stroke = (b: Beam, x0: number, y0: number, x1: number, y1: number) => {
        for (const [width, alpha] of [[6, 0.14], [1.5, 0.95]]) {
          const g = ctx.createLinearGradient(x0, y0, x1, y1)
          g.addColorStop(0, `rgba(${b.color},0)`)
          g.addColorStop(0.7, `rgba(${b.color},${alpha})`)
          g.addColorStop(1, `rgba(${b.color},0)`)
          ctx.lineWidth = width
          ctx.strokeStyle = g
          ctx.beginPath()
          ctx.moveTo(x0, y0)
          ctx.lineTo(x1, y1)
          ctx.stroke()
        }
      }
      rows.forEach((b, i) => stroke(b, hx[i] - len, b.line, hx[i] + len, b.line))
      cols.forEach((b, i) => stroke(b, b.line, vy[i] - len, b.line, vy[i] + len))

      // Cruzamento: acende quando os dois feixes passam perto do mesmo nó.
      rows.forEach((r, i) =>
        cols.forEach((c, j) => {
          const near = Math.max(0, 1 - Math.hypot(hx[i] - c.line, vy[j] - r.line) / (CELL * 0.8))
          if (!near) return
          ctx.fillStyle = `rgba(186,220,255,${(near * 0.9).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(c.line, r.line, 1 + near * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }),
      )
    }

    const play = () => {
      cancelAnimationFrame(frame)
      if (document.hidden) return
      frame = requestAnimationFrame(draw)
    }
    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(size, 150)
    }

    const hasIdle = 'requestIdleCallback' in window // Safari não tem
    const boot = () => {
      size()
      start = performance.now()
      canvas.style.opacity = '1'
      play()
      window.addEventListener('resize', onResize)
      document.addEventListener('visibilitychange', play)
    }
    const startup = hasIdle ? requestIdleCallback(boot, { timeout: 2500 }) : window.setTimeout(boot, 1200)

    return () => {
      if (hasIdle) cancelIdleCallback(startup)
      else clearTimeout(startup)
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', play)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-1000"
      style={{ maskImage: 'radial-gradient(ellipse at 30% 20%, black 25%, transparent 80%)' }}
    />
  )
}
