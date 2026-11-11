import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer-grid">
          <div>
            <div className="logo">
              <span className="logo-icono">
                <Leaf size={22} />
              </span>
              Rescate Alimentario
            </div>
            <p>
              Conectamos establecimientos con personas y organizaciones para que
              ningún alimento aprovechable termine en la basura.
            </p>
          </div>
          <div>
            <h4>Plataforma</h4>
            <ul>
              <li><Link to="/catalogo">Explorar alimentos</Link></li>
              <li><Link to="/app/publicar">Publicar alimentos</Link></li>
              <li><Link to="/estadisticas">Impacto</Link></li>
            </ul>
          </div>
          <div>
            <h4>Cuenta</h4>
            <ul>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/registro">Crear cuenta</Link></li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">
          © 2026 Rescate Alimentario · Proyecto universitario de Ingeniería de Software
        </p>
      </div>
    </footer>
  )
}
