import { useLocation } from 'react-router-dom'

export function useBase() {
  const { pathname } = useLocation()
  const enPanel = pathname.startsWith('/app')
  return { enPanel, base: enPanel ? '/app' : '' }
}
