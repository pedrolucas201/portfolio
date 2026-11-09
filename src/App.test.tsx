/// <reference types="node" />
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createHash } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { content } from './content'
import { Cv } from './Cv'
import { careerUptime } from './lib/uptime'
import snapshot from './github-snapshot.json'
import { bucketByDay } from './hooks/useGithubActivity'
import { requestMailto, requestWhatsapp } from './lib/request'

const hash = (w: string) => createHash('sha256').update(w).digest('hex').slice(0, 16)
const FORBIDDEN = new Set(['9bc5648bcebea3ab', '83270f787967e067', '8224b82eefe8d232', '52667e8b16cdc074', 'b225a2a87fc71659', 'cee373168fe39366', '711438b7374d532d', 'fe14010b4fe83303', 'f8e6ff5696022369', 'a93e7fc04e20e480'])

beforeEach(() => {
  // Sem rede nos testes: o GitHub "cai" e o site tem que seguir de pé.
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('[]', { status: 503 }))))
  sessionStorage.clear()
  history.replaceState(null, '', '/')
})

// Abre uma aba pela paleta Ctrl+K, como um visitante faria pelo teclado.
function openTab(query: string) {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
  const box = screen.getByRole('combobox')
  fireEvent.change(box, { target: { value: query } })
  fireEvent.keyDown(box, { key: 'Enter' })
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('mostra contato e CV clicáveis no topo, mesmo durante a abertura', () => {
    render(<App />)
    expect(screen.getByRole('status', { name: /operacionais|operational/ })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: 'devgomesss@gmail.com' })[0].getAttribute('href')).toBe('mailto:devgomesss@gmail.com')
    // Topo do perfil e atalho na sidebar: os dois baixam o PDF do idioma atual.
    const cvs = screen.getAllByRole('link', { name: /Currículo \(PDF\)|Resume \(PDF\)|Baixar currículo|Download resume/ })
    expect(cvs).toHaveLength(2)
    for (const cv of cvs) {
      expect(cv.hasAttribute('download')).toBe(true)
      expect(cv.getAttribute('href')).toMatch(/^\/cv-(pt|en)\.pdf$/)
    }
  })

  it('pular a abertura fecha e não repete na mesma sessão', () => {
    const { unmount } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /pular|skip/ }))
    expect(screen.queryByRole('status', { name: /operacionais|operational/ })).toBeNull()
    unmount()
    render(<App />)
    expect(screen.queryByRole('status', { name: /operacionais|operational/ })).toBeNull()
  })

  it('Ctrl+K abre a paleta, filtra e executa com Enter', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<App />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    const box = screen.getByRole('combobox')
    fireEvent.change(box, { target: { value: 'mail' } })
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await act(async () => {
      fireEvent.keyDown(box, { key: 'Enter' })
    })
    expect(writeText).toHaveBeenCalledWith('devgomesss@gmail.com')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('GitHub fora do ar ou no limite (403): mostra o retrato do build, não seção vazia', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('rate limited', { status: 403 }))))
    render(<App />)
    // No início, o indicador de commits mostra o total do retrato em vez de ficar em "…".
    expect((await screen.findAllByText(String(snapshot.total))).length).toBeGreaterThan(0)
    openTab('deploys')
    expect(screen.getByText(snapshot.commits[0].message)).toBeTruthy()
    expect(screen.getByText(/retrato de|snapshot from/)).toBeTruthy()
  })

  it('rede caída também cai no retrato', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))))
    render(<App />)
    openTab('deploys')
    expect(await screen.findByText(snapshot.commits[0].message)).toBeTruthy()
  })

  it('abas: abre serviço pela paleta, fecha e volta pra vizinha; o #hash acompanha', () => {
    render(<App />)
    expect([...document.querySelectorAll('[id^=tab-]')].map((t) => t.id)).toEqual(['tab-overview', 'tab-work', 'tab-projects', 'tab-now'])
    openTab('DashUnlock')
    expect(document.querySelector('[aria-current=page]')!.id).toBe('tab-dashunlock')
    expect(location.hash).toBe('#dashunlock')
    expect(screen.getByText(/Arquitetura|Architecture/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /(fechar|close) DashUnlock/ }))
    expect(document.getElementById('tab-dashunlock')).toBeNull()
    expect(document.querySelector('[aria-current=page]')!.id).toBe('tab-now')
  })

  it('link direto (#stack) já abre a aba certa', () => {
    history.replaceState(null, '', '/#stack')
    render(<App />)
    expect(document.querySelector('[aria-current=page]')!.id).toBe('tab-stack')
  })

  it('troca de idioma atualiza o lang do documento', () => {
    render(<App />)
    const before = document.documentElement.lang
    fireEvent.click(screen.getAllByRole('button', { name: /^(EN|PT)$/ })[0])
    expect(document.documentElement.lang).not.toBe(before)
  })
})

describe('lógica', () => {
  it('agrupa commits por dia, ignorando os fora da janela', () => {
    const now = new Date('2026-11-09T12:00:00Z')
    const c = (date: string) => ({ repo: 'r', sha: 'x', message: 'm', url: '', date })
    const days = bucketByDay([c('2026-11-09T10:00:00Z'), c('2026-11-09T01:00:00Z'), c('2026-11-07T12:00:00Z'), c('2025-01-01T00:00:00Z')], now, 5)
    expect(days).toEqual([0, 0, 1, 0, 2])
  })

  it('pedido vira link de WhatsApp e de e-mail com a mensagem intacta', () => {
    const draft = { type: 'Projeto', name: 'Ana & Cia', message: 'App de pedidos\nprazo: março' }
    const wa = new URL(requestWhatsapp(draft, 'assinatura'))
    expect(wa.host).toBe('wa.me')
    expect(wa.searchParams.get('text')).toBe('[Projeto] Ana & Cia\n\nApp de pedidos\nprazo: março\n\nAna & Cia · assinatura')
    const mail = requestMailto(draft, 'assinatura')
    expect(mail.startsWith('mailto:devgomesss@gmail.com?')).toBe(true)
    const params = new URLSearchParams(mail.split('?')[1])
    expect(params.get('subject')).toBe('[Projeto] Ana & Cia')
    expect(params.get('body')).toBe('App de pedidos\nprazo: março\n\nAna & Cia · assinatura')
  })

  it('uptime de carreira conta desde nov/2024', () => {
    expect(careerUptime(new Date(2026, 10, 9))).toBe('2y 0m')
    expect(careerUptime(new Date(2025, 4, 1))).toBe('0y 6m')
  })
})

describe('content', () => {
  it('pt e en têm os mesmos itens', () => {
    for (const key of ['work', 'projects', 'incidents', 'education'] as const) {
      expect(content.en[key].length).toBe(content.pt[key].length)
    }
    expect(content.en.incidents[0].log.length).toBe(content.pt.incidents[0].log.length)
  })

  // O que NÃO pode ir pro site nem pro CV (lista no PRD, fora do repo). Os termos ficam só como hash
  // pra que a própria guarda não publique o que ela protege.
  it('não vaza nada da lista de privados (site, CV e commits do retrato)', () => {
    const cvText = (['pt', 'en'] as const).map((l) => render(<Cv c={content[l]} />).container.textContent).join(' ')
    const words = (JSON.stringify(content) + JSON.stringify(snapshot) + ' ' + cvText).toLowerCase().split(/[\s"',:;()·]+/)
    const grams = words.flatMap((w, i) => [w, `${w} ${words[i + 1] ?? ''}`])
    const leaked = grams.filter((g) => FORBIDDEN.has(hash(g)))
    expect(leaked).toEqual([])
  })
})
