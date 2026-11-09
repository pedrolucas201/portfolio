import type { Content } from '../content'
import { DownloadIcon } from './DownloadIcon'
import { Icon, type IconName } from './Icon'
import { StatusDot } from './StatusDot'

export type NavItem = { id: string; label: string; icon: IconName }

type Props = {
  c: Content
  items: NavItem[]
  active: string
  openTabs: string[]
  collapsed: boolean
  onToggle: () => void
  onPalette: () => void
  onLang: () => void
}

// Recolhida, vira um trilho só de ícones (com o nome no title/aria-label) e o currículo continua a um clique.
export function Sidebar({ c, items, active, openTabs, collapsed, onToggle, onPalette, onLang }: Props) {
  const services = [...c.work, ...c.projects]
  // Aba aberta ganha uma bolinha: azul se é a ativa, cinza se está aberta em segundo plano.
  const openDot = (id: string, corner = false) =>
    openTabs.includes(id) && (
      <span
        aria-hidden
        className={`size-1.5 shrink-0 rounded-full ${id === active ? 'bg-accent' : 'bg-off'} ${corner ? 'absolute top-1 right-1.5' : 'ml-auto'}`}
      />
    )
  const hide = collapsed ? 'sr-only' : ''
  return (
    <aside
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-panel/70 lowercase backdrop-blur transition-[width] duration-200 lg:flex ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex items-center gap-3 border-b border-line p-3 ${collapsed ? 'flex-col' : ''}`}>
        <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/15 font-mono text-sm font-bold text-accent">
          {c.initials}
        </div>
        <div className={`min-w-0 flex-1 ${hide}`}>
          <p className="truncate text-sm font-semibold">{c.name}</p>
          <p className="truncate font-mono text-[11px] text-muted">{c.role}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? c.ui.nav.expand : c.ui.nav.collapse}
          title={collapsed ? c.ui.nav.expand : c.ui.nav.collapse}
          className="grid size-8 shrink-0 place-items-center rounded-md border border-line text-muted hover:border-accent hover:text-accent"
        >
          <Icon name="panel" />
        </button>
      </div>

      <div className="border-b border-line p-3">
        <a
          href={c.cv.href}
          download
          title={c.ui.palette.download}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-bg hover:bg-accent/85"
        >
          <DownloadIcon />
          <span className={hide}>{c.ui.palette.download}</span>
        </a>
      </div>

      <nav aria-label={c.ui.nav.aria} className="flex-1 overflow-x-hidden overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                title={collapsed ? it.label : undefined}
                aria-current={active === it.id ? 'true' : undefined}
                className={`relative flex items-center gap-2.5 rounded-md py-1.5 text-sm transition-colors ${collapsed ? 'justify-center px-0' : 'px-3'} ${
                  active === it.id ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-panel-2 hover:text-fg'
                }`}
              >
                <Icon name={it.icon} />
                <span className={hide}>{it.label}</span>
                {openDot(it.id, collapsed)}
              </a>
            </li>
          ))}
        </ul>
        {!collapsed && (
          <>
            <p className="mt-6 mb-2 px-3 font-mono text-[10px] tracking-widest text-muted">{c.ui.nav.services}</p>
            <ul className="space-y-0.5">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'true' : undefined}
                    // Serviço já tem a bolinha de status: aba aberta aparece destacando a linha.
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[13px] hover:bg-panel-2 hover:text-fg ${
                      active === s.id ? 'bg-accent/10 text-accent' : openTabs.includes(s.id) ? 'bg-panel-2/60 text-fg' : 'text-muted'
                    }`}
                  >
                    <span className="truncate">{s.name.split(' · ')[0]}</span>
                    <StatusDot status={s.status} />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className={`flex items-center justify-between gap-2 border-t border-line p-3 font-mono text-[11px] ${collapsed ? 'flex-col' : ''}`}>
        <button type="button" onClick={onLang} className="rounded border border-line px-2 py-1 lowercase text-muted hover:text-fg">
          {c.ui.switchLang}
        </button>
        <button
          type="button"
          onClick={onPalette}
          title={`${c.ui.palette.hint} · Ctrl K`}
          className="flex items-center gap-2 rounded border border-line px-2 py-1 lowercase text-muted hover:text-fg"
        >
          {collapsed ? '⌘' : <>{c.ui.palette.hint} <kbd className="text-fg">Ctrl K</kbd></>}
        </button>
      </div>
    </aside>
  )
}
