import { useEffect, useRef, useState } from 'react'

export type Command = { id: string; label: string; hint?: string; run: () => void }

type Props = { onClose: () => void; commands: Command[]; placeholder: string; empty: string }

// Paleta Ctrl+K. Também é o menu no celular. Teclado: ↑ ↓ Enter Esc.
// Montada só quando aberta: cada abertura começa com busca vazia.
export function CommandPalette({ onClose, commands, placeholder, empty }: Props) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  const q = query.trim().toLowerCase()
  const list = q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands
  const current = Math.min(index, Math.max(0, list.length - 1))

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    input.current?.focus()
    return () => previous?.focus()
  }, [])

  const run = (c?: Command) => {
    if (!c) return
    onClose()
    c.run()
  }

  const move = (step: number) => setIndex((current + step + list.length) % Math.max(1, list.length))
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return onClose()
    if (e.key === 'Enter') return run(list[current])
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    move(e.key === 'ArrowDown' ? 1 : -1)
  }

  return (
    <div className="fixed inset-0 z-40 grid items-start justify-items-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={placeholder}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="w-full max-w-lg animate-rise overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/70"
      >
        <input
          ref={input}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={list[current] ? `cmd-${list[current].id}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIndex(0)
          }}
          placeholder={placeholder}
          className="w-full border-b border-line bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-muted"
        />
        <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-1.5">
          {list.length === 0 && <li className="px-3 py-2 text-sm text-muted">{empty}</li>}
          {list.map((c, i) => (
            <li
              key={c.id}
              id={`cmd-${c.id}`}
              role="option"
              aria-selected={i === current}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(c)}
              className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm ${
                i === current ? 'bg-accent/10 text-accent' : 'text-fg'
              }`}
            >
              {c.label}
              {c.hint && <span className="font-mono text-[11px] text-muted">{c.hint}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
