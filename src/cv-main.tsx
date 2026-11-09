import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { content } from './content'
import { Cv } from './Cv'

// cv.html?lang=en → versão em inglês. Usado só pra gerar os PDFs (npm run cv).
const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pt'
document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cv c={content[lang]} />
  </StrictMode>,
)
