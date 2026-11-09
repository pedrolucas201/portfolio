import { useCallback, useEffect, useState } from 'react'

const fromHash = () => decodeURIComponent(location.hash.slice(1))

// Abas abertas + aba ativa, sincronizadas com o #hash (link direto pra uma aba funciona e o "voltar" também).
export function useTabs(initial: string[], isValid: (id: string) => boolean) {
  const [tabs, setTabs] = useState<string[]>(() => {
    const h = fromHash()
    return isValid(h) && !initial.includes(h) ? [...initial, h] : initial
  })
  const [active, setActive] = useState<string>(() => (isValid(fromHash()) ? fromHash() : initial[0]))

  const open = useCallback(
    (id: string) => {
      if (!isValid(id)) return
      setTabs((t) => (t.includes(id) ? t : [...t, id]))
      setActive(id)
      if (fromHash() !== id) history.pushState(null, '', `#${id}`)
    },
    [isValid],
  )

  const close = (id: string) => {
    if (tabs.length === 1) return
    const i = tabs.indexOf(id)
    const next = tabs.filter((t) => t !== id)
    setTabs(next)
    if (active === id) {
      const neighbor = next[Math.max(0, i - 1)]
      setActive(neighbor)
      history.replaceState(null, '', `#${neighbor}`)
    }
  }

  useEffect(() => {
    const onHash = () => open(fromHash())
    window.addEventListener('popstate', onHash)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('popstate', onHash)
      window.removeEventListener('hashchange', onHash)
    }
  }, [open])

  return { tabs, active, open, close }
}
