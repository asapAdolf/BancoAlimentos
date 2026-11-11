import { useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CalendarCheck,
  ClipboardList,
  Home,
  Leaf,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  PlusCircle,
  Store,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePlataforma } from '../../context/PlataformaContext'
import { ETIQUETAS_TIPO, esEstablecimiento } from '../../types/usuario'
import { nombreDeEstablecimiento } from '../../data/establecimientos'

interface ItemMenu {
  to: string
  texto: string
  icono: LucideIcon
  fin?: boolean
  soloEstablecimientos?: boolean
  insignia?: boolean
}

const items: ItemMenu[] = [
  { to: '/app', texto: 'Resumen', icono: LayoutDashboard, fin: true },
  { to: '/app/catalogo', texto: 'Catálogo', icono: Store },
  { to: '/app/publicar', texto: 'Publicar alimento', icono: PlusCircle, soloEstablecimientos: true },
  { to: '/app/publicaciones', texto: 'Mis publicaciones', icono: ClipboardList, soloEstablecimientos: true },
  { to: '/app/reservaciones', texto: 'Reservaciones', icono: CalendarCheck },
  { to: '/app/notificaciones', texto: 'Notificaciones', icono: Bell, insignia: true },
  { to: '/app/ubicacion', texto: 'Ubicación y recolección', icono: MapPin },
  { to: '/app/estadisticas', texto: 'Impacto', icono: BarChart3 },
]

// Estructura del panel: menú lateral + barra superior + contenido que cambia según la sección.
export default function PanelLayout() {
  const { usuario, cerrarSesion } = useAuth()
  const { noLeidas } = usePlataforma()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navegar = useNavigate()

  // El panel solo es para usuarios con sesión iniciada.
  if (!usuario) return <Navigate to="/login" replace />

  const esNegocio = esEstablecimiento(usuario.tipo)
  const nombreMostrado = esNegocio ? nombreDeEstablecimiento(usuario) : usuario.nombre
  const menu = items.filter((i) => !i.soloEstablecimientos || esNegocio)

  const salir = () => {
    cerrarSesion()
    navegar('/')
  }

  return (
    <div className="panel">
      {menuAbierto && <div className="panel-fondo" onClick={() => setMenuAbierto(false)} />}

      <aside className={`panel-lateral ${menuAbierto ? 'abierto' : ''}`}>
        <Link to="/" className="logo" onClick={() => setMenuAbierto(false)}>
          <span className="logo-icono">
            <Leaf size={22} />
          </span>
          Rescate Alimentario
        </Link>

        <nav className="panel-nav" aria-label="Secciones del panel">
          {menu.map((item) => {
            const Icono = item.icono
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.fin}
                className={({ isActive }) => (isActive ? 'activo' : '')}
                onClick={() => setMenuAbierto(false)}
              >
                <Icono size={20} />
                {item.texto}
                {item.insignia && noLeidas > 0 && <span className="badge-nav">{noLeidas}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="panel-usuario">
          <div className="usuario-avatar">{nombreMostrado.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{nombreMostrado}</strong>
            <span>{ETIQUETAS_TIPO[usuario.tipo]}</span>
          </div>
        </div>
        <Link to="/" className="panel-enlace" onClick={() => setMenuAbierto(false)}>
          <Home size={18} /> Ir al sitio
        </Link>
        <button className="panel-enlace" onClick={salir}>
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      <div className="panel-principal">
        <header className="panel-superior">
          <button
            className="btn-menu-panel"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <X size={26} /> : <Menu size={26} />}
          </button>
          <span className="panel-saludo">
            Hola, <strong>{usuario.nombre.split(' ')[0]}</strong>
          </span>
          <Link to="/app/notificaciones" className="panel-campana" aria-label="Notificaciones">
            <Bell size={22} />
            {noLeidas > 0 && <span className="punto-contador">{noLeidas}</span>}
          </Link>
        </header>

        <main className="panel-contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
