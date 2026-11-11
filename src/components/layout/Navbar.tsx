import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const enlaces = [
  { to: '/', texto: 'Inicio' },
  { to: '/catalogo', texto: 'Catálogo' },
  { to: '/app/publicar', texto: 'Publicar' },
  { to: '/estadisticas', texto: 'Impacto' },
]

export default function Navbar() {
  // Controla si el menú está abierto en celulares
  const [abierto, setAbierto] = useState(false)
  const { usuario, cerrarSesion } = useAuth()
  const navegar = useNavigate()

  const salir = () => {
    cerrarSesion()
    setAbierto(false)
    navegar('/')
  }

  return (
    <header className={`navbar ${abierto ? 'abierto' : ''}`}>
      <div className="contenedor navbar-interior">
        <Link to="/" className="logo" onClick={() => setAbierto(false)}>
          <span className="logo-icono">
            <Leaf size={22} />
          </span>
          Rescate Alimentario
        </Link>

        <ul className="navbar-enlaces">
          {enlaces.map((enlace) => (
            <li key={enlace.to}>
              <NavLink
                to={enlace.to}
                end={enlace.to === '/'}
                className={({ isActive }) => (isActive ? 'activo' : '')}
                onClick={() => setAbierto(false)}
              >
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-acciones">
          {usuario ? (
            <>
              <span className="usuario-chip">
                <span className="usuario-avatar">{usuario.nombre.charAt(0).toUpperCase()}</span>
                {usuario.nombre.split(' ')[0]}
              </span>
              <Link to="/app" className="btn btn-primario" onClick={() => setAbierto(false)}>
                <LayoutDashboard size={18} /> Mi panel
              </Link>
              <button className="btn btn-borde" onClick={salir}>
                <LogOut size={18} /> Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-borde" onClick={() => setAbierto(false)}>
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn btn-primario" onClick={() => setAbierto(false)}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-menu"
          aria-label="Abrir menú"
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  )
}
