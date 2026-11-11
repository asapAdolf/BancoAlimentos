import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types/usuario'
import { perfilesDemo } from '../data/perfilesDemo'

// ESTADO DE INTERFAZ: guarda quién está "conectado" para que las pantallas
// puedan mostrar u ocultar opciones. No hay autenticación real.
// Cuando el equipo de Back-End tenga su API, aquí se conectará el inicio de sesión.

const CLAVE_SESION = 'ra_sesion_demo'

interface AuthContextoValor {
  usuario: Usuario | null
  iniciarSesion: (correo: string) => void
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

export function AuthProvider({ children }: { children: ReactNode }) {
  // Se conserva la vista de demostración al recargar la página.
  const [usuario, setUsuarioEstado] = useState<Usuario | null>(leerSesion)

  const guardar = (nuevo: Usuario | null) => {
    setUsuarioEstado(nuevo)
    try {
      if (nuevo) localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevo))
      else localStorage.removeItem(CLAVE_SESION)
    } catch {
      // Si el navegador bloquea el almacenamiento, la demo sigue funcionando.
    }
  }

  // Muestra un perfil de ejemplo si el correo es de demostración;
  // con cualquier otro correo entra como "Persona".
  const iniciarSesion = (correo: string) => {
    const clave = correo.trim().toLowerCase()
    const perfil = perfilesDemo[clave]
    guardar(
      perfil ?? {
        id: `usr-${Date.now()}`,
        nombre: clave.split('@')[0],
        correo: clave,
        telefono: '',
        tipo: 'persona',
      },
    )
  }

  const registrar = (datos: Omit<Usuario, 'id'>) => {
    guardar({ ...datos, id: `usr-${Date.now()}` })
  }

  const cerrarSesion = () => guardar(null)

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
