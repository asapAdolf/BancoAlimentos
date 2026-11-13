export type TipoUsuario =
  | 'persona'
  | 'organizacion'
  | 'restaurante'
  | 'cafeteria'
  | 'panaderia'
  | 'supermercado'

// Canal por el que el usuario recibe avisos (se envían con el patrón Adapter).
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

// Los establecimientos publican alimentos; personas y organizaciones los reservan.
export function esEstablecimiento(tipo: TipoUsuario): boolean {
  return TIPOS_ESTABLECIMIENTO.includes(tipo)
}
