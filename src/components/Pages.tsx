import { EMAIL, type Content } from '../content'
import { DownloadIcon } from './DownloadIcon'
import { Section } from './Section'

const card = 'rounded-xl border border-line bg-panel/80 p-4 backdrop-blur'

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
