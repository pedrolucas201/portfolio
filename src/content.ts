// Todo texto do site. Cada afirmação tem fonte em ../fontes/perfil-pedro.md (fora do repo)
// ou no repositório público citado.

export type Lang = 'pt' | 'en'
export type Status = 'ok' | 'testing' | 'ended' | 'off'

export type Link = { label: string; href: string }

export type Service = {
  name: string
  status: Status
  period?: string
  role?: string
  summary: string
  stack: string[]
  links?: Link[]
}

export type Incident = {
  date: string
  service: string
  title: string
  symptom: string
  cause: string
  fix: string
  link: Link
}

export type Content = {
  ui: {
    switchLang: string
    contactNav: string
    statusLabel: Record<Status, string>
    sections: { work: string; projects: string; incidents: string; stack: string; education: string }
    incident: { symptom: string; cause: string; fix: string }
    stackProd: string
    stackKnown: string
    cvWork: string
  }
  name: string
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
  education: string[]
}

const contacts: Link[] = [
  { label: 'devgomesss@gmail.com', href: 'mailto:devgomesss@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gomesdev1' },
  { label: 'GitHub', href: 'https://github.com/pedrolucas201' },
]

const repo = (name: string): Link => ({ label: 'GitHub', href: `https://github.com/pedrolucas201/${name}` })

const stack = {
  prod: ['Flutter', 'Dart', 'Go', 'React', 'React Native', 'PHP / Laravel', 'MySQL', 'PostgreSQL', 'Firebase', 'GCP', 'AWS S3', 'GitHub Actions'],
  known: ['TypeScript', 'Node.js', 'Java', 'Angular', 'Ionic'],
}

export const content: Record<Lang, Content> = {
  pt: {
    ui: {
      switchLang: 'English',
      contactNav: 'Contato',
      statusLabel: { ok: 'operacional', testing: 'em testes', ended: 'encerrado', off: 'fora do ar' },
      sections: {
        work: 'Em produção',
        projects: 'Projetos próprios',
        incidents: 'Incidentes resolvidos',
        stack: 'Stack',
        education: 'Formação',
      },
      incident: { symptom: 'Sintoma', cause: 'Causa', fix: 'Correção' },
      stackProd: 'Em produção',
      stackKnown: 'Também trabalho com',
      cvWork: 'Experiência',
    },
    name: 'Pedro Lucas',
    role: 'Software Engineer · Flutter · Go',
    availability: 'Disponível · remoto · tempo integral',
    location: 'Vitória de Santo Antão, PE, Brasil',
    summary:
      'Desenvolvo e mantenho sistemas em produção do levantamento de requisitos ao suporte pós-lançamento: apps Flutter, backends Go e Laravel.',
    contacts,
    cv: { label: 'CV (PDF)', href: '/cv-pt.pdf' },
    work: [
      {
        name: 'Pierfans',
        status: 'ok',
        period: 'jun/2026 – hoje',
        role: 'Desenvolvedor Full Stack (PJ, remoto)',
        summary: 'Plataforma de conteúdo por assinatura. Evolução e manutenção da plataforma web em produção.',
        stack: ['Laravel 11', 'PHP 8.3', 'MySQL'],
      },
      {
        name: 'Invo Consulting',
        status: 'ok',
        period: 'fev/2026 – hoje',
        role: 'Desenvolvedor Mobile e Backend (PJ, remoto)',
        summary:
          'Projetos de clientes: app Flutter de navegação para transporte de carga, em produção com motoristas, e plataforma fiscal B2B. CI e versões beta validadas em aparelho real.',
        stack: ['Flutter', 'Go', 'PostgreSQL', 'MySQL', 'GCP', 'AWS S3'],
      },
      {
        name: 'Virtual Vision',
        status: 'ended',
        period: 'nov/2024 – fev/2026',
        role: 'Desenvolvedor Full Stack (presencial, Recife)',
        summary:
          'ConectaSUAS, SaaS multi-tenant de gestão pública atendendo 5 prefeituras. Também acumulei o papel de QA do time.',
        stack: ['Java 11', 'JSP', 'JavaScript', 'PostgreSQL'],
      },
    ],
    projects: [
      {
        name: 'Pede Direto · La Carne Burger',
        status: 'ok',
        summary:
          'Site de pedidos que manda o pedido pronto pro WhatsApp da loja, sem app de delivery no meio, com painel pra loja. Feito pra um cliente real e pensado como white label.',
        stack: ['JavaScript', 'Firebase', 'Firestore', 'App Check'],
        links: [{ label: 'lacarne.com.br', href: 'https://lacarne.com.br' }, repo('pede-direto')],
      },
      {
        name: 'DashUnlock',
        status: 'testing',
        summary:
          'App Android open source, só leitura: mostra o que vem na central multimídia do carro (Android real × anunciado, hardware, apps de fábrica, pacotes de risco conhecidos). Versão com testers.',
        stack: ['Java', 'Android'],
        links: [repo('dashunlock')],
      },
      {
        name: 'Gestão de revenda de gás',
        status: 'ok',
        summary:
          'Produto próprio em produção, com usuários reais: painel web, app offline-first pro entregador e backend. Código privado.',
        stack: ['React', 'Vite', 'React Native', 'Go', 'PostgreSQL'],
      },
      {
        name: 'Press2Play',
        status: 'off',
        period: '2024 – 2025',
        summary: 'Site de jogos com dados em tempo real.',
        stack: ['React', 'TypeScript', 'MUI', 'Firebase'],
        links: [repo('site-de-jogos')],
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
        fix: 'O painel confere o token a cada minuto e, se travou, avisa e recarrega sozinho com espera crescente (1, 2, 4, 8, até 15 min) pra não piorar a nota do reCAPTCHA. Testado simulando o 403.',
        link: { label: 'PR #36', href: 'https://github.com/pedrolucas201/pede-direto/pull/36' },
      },
    ],
    stack,
    education: ['Análise e Desenvolvimento de Sistemas, UNINASSAU (2026 – 2028, em andamento)', 'Português nativo · inglês intermediário'],
  },
  en: {
    ui: {
      switchLang: 'Português',
      contactNav: 'Contact',
      statusLabel: { ok: 'operational', testing: 'in testing', ended: 'ended', off: 'offline' },
      sections: {
        work: 'In production',
        projects: 'Own projects',
        incidents: 'Resolved incidents',
        stack: 'Stack',
        education: 'Education',
      },
      incident: { symptom: 'Symptom', cause: 'Cause', fix: 'Fix' },
      stackProd: 'In production',
      stackKnown: 'Also work with',
      cvWork: 'Experience',
    },
    name: 'Pedro Lucas',
    role: 'Software Engineer · Flutter · Go',
    availability: 'Available · remote · full-time',
    location: 'Vitória de Santo Antão, PE, Brazil',
    summary:
      'I build and run production systems from requirements to post-launch support: Flutter apps, Go and Laravel backends.',
    contacts,
    cv: { label: 'CV (PDF)', href: '/cv-en.pdf' },
    work: [
      {
        name: 'Pierfans',
        status: 'ok',
        period: 'Jun 2026 – now',
        role: 'Full Stack Developer (contractor, remote)',
        summary: 'Subscription content platform. Evolving and maintaining the web platform in production.',
        stack: ['Laravel 11', 'PHP 8.3', 'MySQL'],
      },
      {
        name: 'Invo Consulting',
        status: 'ok',
        period: 'Feb 2026 – now',
        role: 'Mobile & Backend Developer (contractor, remote)',
        summary:
          'Client projects: a Flutter navigation app for freight transport, in production with drivers, and a B2B tax platform. CI and beta builds validated on real devices.',
        stack: ['Flutter', 'Go', 'PostgreSQL', 'MySQL', 'GCP', 'AWS S3'],
      },
      {
        name: 'Virtual Vision',
        status: 'ended',
        period: 'Nov 2024 – Feb 2026',
        role: 'Full Stack Developer (on-site, Recife)',
        summary:
          'ConectaSUAS, a multi-tenant public-management SaaS serving 5 city governments. I also took on the team’s QA role.',
        stack: ['Java 11', 'JSP', 'JavaScript', 'PostgreSQL'],
      },
    ],
    projects: [
      {
        name: 'Pede Direto · La Carne Burger',
        status: 'ok',
        summary:
          'Ordering site that sends the finished order to the restaurant’s WhatsApp, no delivery app in between, plus a store dashboard. Built for a real client, designed as white label.',
        stack: ['JavaScript', 'Firebase', 'Firestore', 'App Check'],
        links: [{ label: 'lacarne.com.br', href: 'https://lacarne.com.br' }, repo('pede-direto')],
      },
      {
        name: 'DashUnlock',
        status: 'testing',
        summary:
          'Open-source, read-only Android app that shows what ships in a car head unit (real vs. advertised Android, hardware, factory apps, known risky packages). Now with testers.',
        stack: ['Java', 'Android'],
        links: [repo('dashunlock')],
      },
      {
        name: 'Gas distributor management',
        status: 'ok',
        summary: 'My own product, in production with real users: web dashboard, offline-first delivery app and backend. Private code.',
        stack: ['React', 'Vite', 'React Native', 'Go', 'PostgreSQL'],
      },
      {
        name: 'Press2Play',
        status: 'off',
        period: '2024 – 2025',
        summary: 'Games website with real-time data.',
        stack: ['React', 'TypeScript', 'MUI', 'Firebase'],
        links: [repo('site-de-jogos')],
      },
    ],
    incidents: [
      {
        date: '2026-11-08',
        service: 'Pede Direto',
        title: 'Store dashboard down for 16 min',
        symptom: 'From 22:05 to 22:21 the dashboard stopped with "App Check: 403 (throttled)".',
        cause: 'When the App Check token exchange returns 403, the SDK locks the tab for 24 h. The lock lives only in memory.',
        fix: 'The dashboard checks the token every minute and, if locked, warns and reloads itself with growing backoff (1, 2, 4, 8, up to 15 min) so the reCAPTCHA score doesn’t get worse. Tested by simulating the 403.',
        link: { label: 'PR #36', href: 'https://github.com/pedrolucas201/pede-direto/pull/36' },
      },
    ],
    stack,
    education: ['Systems Analysis and Development, UNINASSAU (2026 – 2028, in progress)', 'Portuguese native · English intermediate'],
  },
}
