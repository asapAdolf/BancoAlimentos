import type { TipoUsuario } from './Usuario.js'

export interface Establecimiento {
  id: string
  nombre: string
  tipo: TipoUsuario
  direccion: string
  zona: string
  puntoRecoleccion: string
  telefono: string
  usuarioId?: string // usuario dueño del establecimiento
}
