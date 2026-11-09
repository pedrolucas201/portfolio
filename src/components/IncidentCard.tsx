import type { Content, Incident } from '../content'

type Labels = Content['ui']['incident']

export function IncidentCard({ incident, labels }: { incident: Incident; labels: Labels }) {
  const rows: [string, string][] = [
    [labels.symptom, incident.symptom],
    [labels.cause, incident.cause],
    [labels.fix, incident.fix],
  ]
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
        {incident.date} · {incident.service}
      </p>
      <h3 className="mt-1 font-semibold">{incident.title}</h3>
      <dl className="mt-3 space-y-2 text-sm leading-relaxed">
        {rows.map(([term, text]) => (
          <div key={term}>
            <dt className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
      <a href={incident.link.href} className="mt-3 inline-block text-sm underline underline-offset-4 hover:text-ok">
        {incident.link.label}
      </a>
    </article>
  )
}
