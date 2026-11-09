import type { Content } from '../content'
import { StatusDot } from './StatusDot'

export type NavItem = { id: string; label: string }

type Props = { c: Content; items: NavItem[]; active: string; onPalette: () => void; onLang: () => void }

export function Sidebar({ c, items, active, onPalette, onLang }: Props) {
  const services = [...c.work, ...c.projects]
  return (
    <aside className="sticky top-0 lowercase hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-panel/70 backdrop-blur lg:flex">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <div className="grid size-9 place-items-center rounded-lg border border-accent/40 bg-accent/15 font-mono text-sm font-bold text-accent">
          {c.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{c.name}</p>
          <p className="truncate font-mono text-[11px] text-muted">{c.role}</p>
        </div>
      </div>

      <div className="border-b border-line p-3">
        <a
          href={c.cv.href}
          download
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-bg hover:bg-accent/85"
        >
          ↓ {c.ui.palette.download}
        </a>
      </div>

      <nav aria-label={c.ui.nav.aria} className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={active === it.id ? 'true' : undefined}
                className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active === it.id ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-panel-2 hover:text-fg'
                }`}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 mb-2 px-3 font-mono text-[10px] tracking-widest text-muted">{c.ui.nav.services}</p>
        <ul className="space-y-0.5">
          {services.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[13px] text-muted hover:bg-panel-2 hover:text-fg"
              >
                <span className="truncate">{s.name.split(' · ')[0]}</span>
                <StatusDot status={s.status} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-line p-3 font-mono text-[11px]">
        <button type="button" onClick={onLang} className="rounded border border-line px-2 py-1 text-muted hover:text-fg">
          {c.ui.switchLang}
        </button>
        <button type="button" onClick={onPalette} className="flex items-center gap-2 rounded border border-line px-2 py-1 text-muted hover:text-fg">
          {c.ui.palette.hint} <kbd className="text-fg">Ctrl K</kbd>
        </button>
      </div>
    </aside>
  )
}
