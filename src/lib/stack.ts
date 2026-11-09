import type { Content, Service } from '../content'

// "Laravel 11" conta como Laravel, mas "JavaScript" não conta como Java: igual ou seguido de espaço.
export const usesTech = (s: Service, tech: string) => s.stack.some((t) => t === tech || t.startsWith(`${tech} `))

// Onde a tecnologia aparece nos serviços listados, já derivado do conteúdo (nada escrito à mão).
export const usedIn = (c: Content, tech: string) => [...c.work, ...c.projects].filter((s) => usesTech(s, tech))

// Em produção = está na lista "em produção" do conteúdo ou roda num serviço operacional.
export function inProduction(c: Content, tech: string): boolean {
  const listed = c.stack.prod.flatMap((p) => p.split(' / ')).includes(tech)
  return listed || usedIn(c, tech).some((s) => s.status === 'ok')
}
