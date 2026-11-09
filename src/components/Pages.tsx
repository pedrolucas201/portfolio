import { content, EMAIL, type Content } from '../content'
import { Cv } from '../Cv'
import { DownloadIcon } from './DownloadIcon'
import { Section } from './Section'

const card = 'rounded-xl border border-line bg-panel/80 p-4 backdrop-blur'

export function NowPage({ c }: { c: Content }) {
  return (
    <Section id="now" title={c.ui.nav.now}>
      <div className={card}>
        <p className="mb-3 font-mono text-[11px] text-muted">{c.now.updated}</p>
        <ul className="space-y-2.5">
          {c.now.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

export function MethodPage({ c }: { c: Content }) {
  return (
    <Section id="method" title={c.ui.nav.method}>
      <ol className="grid gap-3 md:grid-cols-2">
        {c.method.map((m, i) => (
          <li key={m.title} className={card}>
            <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 font-semibold">{m.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-fg/85">{m.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function CvPage({ c }: { c: Content }) {
  return (
    <Section id="cv" title={c.ui.nav.cv}>
      <p className="mb-4 flex flex-wrap gap-2">
        {(['pt', 'en'] as const).map((l) => (
          <a
            key={l}
            href={content[l].cv.href}
            download
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              content[l].cv.href === c.cv.href ? 'bg-accent text-bg hover:bg-accent/85' : 'border border-line hover:border-accent hover:text-accent'
            }`}
          >
            <DownloadIcon />
            {c.cv.label} · {l.toUpperCase()}
          </a>
        ))}
      </p>
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-2xl shadow-black/40">
        <Cv c={c} />
      </div>
    </Section>
  )
}

export function FreelaPage({ c }: { c: Content }) {
  return (
    <Section id="freela" title={c.ui.nav.freela}>
      <div className={card}>
        <p className="leading-relaxed">{c.freela.intro}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {c.freela.offers.map((o) => (
            <li key={o} className="rounded-lg border border-line bg-bg/60 px-3 py-2 text-sm">
              {o}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{c.freela.example}</p>
        <a
          href={c.freela.cta.href}
          className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent/85"
        >
          {c.freela.cta.label} →
        </a>
      </div>
    </Section>
  )
}

export function ContactPage({ c, onCopy }: { c: Content; onCopy: () => void }) {
  return (
    <Section id="contact" title={c.ui.nav.contact}>
      <p className="mb-4 text-muted">{c.ui.contact.intro}</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {c.contacts.map((l) => (
          <li key={l.href} className={`${card} flex items-center justify-between gap-3`}>
            <a href={l.href} className="min-w-0 truncate font-medium hover:text-accent">
              {l.label === EMAIL ? EMAIL : `${l.label} ↗`}
            </a>
            {l.label === EMAIL && (
              <button
                type="button"
                onClick={onCopy}
                className="shrink-0 rounded border border-line px-2 py-1 font-mono text-[11px] text-muted hover:border-accent hover:text-accent"
              >
                {c.ui.contact.copy}
              </button>
            )}
          </li>
        ))}
        <li className={card}>
          <a href={c.cv.href} download className="inline-flex items-center gap-2 font-medium hover:text-accent">
            <DownloadIcon />
            {c.cv.label}
          </a>
        </li>
      </ul>
    </Section>
  )
}
