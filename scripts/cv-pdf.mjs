// Gera public/cv-pt.pdf e public/cv-en.pdf a partir de cv.html, com o Chrome instalado.
// Uso: npm run build && npm run preview (outro terminal) && npm run cv
// CHROME=<caminho> se o Chrome não estiver no lugar padrão do Windows.
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const chrome = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = process.env.CV_URL ?? 'http://localhost:4173/cv.html'

for (const lang of ['pt', 'en']) {
  // Caminho absoluto: o Chrome não resolve relativo ao cwd do npm.
  const out = resolve(`public/cv-${lang}.pdf`)
  rmSync(out, { force: true })
  execFileSync(chrome, [
    '--headless=new',
    '--no-pdf-header-footer',
    `--print-to-pdf=${out}`,
    `${base}?lang=${lang}`,
  ])
  if (!existsSync(out)) throw new Error(`Chrome não gerou ${out}`)
  console.log(out)
}
