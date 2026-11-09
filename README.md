# pedro-lucas · portfólio

Portfólio em formato de *status page*: experiências como serviços em produção, casos técnicos como
incidentes resolvidos (sintoma → causa → correção).

```bash
npm install
npm run dev        # local
npm test           # vitest
npm run typecheck && npm run lint && npm run build
```

## Decisões

- **Vite + React 19 + TypeScript + Tailwind v4, SPA de uma página.** Não tem rota, então não tem router.
- **Conteúdo separado da UI.** Todo texto fica em `src/content.ts`, tipado por `Content`. Faltar uma chave
  em pt ou em en é erro de compilação.
- **i18n por estado.** `useState<Lang>` mais `document.documentElement.lang`, sem biblioteca.
- **Testes de comportamento, não de markup.** O contato tem que estar clicável, pt e en têm os mesmos itens
  e o conteúdo (site e CV) não pode citar nada de cliente sob NDA nem dado privado. Os termos ficam só como hash, pra guarda não publicar o que protege.
- **Meta tags OG estáticas no `index.html`**, pro preview em rede social.
- Acessibilidade: contraste AA no tema claro e no escuro, `prefers-reduced-motion` respeitado e
  seções com `aria-labelledby`.
