import type { Content } from '../content'

type Props = Pick<Content, 'name' | 'role' | 'availability' | 'location' | 'summary' | 'contacts' | 'cv' | 'ui'>

export function Header({ name, role, availability, location, summary, contacts, cv, ui }: Props) {
  return (
    <header>
      <p className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-xs text-green-800 dark:text-green-300">
        <span aria-hidden className="size-2 animate-pulse rounded-full bg-ok motion-reduce:animate-none" />
        {availability}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{name}</h1>
      <p className="mt-1 text-lg text-zinc-700 dark:text-zinc-300">{role}</p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{location}</p>
      <nav aria-label={ui.contactNav} className="mt-4 flex flex-wrap gap-2">
        {contacts.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:border-ok hover:text-ok dark:border-zinc-700"
          >
            {c.label}
          </a>
        ))}
        <a
          href={cv.href}
          download
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-ok dark:bg-zinc-100 dark:text-zinc-900"
        >
          {cv.label}
        </a>
      </nav>
      <p className="mt-5 leading-relaxed">{summary}</p>
    </header>
  )
}
