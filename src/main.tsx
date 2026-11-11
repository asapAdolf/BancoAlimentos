import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { PlataformaProvider } from './context/PlataformaContext'
import './styles/global.css'
import './styles/landing.css'
import './styles/auth.css'
import './styles/componentes.css'
import './styles/panel.css'
import './styles/paginas.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlataformaProvider>
          <App />
        </PlataformaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
