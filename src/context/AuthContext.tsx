import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types/usuario'

const CLAVE_SESION = 'ra_sesion_activa'
const CLAVE_USUARIOS = 'ra_usuarios_registrados'

const USUARIOS_DEFAULT: Usuario[] = [
  { id: 'usr-001', nombre: 'Cliente Demo', correo: 'cliente@demo.mx', telefono: '2221234567', tipo: 'persona' },
  { id: 'usr-002', nombre: 'Empresa Demo', correo: 'empresa@demo.mx', telefono: '2225554433', tipo: 'restaurante', nombreEstablecimiento: 'Empresa Demo' },
  { id: 'usr-003', nombre: 'Transportista Demo', correo: 'transportista@demo.mx', telefono: '2227778899', tipo: 'organizacion' },
  { id: 'usr-004', nombre: 'Administrador Demo', correo: 'admin@demo.mx', telefono: '2220000000', tipo: 'persona' },
]

interface AuthContextoValor {
  usuario: Usuario | null
  iniciarSesion: (correo: string) => boolean
  registrar: (datos: Omit<Usuario, 'id'>) => void
  cerrarSesion: () => void
}

const AuthContexto = createContext<AuthContextoValor | null>(null)

function leerSesion(): Usuario | null {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION)
    return guardada ? (JSON.parse(guardada) as Usuario) : null
  } catch {
    return null
  }
}

function leerUsuarios(): Usuario[] {
  try {
    const guardados = localStorage.getItem(CLAVE_USUARIOS)
    if (guardados) {
      const parsed = JSON.parse(guardados) as Usuario[]
      if (parsed.length > 0) return parsed
    }
    return USUARIOS_DEFAULT
  } catch {
    return USUARIOS_DEFAULT
  }
}

function guardarUsuarios(usuarios: Usuario[]) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
  } catch {

  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioEstado] = useState<Usuario | null>(leerSesion)

  const guardarSesion = (nuevo: Usuario | null) => {
    setUsuarioEstado(nuevo)
    try {
      if (nuevo) localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevo))
      else localStorage.removeItem(CLAVE_SESION)
    } catch {

  }
  }

  const iniciarSesion = (correo: string): boolean => {
    const clave = correo.trim().toLowerCase()
    const usuarios = leerUsuarios()
    const encontrado = usuarios.find((u) => u.correo.toLowerCase() === clave)
    if (!encontrado) return false
    guardarSesion(encontrado)
    return true
  }

  const registrar = (datos: Omit<Usuario, 'id'>) => {
    const clave = datos.correo.trim().toLowerCase()
    const usuarios = leerUsuarios()
    const nuevo: Usuario = { ...datos, correo: clave, id: `usr-${Date.now()}` }
    const actualizados = [...usuarios.filter((u) => u.correo.toLowerCase() !== clave), nuevo]
    guardarUsuarios(actualizados)
    guardarSesion(nuevo)
  }

  const cerrarSesion = () => guardarSesion(null)

  return (
    <AuthContexto.Provider value={{ usuario, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AuthContexto.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextoValor {
  const contexto = useContext(AuthContexto)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  return contexto
}
