import { EMAIL, WHATSAPP } from '../content'

export type Draft = { type: string; name: string; message: string }

function text({ type, name, message }: Draft, signature: string) {
  const who = name.trim()
  return { subject: `[${type}] ${who || '—'}`, body: `${message.trim()}\n\n${who ? `${who} · ` : ''}${signature}` }
}

// Link do WhatsApp com a mensagem pronta (o visitante só confirma o envio no app dele).
export function requestWhatsapp(draft: Draft, signature: string): string {
  const { subject, body } = text(draft, signature)
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`
}

// Monta o mailto do pedido. Tudo vai codificado: acento, quebra de linha e "&" não quebram o link.
export function requestMailto(draft: Draft, signature: string): string {
  const { subject, body } = text(draft, signature)
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
