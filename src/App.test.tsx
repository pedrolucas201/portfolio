/// <reference types="node" />
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { content } from './content'
import { Cv } from './Cv'
import { createHash } from 'node:crypto'

const hash = (w: string) => createHash('sha256').update(w).digest('hex').slice(0, 16)
const FORBIDDEN = new Set(['9bc5648bcebea3ab', '83270f787967e067', '8224b82eefe8d232', '52667e8b16cdc074', 'b225a2a87fc71659', 'cee373168fe39366', '711438b7374d532d', 'fe14010b4fe83303', 'f8e6ff5696022369', 'a93e7fc04e20e480'])

afterEach(cleanup)

describe('App', () => {
  it('mostra disponibilidade e contato clicável logo no topo', () => {
    render(<App />)
    const email = screen.getByRole('link', { name: 'devgomesss@gmail.com' })
    expect(email.getAttribute('href')).toBe('mailto:devgomesss@gmail.com')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeTruthy()
  })

  it('botão de CV baixa o PDF do idioma atual', () => {
    render(<App />)
    const cv = screen.getByRole('link', { name: 'CV (PDF)' })
    expect(cv.hasAttribute('download')).toBe(true)
    expect(cv.getAttribute('href')).toMatch(/^\/cv-(pt|en)\.pdf$/)
  })

  it('troca de idioma e atualiza o lang do documento', () => {
    render(<App />)
    const before = document.documentElement.lang
    fireEvent.click(screen.getByRole('button'))
    expect(document.documentElement.lang).not.toBe(before)
  })
})

describe('content', () => {
  it('pt e en têm os mesmos itens', () => {
    for (const key of ['work', 'projects', 'incidents', 'education'] as const) {
      expect(content.en[key].length).toBe(content.pt[key].length)
    }
  })

  // O que NÃO pode ir pro site nem pro CV (lista no PRD, fora do repo). Os termos ficam só como hash
  // pra que a própria guarda não publique o que ela protege.
  it('não vaza nada da lista de privados (site e CV)', () => {
    const cvText = (['pt', 'en'] as const).map((l) => render(<Cv c={content[l]} />).container.textContent).join(' ')
    const words = (JSON.stringify(content) + ' ' + cvText).toLowerCase().split(/[\s"',:;()·]+/)
    const grams = words.flatMap((w, i) => [w, `${w} ${words[i + 1] ?? ''}`])
    const leaked = grams.filter((g) => FORBIDDEN.has(hash(g)))
    expect(leaked).toEqual([])
  })})
