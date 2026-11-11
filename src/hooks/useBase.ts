import { useLocation } from 'react-router-dom'

// Las pantallas de catálogo, detalle, ubicación e impacto existen en dos lugares:
// en el sitio público ("/catalogo") y dentro del panel ("/app/catalogo").
// Este hook indica en cuál estamos para armar bien los enlaces.
export function useBase() {
  const { pathname } = useLocation()
  const enPanel = pathname.startsWith('/app')
  return { enPanel, base: enPanel ? '/app' : '' }
}
