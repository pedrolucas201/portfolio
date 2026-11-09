import type { ReactNode } from 'react'

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="mb-3 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
