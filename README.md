# pedro-lucas · portfólio

Portfólio em formato de console de monitoramento: experiências e projetos como serviços com status, casos
técnicos como incidentes resolvidos (sintoma → causa → correção) e commits reais vindos do GitHub.

```bash
npm install
npm run dev        # local
npm test           # vitest
npm run typecheck && npm run lint && npm run build
npm run cv         # gera public/cv-{pt,en}.pdf (precisa do build servido em localhost:4173)
```

## Decisões

- **Vite + React 19 + TypeScript + Tailwind v4, sem router e sem lib de UI.** As abas usam o `#hash` da URL
  (`useTabs`): link direto e o botão "voltar" funcionam sem dependência nova. A aba "agora" sai do git (`scripts/github-snapshot.mjs`); de repositório privado entram só contagem e datas.
- **Conteúdo separado da UI.** Todo texto do site e do CV fica em `src/content.ts`, tipado por `Content`.
  Faltar uma chave em pt ou em en é erro de compilação.
- **i18n por estado.** `useState<Lang>` mais `document.documentElement.lang`, sem biblioteca.
- **GitHub sem token e sem tela vazia.** Os commits vêm ao vivo de uma lista fechada de repositórios públicos.
  Se a API falhar (limite de 60/h, 403/429, rede), entra o retrato gerado no build
  (`scripts/github-snapshot.mjs`, no `prebuild`). O layout tem o mesmo tamanho carregando ou pronto (CLS 0).
- **CV em PDF gerado do próprio site.** `cv.html` renderiza o mesmo `content.ts`, e o Chrome headless imprime
  os PDFs. Não tem `window.print()`: no celular o botão baixa o arquivo.
- **Testes de comportamento, não de markup:** paleta Ctrl+K, abas e hash, abertura, fallback do GitHub e uma
  guarda de conteúdo. A guarda verifica que site, CV e commits não citam cliente sob NDA nem dado privado. Os
  termos ficam só como hash, pra guarda não publicar o que protege.
- **Acessibilidade:** contraste AA, `prefers-reduced-motion` respeitado (sem abertura e sem animação),
  navegação toda por teclado e seções com `aria-labelledby`.
- Ícone de download: [Lucide](https://lucide.dev) (licença ISC).
