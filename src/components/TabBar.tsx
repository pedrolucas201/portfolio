export type Tab = { id: string; label: string; icon: string }

type Props = {
  tabs: Tab[]
  active: string
  onSelect: (id: string) => void
  onClose: (id: string) => void
  closeLabel: string
  ariaLabel: string
}

// Barra de abas abertas. É navegação (cada aba é uma "página" com #hash próprio), por isso nav + aria-current
// em vez de tablist: o botão de fechar dentro de um tablist não é válido pra leitor de tela.
export function TabBar({ tabs, active, onSelect, onClose, closeLabel, ariaLabel }: Props) {
  return (
    <nav aria-label={ariaLabel} className="border-b border-line bg-bg/60 backdrop-blur">
      <ul className="flex gap-1 overflow-x-auto px-2 pt-2 [scrollbar-width:none]">
        {tabs.map((t) => {
          const selected = t.id === active
          return (
            <li
              key={t.id}
              className={`group flex shrink-0 items-center rounded-t-lg border border-b-0 text-[13px] transition-colors ${
                selected ? 'border-line bg-panel text-fg' : 'border-transparent text-muted hover:bg-panel/60 hover:text-fg'
              }`}
            >
              <button
                type="button"
                id={`tab-${t.id}`}
                aria-current={selected ? 'page' : undefined}
                onClick={() => onSelect(t.id)}
                className="flex items-center gap-2 py-1.5 pr-1 pl-3 lowercase"
              >
                <span aria-hidden className={`font-mono text-[12px] ${selected ? 'text-accent' : ''}`}>
                  {t.icon}
                </span>
                {t.label}
              </button>
              {tabs.length > 1 && (
                <button
                  type="button"
                  aria-label={`${closeLabel} ${t.label}`}
                  onClick={() => onClose(t.id)}
                  className={`mr-1 grid size-6 place-items-center rounded text-[12px] leading-none hover:bg-line hover:text-fg ${
                    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                  }`}
                >
                  ×
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
