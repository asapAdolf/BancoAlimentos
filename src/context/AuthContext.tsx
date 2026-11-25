import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types/usuario'

const CLAVE_SESION = 'ra_sesion_activa'
const CLAVE_USUARIOS = 'ra_usuarios_registrados'

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
    return guardados ? (JSON.parse(guardados) as Usuario[]) : []
  } catch {
    return []
  }
}

function guardarUsuarios(usuarios: Usuario[]) {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
  } catch {
    // Almacenamiento restringido en el navegador
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
      // Almacenamiento restringido en el navegador
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
