import { useEffect, useState, type CSSProperties } from 'react'

// Número que rola como odômetro: cada dígito é uma coluna 0–9 que desliza até o valor (só CSS transform).
// Ideia do Rolling Number da Cult UI (MIT); o código é outro, sem `motion` (o chunk dele dava ~48 KB gzip).
// Leitor de tela lê o valor final; com movimento reduzido o CSS global zera a transição.
// Quando termina, as colunas viram texto puro (Ctrl+F, copiar e o Google leem "126", não "0123...").
type Props = { value: number; ready: boolean }
const DURATION = 1400
const STAGGER = 90

export function Odometer({ value, ready }: Props) {
  const [go, setGo] = useState(false)
  const [done, setDone] = useState(false)
  const digits = String(value).split('')
  const total = DURATION + (digits.length - 1) * STAGGER

  useEffect(() => {
    if (!ready) return
    // Dois quadros: o navegador pinta os dígitos em 0 antes de mandar pro valor, senão não há transição.
    let id = requestAnimationFrame(() => (id = requestAnimationFrame(() => setGo(true))))
    return () => cancelAnimationFrame(id)
  }, [ready])

  useEffect(() => {
    if (!go) return
    const t = setTimeout(() => setDone(true), total + 50)
    return () => clearTimeout(t)
  }, [go, total])

  if (done) return value
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {digits.map((d, i) => (
          <span key={i} className="inline-block h-[1lh] overflow-hidden">
            <span
              className="flex flex-col transition-transform duration-(--d) ease-[cubic-bezier(.16,1,.3,1)]"
              style={{ '--d': `${DURATION}ms`, transform: `translateY(-${go ? Number(d) * 10 : 0}%)`, transitionDelay: `${i * STAGGER}ms` } as CSSProperties}
            >
              {'0123456789'.split('').map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  )
}
