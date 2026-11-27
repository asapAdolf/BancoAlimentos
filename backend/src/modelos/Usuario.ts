export type TipoUsuario =
  | 'persona'
  | 'organizacion'
  | 'restaurante'
  | 'cafeteria'
  | 'panaderia'
  | 'supermercado'

export type CanalNotificacion = 'sms' | 'whatsapp' | 'email'

export interface Usuario {
  id: string
  nombre: string
  correo: string
  telefono: string
  tipo: TipoUsuario
  nombreEstablecimiento?: string
  canalNotificacion?: CanalNotificacion
}

export const TIPOS_USUARIO: TipoUsuario[] = [
  'persona',
  'organizacion',
  'restaurante',
  'cafeteria',
  'panaderia',
  'supermercado',
]

export const TIPOS_ESTABLECIMIENTO: TipoUsuario[] = ['restaurante', 'cafeteria', 'panaderia', 'supermercado']

export function esEstablecimiento(tipo: TipoUsuario): boolean {
  return TIPOS_ESTABLECIMIENTO.includes(tipo)
}
