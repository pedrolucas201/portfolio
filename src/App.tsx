import { useCallback, useEffect, useMemo, useState } from 'react'
import { content, EMAIL, type Lang } from './content'
import { Backdrop } from './components/Backdrop'
import { Boot } from './components/Boot'
import { CommandPalette, type Command } from './components/CommandPalette'
import { Deploys } from './components/Deploys'
import { IncidentReplay } from './components/IncidentReplay'
import { Overview } from './components/Overview'
import { Section } from './components/Section'
import { ServiceCard } from './components/ServiceCard'
import { Sidebar, type NavItem } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { useGithubActivity } from './hooks/useGithubActivity'
import { useScrollSpy } from './hooks/useScrollSpy'

const initialLang = (): Lang => (navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en')

// A abertura só roda na primeira visita da sessão e nunca com movimento reduzido.
function shouldBoot(): boolean {
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem('booted') !== '1'
  } catch {
    return false
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [booting, setBooting] = useState(shouldBoot)
  const [palette, setPalette] = useState(false)
  const [toast, setToast] = useState('')
  const activity = useGithubActivity()
  const c = content[lang]

  const nav: NavItem[] = useMemo(
    () => [
      { id: 'overview', label: c.ui.nav.overview },
      { id: 'work', label: c.ui.nav.work },
      { id: 'projects', label: c.ui.nav.projects },
      { id: 'incidents', label: c.ui.nav.incidents },
      { id: 'deploys', label: c.ui.nav.deploys },
      { id: 'stack', label: c.ui.nav.stack },
    ],
    [c],
  )
  const active = useScrollSpy(nav.map((n) => n.id))

  const toggleLang = useCallback(() => setLang((l) => (l === 'pt' ? 'en' : 'pt')), [])
  const endBoot = useCallback(() => {
    setBooting(false)
    try {
      sessionStorage.setItem('booted', '1')
    } catch {
      /* sem storage: a abertura volta na próxima visita, sem problema */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const commands: Command[] = [
    ...nav.map((n) => ({ id: `go-${n.id}`, label: n.label, hint: '#', run: () => go(n.id) })),
    ...[...c.work, ...c.projects].map((s) => ({ id: `svc-${s.id}`, label: s.name, hint: c.ui.statusLabel[s.status], run: () => go(s.id) })),
    {
      id: 'copy-email',
      label: c.ui.palette.copyEmail,
      hint: EMAIL,
      run: () => navigator.clipboard?.writeText(EMAIL).then(() => setToast(c.ui.palette.copied)),
    },
    { id: 'cv', label: c.ui.palette.download, hint: 'PDF', run: () => window.open(c.cv.href, '_self') },
    ...c.contacts.slice(1).map((l) => ({ id: `open-${l.label}`, label: l.label, hint: '↗', run: () => window.open(l.href, '_blank') })),
    { id: 'lang', label: c.ui.switchLang === 'EN' ? 'English' : 'Português', hint: c.ui.switchLang, run: toggleLang },
  ]

  return (
    <>
      <Backdrop />
      {booting && <Boot boot={c.ui.boot} name={c.name} onDone={endBoot} />}

      <div className="flex">
        <Sidebar c={c} items={nav} active={active} onPalette={() => setPalette(true)} onLang={toggleLang} />
        <div className="min-w-0 flex-1">
          <TopBar c={c} onPalette={() => setPalette(true)} onLang={toggleLang} />
          <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-8">
            <section id="overview" aria-label={c.ui.nav.overview} className="scroll-mt-16 pt-6 sm:pt-10">
              <Overview c={c} commits={activity && activity !== 'error' ? activity.commits.length : null} />
            </section>

            <Section id="work" title={c.ui.nav.work}>
              <ul className="grid gap-3">
                {c.work.map((s) => (
                  <ServiceCard key={s.id} service={s} ui={c.ui} />
                ))}
              </ul>
            </Section>

            <Section id="projects" title={c.ui.nav.projects}>
              <ul className="grid gap-3 md:grid-cols-2">
                {c.projects.map((s) => (
                  <ServiceCard key={s.id} service={s} ui={c.ui} />
                ))}
              </ul>
            </Section>

            <Section id="incidents" title={c.ui.nav.incidents}>
              {c.incidents.map((i) => (
                <IncidentReplay key={i.date + i.service} incident={i} labels={c.ui.incident} />
              ))}
            </Section>

            <Section id="deploys" title={c.ui.nav.deploys}>
              <Deploys activity={activity} labels={c.ui.deploys} lang={lang === 'pt' ? 'pt-BR' : 'en'} />
            </Section>

            <Section id="stack" title={c.ui.nav.stack}>
              <div className="grid gap-4 md:grid-cols-2">
                {(
                  [
                    [c.ui.stackProd, c.stack.prod, true],
                    [c.ui.stackKnown, c.stack.known, false],
                  ] as const
                ).map(([label, items, prod]) => (
                  <div key={label} className="rounded-xl border border-line bg-panel/80 p-4 backdrop-blur">
                    <p className="mb-3 font-mono text-[11px] tracking-widest text-muted uppercase">{label}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {items.map((t) => (
                        <li
                          key={t}
                          className={`rounded-md border px-2 py-1 font-mono text-[12px] ${prod ? 'border-ok/30 bg-ok/10 text-ok' : 'border-line text-muted'}`}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {c.education.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Section>
          </main>
        </div>
      </div>

      {palette && (
        <CommandPalette
        onClose={() => setPalette(false)}
        commands={commands}
        placeholder={c.ui.palette.placeholder}
        empty={c.ui.palette.none}
        />
      )}
      {toast && (
        <p role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-rise rounded-lg border border-ok/40 bg-panel px-4 py-2 font-mono text-sm text-ok">
          ✓ {toast}
        </p>
      )}
    </>
  )
}
