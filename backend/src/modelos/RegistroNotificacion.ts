// Aviso guardado para mostrarlo en la pantalla de Notificaciones.
// (Se llama "RegistroNotificacion" para no confundirlo con la interfaz Notificacion del Adapter.)
export type TipoNotificacion = 'nuevo' | 'descuento' | 'reservado' | 'listo' | 'entrega'

export interface RegistroNotificacion {
  id: string
  usuarioId: string | null // null = aviso general para todos
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  fecha: string // ISO
  leida: boolean
  publicacionId?: string
}
