import type { ReactNode } from 'react'
import { content, EMAIL, type Content, type Lang, type Service } from '../content'
import { DownloadIcon } from './DownloadIcon'
import { Icon, type IconName } from './Icon'

// Currículo dentro do site, no visual do console. Sai do mesmo content.ts que gera o PDF: nunca diverge.
const shortHref = (href: string) => href.replace(/^(mailto:|https?:\/\/(www\.)?)/, '')
const contactIcon = (href: string): IconName => (href.startsWith('mailto:') ? 'mail' : href.includes('github') ? 'code' : 'globe')

function Heading({ children }: { children: ReactNode }) {
  return <h3 className="mt-7 mb-3 font-mono text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">{children}</h3>
}

function Entry({ s }: { s: Service }) {
  return (
    <article className="border-b border-line py-4 last:border-0">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-semibold">
          {s.name}
          {(s.live || s.links?.[0]) && (
            <a href={s.live ?? s.links![0].href} aria-label={s.live ?? s.links![0].label} className="ml-1.5 text-muted hover:text-accent">
              ↗
            </a>
          )}
        </h4>
        {s.period && <span className="font-mono text-[12px] text-muted">{s.period}</span>}
      </header>
      {s.role && <p className="mt-0.5 font-mono text-[12px] text-accent">{s.role}</p>}
      <p className="mt-2 text-sm leading-relaxed text-fg/85">{s.summary}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {s.stack.map((t) => (
          <li key={t} className="rounded border border-line bg-bg/60 px-1.5 py-0.5 font-mono text-[11px] text-muted">
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function CvPage({ c }: { c: Content }) {
  const other: Lang = c.cv.href === content.pt.cv.href ? 'en' : 'pt'
  return (
    <section aria-labelledby="cv-title" className="rounded-2xl border border-line bg-panel/80 p-4 backdrop-blur sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="cv-title" className="font-mono text-sm font-semibold">
            {c.ui.nav.cv}
          </h2>
          <p className="mt-0.5 font-mono text-[11px] text-muted">{c.ui.cvPage.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={content[other].cv.href}
            download
            className="rounded-lg border border-line px-3 py-2 font-mono text-[12px] text-muted hover:border-accent hover:text-accent"
          >
            {other.toUpperCase()}
          </a>
          <a
            href={c.cv.href}
            download
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-bg hover:bg-accent/85"
          >
            <DownloadIcon />
            {c.ui.cvPage.download}
          </a>
        </div>
      </header>

      <div className="mt-5 rounded-xl border border-line bg-bg/50 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-line pb-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-xl border border-accent/40 bg-gradient-to-br from-accent/25 to-info/10 font-mono text-xl font-bold text-accent">
              {c.initials}
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{c.fullName}</p>
              <p className="font-medium text-accent">{c.role}</p>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[12px] text-muted">
                <Icon name="pin" className="size-3.5" />
                {c.location}
              </p>
            </div>
          </div>
          <ul className="space-y-1 font-mono text-[12px] text-muted">
            {c.contacts.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="flex items-center gap-2 hover:text-accent">
                  <Icon name={contactIcon(l.href)} className="size-3.5" />
                  {l.label === EMAIL ? EMAIL : shortHref(l.href)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Heading>{c.ui.cvPage.summary}</Heading>
        <p className="leading-relaxed text-fg/90">{c.summary}</p>
        <p className="mt-1 font-mono text-[12px] text-muted">{c.availability}</p>

        <Heading>{c.ui.cvPage.skills}</Heading>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              [c.ui.stackProd, c.stack.prod],
              [c.ui.stackKnown, c.stack.known],
            ] as const
          ).map(([label, items]) => (
            <div key={label} className="rounded-lg border border-line bg-panel/60 p-3">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-1 font-mono text-[12px] leading-relaxed text-muted">{items.join(' · ')}</p>
            </div>
          ))}
        </div>

        <Heading>{c.ui.cvWork}</Heading>
        {c.work.map((s) => (
          <Entry key={s.id} s={s} />
        ))}

        <Heading>{c.ui.projects}</Heading>
        {c.projects.map((s) => (
          <Entry key={s.id} s={s} />
        ))}

        <Heading>{c.ui.education}</Heading>
        <ul className="space-y-1 text-sm">
          {c.education.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
