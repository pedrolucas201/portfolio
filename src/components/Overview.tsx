import type { Content } from '../content'

type Props = { c: Content; commits: number | null }

// Cartão de perfil + indicadores. Tudo que um recrutador precisa nos primeiros 30 s está aqui.
export function Overview({ c, commits }: Props) {
  const all = [...c.work, ...c.projects]
  const kpis: [string, string | number][] = [
    [c.ui.kpi.operational, all.filter((s) => s.status === 'ok').length],
    [c.ui.kpi.commits, commits ?? '…'],
    [c.ui.kpi.incidents, c.incidents.length],
    [c.ui.kpi.stack, c.stack.prod.length],
  ]

  return (
    <div className="grid gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur sm:p-6">
        <div aria-hidden className="absolute -top-24 -right-24 size-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/25 to-info/10 font-mono text-xl font-bold text-accent">
            {c.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] text-accent">
              <span aria-hidden className="size-1.5 animate-pulse-ring rounded-full bg-accent" />
              {c.availability}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{c.name}</h1>
            <p className="mt-0.5 text-lg text-fg/80">{c.role}</p>
            <p className="text-sm text-muted">{c.location}</p>
          </div>
        </div>
        <nav aria-label={c.ui.contactNav} className="relative mt-5 flex flex-wrap gap-2">
          {c.contacts.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg border border-line bg-bg/60 px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <a href={c.cv.href} download className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-bg hover:bg-accent/85">
            ↓ {c.cv.label}
          </a>
        </nav>
        <p className="relative mt-5 max-w-2xl leading-relaxed text-fg/90">{c.summary}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map(([label, value], i) => (
          <div
            key={label}
            className="animate-rise rounded-xl border border-line bg-panel/80 p-4 backdrop-blur"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <dd className="font-mono text-2xl font-semibold text-accent">{value}</dd>
            <dt className="mt-1 text-xs text-muted">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
