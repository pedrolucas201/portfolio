// Todo texto do site e do CV. Cada afirmação tem fonte no dossiê do Pedro (fora do repo)
// ou no repositório público citado. Nada de métrica inventada.

export type Lang = 'pt' | 'en'
export type Status = 'ok' | 'testing' | 'ended' | 'off'

export type Link = { label: string; href: string }

// Diagrama só de projeto com código público. x/y em % do quadro.
export type Diagram = {
  nodes: { id: string; label: string; x: number; y: number }[]
  edges: { from: string; to: string; label?: string }[]
}

export type Service = {
  id: string
  name: string
  status: Status
  period?: string
  role?: string
  summary: string
  stack: string[]
  live?: string // site público no ar
  links?: Link[]
  diagram?: Diagram
}

export type LogLine = { t: string; level: 'err' | 'warn' | 'ok' | 'info'; text: string }

export type Incident = {
  date: string
  service: string
  title: string
  symptom: string
  cause: string
  fix: string
  log: LogLine[]
  backoffMinutes: number[]
  link: Link
}

export type Content = {
  ui: {
    switchLang: string
    contactNav: string
    statusLabel: Record<Status, string>
    nav: {
      aria: string
      tabs: string
      services: string
      overview: string
      work: string
      projects: string
      now: string
      method: string
      incidents: string
      deploys: string
      stack: string
      cv: string
      requests: string
      contact: string
    }
    contact: { intro: string; copy: string }
    boot: { skip: string; lines: [string, string][]; done: string }
    top: { since: string; local: string }
    kpi: { operational: string; commits: string; incidents: string; stack: string }
    service: { open: string; close: string; architecture: string; live: string }
    incident: { symptom: string; cause: string; fix: string; replay: string; backoff: string; resolved: string }
    deploys: { title: string; snapshot: string; activity: string }
    palette: { hint: string; placeholder: string; copyEmail: string; copied: string; download: string; none: string }
    stackProd: string
    stackKnown: string
    nowPage: { title: string; subtitle: string; commits: string; last: string; private: string; offCode: string; generated: string; portfolio: string }
    stackPage: { intro: string; legend: string; query: string; usedIn: string; none: string }
    education: string
    cvWork: string
    cvPage: { subtitle: string; summary: string; skills: string; download: string }
    projects: string
  }
  name: string
  initials: string
  role: string
  availability: string
  location: string
  summary: string
  contacts: Link[]
  cv: Link
  work: Service[]
  projects: Service[]
  incidents: Incident[]
  stack: { prod: string[]; known: string[] }
  stackGroups: { label: string; items: string[] }[]
  education: string[]
  now: { updated: string; items: string[] }
  method: { title: string; text: string }[]
  request: {
    title: string
    intro: string
    typeLabel: string
    types: string[]
    nameLabel: string
    messageLabel: string
    preview: string
    from: string
    empty: string
    send: string
    sendWhatsapp: string
    note: string
    signature: string
  }
}

export const EMAIL = 'devgomesss@gmail.com'
// Só usado no link wa.me dos pedidos (ok do Pedro em 09/11/2026). Não aparece escrito no site.
export const WHATSAPP = '5581993259534'
export const GITHUB_USER = 'pedrolucas201'
// Repositórios públicos cujos commits aparecem em "deploys recentes". Lista fechada de propósito:
// nada de repo de cliente entra por acidente.
export const PUBLIC_REPOS = ['pede-direto', 'dashunlock', 'portfolio']
// Repositórios da aba "agora". Só projetos do Pedro: nada de repo de cliente. Privado mostra só contagem e data.
export const ACTIVITY_REPOS = ['pede-direto', 'dashunlock', 'gas-manager', 'portfolio']
export const CAREER_START = new Date(2024, 10, 1) // nov/2024, primeiro emprego como dev (CV)

const contacts: Link[] = [
  { label: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gomesdev1' },
  { label: 'GitHub', href: `https://github.com/${GITHUB_USER}` },
]

const repo = (name: string): Link => ({ label: 'GitHub', href: `https://github.com/${GITHUB_USER}/${name}` })

const stack = {
  prod: ['Flutter', 'Dart', 'Go', 'React', 'React Native', 'PHP / Laravel', 'MySQL', 'PostgreSQL', 'Firebase', 'GCP', 'AWS S3', 'GitHub Actions'],
  known: ['TypeScript', 'Node.js', 'Java', 'Angular', 'Ionic'],
}

// Fonte: descrição e README do repo público pede-direto.
const pedeDiretoDiagram = (l: { client: string; site: string; panel: string; wa: string }): Diagram => ({
  nodes: [
    { id: 'client', label: l.client, x: 10, y: 50 },
    { id: 'site', label: l.site, x: 38, y: 50 },
    { id: 'db', label: 'Firestore', x: 66, y: 22 },
    { id: 'wa', label: l.wa, x: 66, y: 78 },
    { id: 'panel', label: l.panel, x: 90, y: 22 },
  ],
  edges: [
    { from: 'client', to: 'site' },
    { from: 'site', to: 'db', label: 'App Check' },
    { from: 'site', to: 'wa' },
    { from: 'db', to: 'panel' },
  ],
})

// Fonte: README do repo público dashunlock.
const dashUnlockDiagram = (l: { unit: string; app: string; report: string }): Diagram => ({
  nodes: [
    { id: 'unit', label: l.unit, x: 14, y: 50 },
    { id: 'app', label: l.app, x: 50, y: 50 },
    { id: 'report', label: l.report, x: 86, y: 50 },
  ],
  edges: [
    { from: 'unit', to: 'app' },
    { from: 'app', to: 'report' },
  ],
})

// Fonte: PR #36 público do pede-direto. As linhas "teste" são do teste com 403 simulado, não de produção.
const incidentLog = (l: { fixTag: string; testTag: string; blocked: string; down: string; watch: string; r1: string; r2: string; reset: string }): LogLine[] => [
  { t: '22:05', level: 'err', text: 'permission-denied | App Check: 403 (appCheck/throttled)' },
  { t: '22:05', level: 'warn', text: l.blocked },
  { t: '22:21', level: 'info', text: l.down },
  { t: l.fixTag, level: 'info', text: l.watch },
  { t: l.testTag, level: 'warn', text: l.r1 },
  { t: l.testTag, level: 'warn', text: l.r2 },
  { t: l.testTag, level: 'ok', text: l.reset },
]

export const content: Record<Lang, Content> = {
  pt: {
    ui: {
      switchLang: 'EN',
      contactNav: 'Contato',
      statusLabel: { ok: 'operacional', testing: 'em testes', ended: 'encerrado', off: 'fora do ar' },
      nav: {
        aria: 'Seções',
        tabs: 'Abas abertas',
        services: 'serviços',
        overview: 'Início',
        work: 'Trabalho',
        projects: 'Projetos',
        now: 'Agora',
        method: 'Método',
        incidents: 'Incidentes',
        deploys: 'Deploys',
        stack: 'Stack',
        cv: 'Currículo',
        requests: 'Pedidos',
        contact: 'Contato',
      },
      contact: { intro: 'Respondo por e-mail ou pelo LinkedIn.', copy: 'copiar' },
      boot: {
        skip: 'pular',
        lines: [
          ['GET /pedro/health', '200'],
          ['flutter', 'ok'],
          ['go', 'ok'],
          ['laravel', 'ok'],
          ['disponibilidade', 'remoto · tempo integral'],
        ],
        done: 'todos os sistemas operacionais',
      },
      top: { since: 'em produção desde nov/2024', local: 'Recife' },
      kpi: {
        operational: 'serviços operacionais',
        commits: 'commits públicos · 90 dias',
        incidents: 'incidentes resolvidos',
        stack: 'tecnologias em produção',
      },
      service: { open: 'detalhes', close: 'fechar', architecture: 'Arquitetura', live: 'Ver no ar' },
      incident: {
        symptom: 'Sintoma',
        cause: 'Causa',
        fix: 'Correção',
        replay: 'rodar de novo',
        backoff: 'espera entre recargas (min)',
        resolved: 'resolvido',
      },
      deploys: { title: 'Últimos commits', snapshot: 'retrato de', activity: 'atividade · 90 dias' },
      palette: {
        hint: 'comandos',
        placeholder: 'Ir para, copiar e-mail, baixar currículo…',
        copyEmail: 'Copiar e-mail',
        copied: 'e-mail copiado',
        download: 'Baixar currículo',
        none: 'Nada encontrado',
      },
      stackProd: 'Em produção',
      stackKnown: 'Também trabalho com',
      nowPage: {
        title: 'Em execução',
        subtitle: 'Gerado do histórico do git a cada build. Nenhum número aqui é escrito à mão.',
        commits: 'commits · 90 dias',
        last: 'último há',
        private: 'repositório privado',
        offCode: 'Além do código',
        generated: 'gerado por scripts/github-snapshot.mjs',
        portfolio: 'Este portfólio',
      },
      stackPage: {
        intro: 'Clique numa tecnologia pra ver onde ela roda.',
        legend: 'em produção',
        query: 'serviços onde stack contém',
        usedIn: 'usado em',
        none: 'Sem projeto listado aqui: conhecimento de estudo ou de emprego anterior.',
      },
      education: 'Formação',
      cvWork: 'Experiência',
      cvPage: { subtitle: 'Mesmo conteúdo do site, em formato de currículo.', summary: 'Resumo', skills: 'Competências', download: 'Baixar PDF' },
      projects: 'Projetos próprios',
    },
    name: 'Pedro Lucas',
    initials: 'PL',
    role: 'Software Engineer · Flutter · Go',
    availability: 'Disponível · remoto · tempo integral',
    location: 'Vitória de Santo Antão, PE, Brasil',
    summary:
      'Desenvolvo e mantenho sistemas em produção do levantamento de requisitos ao suporte pós-lançamento: apps Flutter, backends Go e Laravel.',
    contacts,
    cv: { label: 'Currículo (PDF)', href: '/cv-pt.pdf' },
    work: [
      {
        id: 'pierfans',
        name: 'Pierfans',
        status: 'ok',
        period: 'jun/2026 – hoje',
        role: 'Desenvolvedor Full Stack (PJ, remoto)',
        summary: 'Plataforma de conteúdo por assinatura. Evolução e manutenção da plataforma web em produção.',
        stack: ['Laravel 11', 'PHP 8.3', 'MySQL'],
      },
      {
        id: 'invo',
        name: 'Invo Consulting',
        status: 'ok',
        period: 'fev/2026 – hoje',
        role: 'Desenvolvedor Mobile e Backend (PJ, remoto)',
        summary:
          'Projetos de clientes: app Flutter de navegação para transporte de carga, em produção com motoristas, e plataforma fiscal B2B. CI e versões beta validadas em aparelho real.',
        stack: ['Flutter', 'Go', 'PostgreSQL', 'MySQL', 'GCP', 'AWS S3'],
      },
      {
        id: 'virtual-vision',
        name: 'Virtual Vision',
        status: 'ended',
        period: 'nov/2024 – fev/2026',
        role: 'Desenvolvedor Full Stack (presencial, Recife)',
        summary:
          'ConectaSUAS, SaaS multi-tenant de gestão pública atendendo 5 prefeituras. Também acumulei o papel de QA do time.',
        stack: ['Java 11', 'JSP', 'JavaScript', 'PostgreSQL', 'Angular', 'Ionic'],
      },
    ],
    projects: [
      {
        id: 'pede-direto',
        name: 'Pede Direto · La Carne Burger',
        status: 'ok',
        summary:
          'Site de pedidos que manda o pedido pronto pro WhatsApp da loja, sem app de delivery no meio, com painel pra loja. Feito pra um cliente real e pensado como white label.',
        stack: ['JavaScript', 'Firebase', 'Firestore', 'App Check'],
        live: 'https://lacarne.com.br',
        links: [repo('pede-direto')],
        diagram: pedeDiretoDiagram({ client: 'Cliente', site: 'Site de pedidos', panel: 'Painel da loja', wa: 'WhatsApp da loja' }),
      },
      {
        id: 'dashunlock',
        name: 'DashUnlock',
        status: 'testing',
        summary:
          'App Android open source, só leitura: mostra o que vem na central multimídia do carro (Android real × anunciado, hardware, apps de fábrica, pacotes de risco conhecidos). Versão com testers.',
        stack: ['Java', 'Android'],
        links: [repo('dashunlock')],
        diagram: dashUnlockDiagram({ unit: 'Central multimídia', app: 'DashUnlock (só leitura)', report: 'Relatório' }),
      },
      {
        id: 'gas',
        name: 'Gestão de revenda de gás',
        status: 'ok',
        summary:
          'Produto próprio em produção, com usuários reais: painel web, app offline-first pro entregador e backend. Código privado.',
        stack: ['React', 'Vite', 'React Native', 'Go', 'PostgreSQL'],
      },
    ],
    incidents: [
      {
        date: '08/11/2026',
        service: 'Pede Direto',
        title: 'Painel da loja fora por 16 min',
        symptom: 'Das 22:05 às 22:21 o painel parou com "App Check: 403 (throttled)".',
        cause:
          'Quando a troca do token do App Check volta 403, o SDK trava a aba por 24 h. A trava fica só na memória.',
        fix: 'O painel confere o token a cada minuto e, se travou, avisa e recarrega sozinho com espera crescente pra não piorar a nota do reCAPTCHA.',
        log: incidentLog({
          fixTag: 'correção',
          testTag: 'teste',
          blocked: 'SDK: novas tentativas só daqui a 23h59m59s',
          down: 'painel volta após recarregar a aba (a trava era só em memória)',
          watch: 'watchdog: confere o token a cada 60 s',
          r1: '403 simulado → travado, recarrega em 1 min',
          r2: '403 de novo → recarrega em 2 min',
          reset: 'token bom → contagem zerada · 63/63 testes',
        }),
        backoffMinutes: [1, 2, 4, 8, 15],
        link: { label: 'PR #36', href: 'https://github.com/pedrolucas201/pede-direto/pull/36' },
      },
    ],
    stack,
    stackGroups: [
      { label: 'Linguagens', items: ['Dart', 'Go', 'PHP', 'JavaScript', 'TypeScript', 'Java'] },
      { label: 'Mobile e front-end', items: ['Flutter', 'React', 'React Native', 'Vite', 'Angular', 'Ionic', 'Android'] },
      { label: 'Back-end', items: ['Laravel', 'Node.js', 'JSP'] },
      { label: 'Dados', items: ['PostgreSQL', 'MySQL', 'Firebase', 'Firestore'] },
      { label: 'Infra e CI', items: ['GCP', 'AWS S3', 'GitHub Actions'] },
    ],
    education: ['Análise e Desenvolvimento de Sistemas, UNINASSAU (2026 – 2028, em andamento)', 'Português nativo · inglês intermediário'],
    now: {
      updated: 'atualizado em 09/11/2026',
      items: [
        'Mantendo em produção a plataforma da Pierfans (Laravel) e os projetos Flutter + Go da Invo.',
        'Estudando n8n, Supabase e Kubernetes.',
        'Cursando Análise e Desenvolvimento de Sistemas na UNINASSAU.',
        'Aberto a vagas remotas em tempo integral: Flutter, Go e React.',
      ],
    },
    method: [
      { title: 'Critério de pronto antes do código', text: 'Escrevo o que tem que acontecer, e o que não pode acontecer, antes de implementar.' },
      { title: 'Causa raiz, não sintoma', text: 'Hipótese não é fato: confiro no código e no estado real antes de afirmar a causa.' },
      { title: 'Teste prova só o que exercita', text: 'Teste verde não substitui aparelho real quando o critério depende do aparelho.' },
      { title: 'Deploy com volta planejada', text: 'Em produção sem staging, valido antes de subir e deixo o rollback pronto.' },
      { title: 'IA como apoio', text: 'Uso IA como ferramenta, sempre revisando o diff e os testes.' },
      { title: 'Falha também é resultado', text: 'Registro o que foi tentado, por que falhou e o que faria reabrir.' },
    ],
    request: {
      title: 'Abra um pedido',
      intro: 'Projeto pra construir, vaga ou uma ideia ainda crua. Não tem servidor aqui: o site só monta a mensagem, e ela abre pronta no seu WhatsApp ou no seu e-mail.',
      typeLabel: 'Tipo',
      types: ['Projeto', 'Vaga', 'Ideia', 'Outro'],
      nameLabel: 'Seu nome',
      messageLabel: 'O que você precisa, e pra quando?',
      preview: 'prévia do chamado',
      from: 'de',
      empty: 'escreva o pedido pra liberar o envio',
      send: 'Enviar por e-mail',
      sendWhatsapp: 'Enviar no WhatsApp',
      note: 'Nada é guardado: o envio acontece no seu próprio app.',
      signature: 'enviado pelo portfólio',
    },
  },
  en: {
    ui: {
      switchLang: 'PT',
      contactNav: 'Contact',
      statusLabel: { ok: 'operational', testing: 'in testing', ended: 'ended', off: 'offline' },
      nav: {
        aria: 'Sections',
        tabs: 'Open tabs',
        services: 'services',
        overview: 'Home',
        work: 'Work',
        projects: 'Projects',
        now: 'Now',
        method: 'Method',
        incidents: 'Incidents',
        deploys: 'Deploys',
        stack: 'Stack',
        cv: 'Resume',
        requests: 'Requests',
        contact: 'Contact',
      },
      contact: { intro: 'I reply by email or on LinkedIn.', copy: 'copy' },
      boot: {
        skip: 'skip',
        lines: [
          ['GET /pedro/health', '200'],
          ['flutter', 'ok'],
          ['go', 'ok'],
          ['laravel', 'ok'],
          ['availability', 'remote · full-time'],
        ],
        done: 'all systems operational',
      },
      top: { since: 'in production since Nov 2024', local: 'Recife' },
      kpi: {
        operational: 'operational services',
        commits: 'public commits · 90 days',
        incidents: 'resolved incidents',
        stack: 'technologies in production',
      },
      service: { open: 'details', close: 'close', architecture: 'Architecture', live: 'See it live' },
      incident: {
        symptom: 'Symptom',
        cause: 'Cause',
        fix: 'Fix',
        replay: 'replay',
        backoff: 'wait between reloads (min)',
        resolved: 'resolved',
      },
      deploys: { title: 'Latest commits', snapshot: 'snapshot from', activity: 'activity · 90 days' },
      palette: {
        hint: 'commands',
        placeholder: 'Go to, copy email, download resume…',
        copyEmail: 'Copy email',
        copied: 'email copied',
        download: 'Download resume',
        none: 'Nothing found',
      },
      stackProd: 'In production',
      stackKnown: 'Also work with',
      nowPage: {
        title: 'Running now',
        subtitle: 'Generated from git history on every build. No number here is typed by hand.',
        commits: 'commits · 90 days',
        last: 'last',
        private: 'private repository',
        offCode: 'Beyond the code',
        generated: 'generated by scripts/github-snapshot.mjs',
        portfolio: 'This portfolio',
      },
      stackPage: {
        intro: 'Click a technology to see where it runs.',
        legend: 'in production',
        query: 'services where stack contains',
        usedIn: 'used in',
        none: 'No project listed here: knowledge from study or a previous job.',
      },
      education: 'Education',
      cvWork: 'Experience',
      cvPage: { subtitle: 'Same content as the site, in resume format.', summary: 'Summary', skills: 'Skills', download: 'Download PDF' },
      projects: 'Own projects',
    },
    name: 'Pedro Lucas',
    initials: 'PL',
    role: 'Software Engineer · Flutter · Go',
    availability: 'Available · remote · full-time',
    location: 'Vitória de Santo Antão, PE, Brazil',
    summary:
      'I build and run production systems from requirements to post-launch support: Flutter apps, Go and Laravel backends.',
    contacts,
    cv: { label: 'Resume (PDF)', href: '/cv-en.pdf' },
    work: [
      {
        id: 'pierfans',
        name: 'Pierfans',
        status: 'ok',
        period: 'Jun 2026 – now',
        role: 'Full Stack Developer (contractor, remote)',
        summary: 'Subscription content platform. Evolving and maintaining the web platform in production.',
        stack: ['Laravel 11', 'PHP 8.3', 'MySQL'],
      },
      {
        id: 'invo',
        name: 'Invo Consulting',
        status: 'ok',
        period: 'Feb 2026 – now',
        role: 'Mobile & Backend Developer (contractor, remote)',
        summary:
          'Client projects: a Flutter navigation app for freight transport, in production with drivers, and a B2B tax platform. CI and beta builds validated on real devices.',
        stack: ['Flutter', 'Go', 'PostgreSQL', 'MySQL', 'GCP', 'AWS S3'],
      },
      {
        id: 'virtual-vision',
        name: 'Virtual Vision',
        status: 'ended',
        period: 'Nov 2024 – Feb 2026',
        role: 'Full Stack Developer (on-site, Recife)',
        summary:
          'ConectaSUAS, a multi-tenant public-management SaaS serving 5 city governments. I also took on the team’s QA role.',
        stack: ['Java 11', 'JSP', 'JavaScript', 'PostgreSQL', 'Angular', 'Ionic'],
      },
    ],
    projects: [
      {
        id: 'pede-direto',
        name: 'Pede Direto · La Carne Burger',
        status: 'ok',
        summary:
          'Ordering site that sends the finished order to the restaurant’s WhatsApp, no delivery app in between, plus a store dashboard. Built for a real client, designed as white label.',
        stack: ['JavaScript', 'Firebase', 'Firestore', 'App Check'],
        live: 'https://lacarne.com.br',
        links: [repo('pede-direto')],
        diagram: pedeDiretoDiagram({ client: 'Customer', site: 'Ordering site', panel: 'Store dashboard', wa: 'Store WhatsApp' }),
      },
      {
        id: 'dashunlock',
        name: 'DashUnlock',
        status: 'testing',
        summary:
          'Open-source, read-only Android app that shows what ships in a car head unit (real vs. advertised Android, hardware, factory apps, known risky packages). Now with testers.',
        stack: ['Java', 'Android'],
        links: [repo('dashunlock')],
        diagram: dashUnlockDiagram({ unit: 'Head unit', app: 'DashUnlock (read-only)', report: 'Report' }),
      },
      {
        id: 'gas',
        name: 'Gas distributor management',
        status: 'ok',
        summary: 'My own product, in production with real users: web dashboard, offline-first delivery app and backend. Private code.',
        stack: ['React', 'Vite', 'React Native', 'Go', 'PostgreSQL'],
      },
    ],
    incidents: [
      {
        date: '2026-11-08',
        service: 'Pede Direto',
        title: 'Store dashboard down for 16 min',
        symptom: 'From 22:05 to 22:21 the dashboard stopped with "App Check: 403 (throttled)".',
        cause: 'When the App Check token exchange returns 403, the SDK locks the tab for 24 h. The lock lives only in memory.',
        fix: 'The dashboard checks the token every minute and, if locked, warns and reloads itself with growing backoff so the reCAPTCHA score doesn’t get worse.',
        log: incidentLog({
          fixTag: 'fix',
          testTag: 'test',
          blocked: 'SDK: next attempt allowed in 23h59m59s',
          down: 'dashboard back after a tab reload (the lock was in memory only)',
          watch: 'watchdog: checks the token every 60 s',
          r1: 'simulated 403 → locked, reload in 1 min',
          r2: '403 again → reload in 2 min',
          reset: 'good token → counter reset · 63/63 tests',
        }),
        backoffMinutes: [1, 2, 4, 8, 15],
        link: { label: 'PR #36', href: 'https://github.com/pedrolucas201/pede-direto/pull/36' },
      },
    ],
    stack,
    stackGroups: [
      { label: 'Languages', items: ['Dart', 'Go', 'PHP', 'JavaScript', 'TypeScript', 'Java'] },
      { label: 'Mobile & front-end', items: ['Flutter', 'React', 'React Native', 'Vite', 'Angular', 'Ionic', 'Android'] },
      { label: 'Back-end', items: ['Laravel', 'Node.js', 'JSP'] },
      { label: 'Data', items: ['PostgreSQL', 'MySQL', 'Firebase', 'Firestore'] },
      { label: 'Infra & CI', items: ['GCP', 'AWS S3', 'GitHub Actions'] },
    ],
    education: ['Systems Analysis and Development, UNINASSAU (2026 – 2028, in progress)', 'Portuguese native · English intermediate'],
    now: {
      updated: 'updated 2026-11-09',
      items: [
        'Running Pierfans’ platform (Laravel) and Invo’s Flutter + Go projects in production.',
        'Studying n8n, Supabase and Kubernetes.',
        'Studying Systems Analysis and Development at UNINASSAU.',
        'Open to full-time remote roles: Flutter, Go and React.',
      ],
    },
    method: [
      { title: 'Definition of done before code', text: 'I write down what must happen, and what must not, before implementing.' },
      { title: 'Root cause, not symptom', text: 'A hypothesis isn’t a fact: I check the code and the live state before naming the cause.' },
      { title: 'Tests prove only what they exercise', text: 'A green test doesn’t replace a real device when the criterion depends on the device.' },
      { title: 'Deploys with a way back', text: 'In production without staging, I validate before shipping and keep the rollback ready.' },
      { title: 'AI as support', text: 'I use AI as a tool, always reviewing the diff and the tests.' },
      { title: 'Failure is a result too', text: 'I log what was tried, why it failed and what would reopen it.' },
    ],
    request: {
      title: 'Open a request',
      intro: 'A project to build, a role or a rough idea. There’s no server here: the site only drafts the message, and it opens ready in your WhatsApp or email.',
      typeLabel: 'Type',
      types: ['Project', 'Role', 'Idea', 'Other'],
      nameLabel: 'Your name',
      messageLabel: 'What do you need, and by when?',
      preview: 'ticket preview',
      from: 'from',
      empty: 'write your request to enable sending',
      send: 'Send by email',
      sendWhatsapp: 'Send on WhatsApp',
      note: 'Nothing is stored: sending happens in your own app.',
      signature: 'sent from the portfolio',
    },
  },
}
