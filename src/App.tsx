import { useEffect, useState } from 'react'
import { content, type Lang } from './content'
import { Header } from './components/Header'
import { IncidentCard } from './components/IncidentCard'
import { Section } from './components/Section'
import { ServiceRow } from './components/ServiceRow'

const initialLang = (): Lang => (navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en')

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const c = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-14">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          className="font-mono text-xs text-zinc-600 dark:text-zinc-400 underline underline-offset-4 hover:text-ok"
        >
          {c.ui.switchLang}
        </button>
      </div>

      <Header {...c} />

      <Section id="work" title={c.ui.sections.work}>
        <ul>
          {c.work.map((s) => (
            <ServiceRow key={s.name} service={s} statusLabel={c.ui.statusLabel[s.status]} />
          ))}
        </ul>
      </Section>

      <Section id="projects" title={c.ui.sections.projects}>
        <ul>
          {c.projects.map((s) => (
            <ServiceRow key={s.name} service={s} statusLabel={c.ui.statusLabel[s.status]} />
          ))}
        </ul>
      </Section>

      <Section id="incidents" title={c.ui.sections.incidents}>
        {c.incidents.map((i) => (
          <IncidentCard key={i.date + i.service} incident={i} labels={c.ui.incident} />
        ))}
      </Section>

      <Section id="stack" title={c.ui.sections.stack}>
        <dl className="space-y-3 text-sm">
          {(
            [
              [c.ui.stackProd, c.stack.prod],
              [c.ui.stackKnown, c.stack.known],
            ] as const
          ).map(([label, items]) => (
            <div key={label}>
              <dt className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{label}</dt>
              <dd className="mt-1">{items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="education" title={c.ui.sections.education}>
        <ul className="space-y-1 text-sm">
          {c.education.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Section>
    </main>
  )
}
