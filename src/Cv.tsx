import type { ReactNode } from 'react'
import { PHONE, type Content, type Service } from './content'

// Texto do link visível no papel: "github.com/pedrolucas201" em vez de "GitHub".
const printable = (href: string) => href.replace(/^(mailto:|https?:\/\/(www\.)?)/, '')

function Entry({ s }: { s: Service }) {
  return (
    <div className="mb-3 break-inside-avoid">
      <p>
        <strong>{s.name}</strong>
        {s.period && <span className="text-zinc-600"> · {s.period}</span>}
      </p>
      {s.role && <p className="italic">{s.role}</p>}
      <p>{s.summary}</p>
      <p className="text-zinc-600">
        {s.stack.join(' · ')}
        {s.live && ` · ${printable(s.live)}`}
        {s.links?.map((l) => ` · ${printable(l.href)}`)}
      </p>
    </div>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-1.5 border-b border-zinc-400 text-xs font-bold tracking-wider uppercase">{title}</h2>
      {children}
    </section>
  )
}

export function Cv({ c }: { c: Content }) {
  return (
    <main className="mx-auto max-w-[180mm] bg-white p-6 text-[10pt] leading-snug text-zinc-900 print:p-0">
      <h1 className="text-2xl font-bold">{c.fullName}</h1>
      <p className="text-base">{c.role}</p>
      <p className="text-zinc-600">
        {c.location} · {c.availability}
      </p>
      <p className="mt-1">
        {c.contacts.map((l, i) => (
          <span key={l.href}>
            {i > 0 && ' · '}
            <a href={l.href}>{printable(l.href)}</a>
          </span>
        ))}
        {' · '}
        <a href={PHONE.href}>{PHONE.label}</a>
      </p>
      <p className="mt-3">{c.summary}</p>

      <Block title={c.ui.cvWork}>
        {c.work.map((s) => (
          <Entry key={s.name} s={s} />
        ))}
      </Block>
      <Block title={c.ui.projects}>
        {c.projects.map((s) => (
          <Entry key={s.name} s={s} />
        ))}
      </Block>
      <Block title={c.ui.nav.stack}>
        <p>
          <strong>{c.ui.stackProd}:</strong> {c.stack.prod.join(', ')}
        </p>
        <p>
          <strong>{c.ui.stackKnown}:</strong> {c.stack.known.join(', ')}
        </p>
      </Block>
      <Block title={c.ui.education}>
        {c.education.map((e) => (
          <p key={e}>{e}</p>
        ))}
      </Block>
    </main>
  )
}
