import { useId, useState } from 'react'
import type { Content } from '../content'
import { requestMailto, requestWhatsapp } from '../lib/request'
import { Section } from './Section'

// Formulário de pedido sem servidor: monta a mensagem e abre no app de e-mail de quem visita.
// A prévia ao lado mostra o "chamado" sendo montado.
export function RequestPage({ c }: { c: Content }) {
  const r = c.request
  const [type, setType] = useState(r.types[0])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const nameId = useId()
  const messageId = useId()
  const ready = message.trim().length > 0
  const field = 'w-full rounded-lg border border-line bg-bg/70 px-3 py-2 text-sm outline-none focus:border-accent'

  return (
    <Section id="requests" title={c.ui.nav.requests}>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <form className="rounded-xl border border-line bg-panel/80 p-5 backdrop-blur" onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-lg font-semibold">{r.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{r.intro}</p>

          <fieldset className="mt-5">
            <legend className="mb-2 font-mono text-[11px] tracking-widest text-muted uppercase">{r.typeLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {r.types.map((t) => (
                <label
                  key={t}
                  className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-[12px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    t === type ? 'border-accent bg-accent/15 text-accent' : 'border-line text-muted hover:text-fg'
                  }`}
                >
                  <input type="radio" name="type" value={t} checked={t === type} onChange={() => setType(t)} className="sr-only" />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor={nameId} className="mt-5 mb-2 block font-mono text-[11px] tracking-widest text-muted uppercase">
            {r.nameLabel}
          </label>
          <input id={nameId} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />

          <label htmlFor={messageId} className="mt-5 mb-2 block font-mono text-[11px] tracking-widest text-muted uppercase">
            {r.messageLabel}
          </label>
          <textarea id={messageId} value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={`${field} resize-y`} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {ready ? (
              <>
                <a
                  href={requestWhatsapp({ type, name, message }, r.signature)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent/85"
                >
                  {r.sendWhatsapp} →
                </a>
                <a
                  href={requestMailto({ type, name, message }, r.signature)}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
                >
                  {r.send}
                </a>
              </>
            ) : (
              <>
                <button type="button" disabled className="cursor-not-allowed rounded-lg bg-accent/30 px-4 py-2 text-sm font-semibold text-bg">
                  {r.sendWhatsapp} →
                </button>
                <button type="button" disabled className="cursor-not-allowed rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted">
                  {r.send}
                </button>
              </>
            )}
            {!ready && <span className="font-mono text-[11px] text-muted">{r.empty}</span>}
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted">{r.note}</p>
        </form>

        <aside aria-label={r.preview} className="rounded-xl border border-line bg-bg/80 p-4 font-mono text-[12px] leading-relaxed">
          <p className="mb-3 flex items-center gap-2 text-muted">
            <span aria-hidden className={`size-2 rounded-full ${ready ? 'bg-accent' : 'bg-off'}`} />
            {r.preview}
          </p>
          <p>
            <span className="text-muted">{r.typeLabel.toLowerCase()} </span>
            <span className="text-accent">{type.toLowerCase()}</span>
          </p>
          <p>
            <span className="text-muted">{r.from} </span>
            {name.trim() || '—'}
          </p>
          <p className="my-2 text-line">────────────────</p>
          <p className="break-words whitespace-pre-wrap text-fg/90">{message.trim() || <span className="text-muted">…</span>}</p>
        </aside>
      </div>
    </Section>
  )
}
