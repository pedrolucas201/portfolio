import { useEffect, useState } from 'react'

// Seção visível no momento, pra destacar no menu lateral.
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0])
  const key = ids.join(',')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const id of key.split(',')) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [key])

  return active
}
