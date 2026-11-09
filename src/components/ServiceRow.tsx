import type { Service } from '../content'
import { StatusDot } from './StatusDot'

export function ServiceRow({ service, statusLabel }: { service: Service; statusLabel: string }) {
  return (
    <li className="border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-semibold">{service.name}</h3>
        <StatusDot status={service.status} label={statusLabel} />
      </div>
      {(service.role || service.period) && (
        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
          {[service.role, service.period].filter(Boolean).join(' · ')}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed">{service.summary}</p>
      <p className="mt-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">{service.stack.join(' · ')}</p>
      {service.links && (
        <p className="mt-2 flex gap-4 text-sm">
          {service.links.map((l) => (
            <a key={l.href} href={l.href} className="underline underline-offset-4 hover:text-ok">
              {l.label}
            </a>
          ))}
        </p>
      )}
    </li>
  )
}
