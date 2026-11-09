import type { ReactNode } from 'react'

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        <span className="text-accent">//</span>
        {title}
        <span aria-hidden className="h-px flex-1 bg-line" />
      </h2>
      {children}
    </section>
  )
}
