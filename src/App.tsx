import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PanelLayout from './components/layout/PanelLayout'
import Toasts from './components/ui/Toasts'
import PaginaInicio from './pages/PaginaInicio'
import PaginaLogin from './pages/PaginaLogin'
import PaginaRegistro from './pages/PaginaRegistro'
import PaginaResumen from './pages/PaginaResumen'
import PaginaCatalogo from './pages/PaginaCatalogo'
import PaginaDetalle from './pages/PaginaDetalle'
import PaginaPublicar from './pages/PaginaPublicar'
import PaginaMisPublicaciones from './pages/PaginaMisPublicaciones'
import PaginaReservaciones from './pages/PaginaReservaciones'
import PaginaNotificaciones from './pages/PaginaNotificaciones'
import PaginaUbicacion from './pages/PaginaUbicacion'
import PaginaEstadisticas from './pages/PaginaEstadisticas'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada'

// Estructura común de las páginas públicas: menú arriba, contenido, pie abajo.
function LayoutPublico() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Al cambiar de pantalla, regresa al inicio de la página.
function ScrollArriba() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        {/* Sitio público */}
        <Route element={<LayoutPublico />}>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/registro" element={<PaginaRegistro />} />
          <Route path="/catalogo" element={<PaginaCatalogo />} />
          <Route path="/catalogo/:id" element={<PaginaDetalle />} />
          <Route path="/ubicacion" element={<PaginaUbicacion />} />
          <Route path="/estadisticas" element={<PaginaEstadisticas />} />
        </Route>

        {/* Panel (requiere sesión; PanelLayout redirige al login si no hay) */}
        <Route path="/app" element={<PanelLayout />}>
          <Route index element={<PaginaResumen />} />
          <Route path="catalogo" element={<PaginaCatalogo />} />
          <Route path="catalogo/:id" element={<PaginaDetalle />} />
          <Route path="publicar" element={<PaginaPublicar />} />
          <Route path="publicaciones" element={<PaginaMisPublicaciones />} />
          <Route path="reservaciones" element={<PaginaReservaciones />} />
          <Route path="notificaciones" element={<PaginaNotificaciones />} />
          <Route path="ubicacion" element={<PaginaUbicacion />} />
          <Route path="estadisticas" element={<PaginaEstadisticas />} />
        </Route>

        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
      <Toasts />
    </>
  )
}
