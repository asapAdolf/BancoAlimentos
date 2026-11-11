export type TipoNotificacion = 'nuevo' | 'descuento' | 'reservado' | 'listo' | 'entrega'

export interface Notificacion {
  id: string
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  fecha: string // fecha y hora ISO
  leida: boolean
  publicacionId?: string
}
