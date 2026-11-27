export type TipoNotificacion = 'nuevo' | 'descuento' | 'reservado' | 'listo' | 'entrega'

export interface RegistroNotificacion {
  id: string
  usuarioId: string | null
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  fecha: string
  leida: boolean
  publicacionId?: string
}
