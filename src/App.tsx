import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, EMAIL, type Lang, type Service } from './content'
import { Backdrop } from './components/Backdrop'
import { Boot } from './components/Boot'
import { CommandPalette, type Command } from './components/CommandPalette'
import { Deploys } from './components/Deploys'
import { IncidentReplay } from './components/IncidentReplay'
import { Overview } from './components/Overview'
import { CvPage } from './components/CvPage'
import { ContactPage, MethodPage, NowPage } from './components/Pages'
import { RequestPage } from './components/RequestPage'
import { Section } from './components/Section'
import { ServiceCard } from './components/ServiceCard'
import type { IconName } from './components/Icon'
import { Sidebar, type NavItem } from './components/Sidebar'
import { StackPage } from './components/StackPage'
import { TabBar, type Tab } from './components/TabBar'
import { TopBar } from './components/TopBar'
import { useGithubActivity } from './hooks/useGithubActivity'
import { useTabs } from './hooks/useTabs'

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

const SECTIONS = ['overview', 'work', 'projects', 'now', 'method', 'incidents', 'deploys', 'stack', 'cv', 'requests', 'contact'] as const
type SectionId = (typeof SECTIONS)[number]
const ICON: Record<SectionId, IconName> = {
  overview: 'user',
  work: 'briefcase',
  projects: 'folder',
  now: 'activity',
  method: 'checks',
  incidents: 'alert',
  deploys: 'commit',
  stack: 'layers',
  cv: 'file',
  requests: 'mail',
  contact: 'at',
}
// O console já abre "povoado": quem chega vê o resumo e as abas principais sem procurar.
const START_TABS = ['overview', 'work', 'projects', 'now']

const SERVICES: Service[] = [...content.pt.work, ...content.pt.projects]
const isSection = (id: string): id is SectionId => (SECTIONS as readonly string[]).includes(id)
const isTab = (id: string) => isSection(id) || SERVICES.some((s) => s.id === id)

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [booting, setBooting] = useState(shouldBoot)
  const [palette, setPalette] = useState(false)
  const [toast, setToast] = useState('')
  const activity = useGithubActivity()
  const { tabs, active, open, close } = useTabs(START_TABS, isTab)
  const c = content[lang]

  const nav: NavItem[] = useMemo(() => SECTIONS.map((id) => ({ id, label: c.ui.nav[id], icon: ICON[id] })), [c])
  const service = (id: string) => [...c.work, ...c.projects].find((s) => s.id === id)

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

  // Aba nova começa do topo, não no ponto onde a anterior estava rolada.
  useEffect(() => {
    window.scrollTo?.({ top: 0 })
  }, [active])

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

  const copyEmail = () => navigator.clipboard?.writeText(EMAIL).then(() => setToast(c.ui.palette.copied))

  const tabBar: Tab[] = tabs.map((id) =>
    isSection(id)
      ? { id, label: c.ui.nav[id], icon: ICON[id] }
      : { id, label: service(id)!.name.split(' · ')[0], icon: 'server' },
  )

  const commands: Command[] = [
    ...nav.map((n) => ({ id: `go-${n.id}`, label: n.label, hint: '#', run: () => open(n.id) })),
    ...[...c.work, ...c.projects].map((s) => ({ id: `svc-${s.id}`, label: s.name, hint: c.ui.statusLabel[s.status], run: () => open(s.id) })),
    { id: 'copy-email', label: c.ui.palette.copyEmail, hint: EMAIL, run: copyEmail },
    { id: 'cv', label: c.ui.palette.download, hint: 'PDF', run: () => window.open(c.cv.href, '_self') },
    ...c.contacts.slice(1).map((l) => ({ id: `open-${l.label}`, label: l.label, hint: '↗', run: () => window.open(l.href, '_blank') })),
    { id: 'lang', label: c.ui.switchLang === 'EN' ? 'English' : 'Português', hint: c.ui.switchLang, run: toggleLang },
  ]

  const views: Record<SectionId, () => ReactNode> = {
    overview: () => <Overview c={c} commits={activity?.total ?? null} />,
    work: () => (
      <Section id="work" title={c.ui.nav.work}>
        <ul className="grid gap-3">
          {c.work.map((s) => (
            <ServiceCard key={s.id} service={s} ui={c.ui} />
          ))}
        </ul>
      </Section>
    ),
    projects: () => (
      <Section id="projects" title={c.ui.nav.projects}>
        <ul className="grid gap-3 md:grid-cols-2">
          {c.projects.map((s) => (
            <ServiceCard key={s.id} service={s} ui={c.ui} />
          ))}
        </ul>
      </Section>
    ),
    now: () => <NowPage c={c} />,
    method: () => <MethodPage c={c} />,
    cv: () => <CvPage c={c} />,
    requests: () => <RequestPage c={c} />,
    contact: () => <ContactPage c={c} onCopy={copyEmail} />,
    incidents: () => (
      <Section id="incidents" title={c.ui.nav.incidents}>
        {c.incidents.map((i) => (
          <IncidentReplay key={i.date + i.service} incident={i} labels={c.ui.incident} />
        ))}
      </Section>
    ),
    deploys: () => (
      <Section id="deploys" title={c.ui.nav.deploys}>
        <Deploys activity={activity} labels={c.ui.deploys} lang={lang === 'pt' ? 'pt-BR' : 'en'} />
      </Section>
    ),
    stack: () => <StackPage c={c} onOpen={open} />,
  }

  const current = service(active)
  const view = isSection(active) ? (
    views[active]()
  ) : current ? (
    <Section id={current.id} title={current.name}>
      <ul>
        <ServiceCard key={current.id} service={current} ui={c.ui} defaultOpen />
      </ul>
    </Section>
  ) : null

  return (
    <>
      <Backdrop />
      {booting && <Boot boot={c.ui.boot} name={c.name} onDone={endBoot} />}

      <div className="flex">
        <Sidebar c={c} items={nav} active={active} onPalette={() => setPalette(true)} onLang={toggleLang} />
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30">
            <TopBar c={c} onPalette={() => setPalette(true)} onLang={toggleLang} />
            <TabBar tabs={tabBar} active={active} onSelect={open} onClose={close} closeLabel={c.ui.service.close} ariaLabel={c.ui.nav.tabs} />
          </div>
          <main
            key={active}
            className="mx-auto max-w-5xl animate-rise px-4 pt-6 pb-24 sm:px-8 sm:pt-8"
          >
            {view}
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
        <p role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-rise rounded-lg border border-accent/40 bg-panel px-4 py-2 font-mono text-sm text-accent">
          ✓ {toast}
        </p>
      )}
    </>
  )
}
