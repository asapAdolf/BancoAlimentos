export type TipoUsuario =
  | 'persona'
  | 'organizacion'
  | 'restaurante'
  | 'cafeteria'
  | 'panaderia'
  | 'supermercado'

export interface Usuario {
  id: string
  nombre: string
  correo: string
  telefono: string
  tipo: TipoUsuario
  nombreEstablecimiento?: string
}

export const ETIQUETAS_TIPO: Record<TipoUsuario, string> = {
  persona: 'Persona',
  organizacion: 'Organización social',
  restaurante: 'Restaurante',
  cafeteria: 'Cafetería',
  panaderia: 'Panadería',
  supermercado: 'Supermercado',
}

export const TIPOS_ESTABLECIMIENTO: TipoUsuario[] = [
  'restaurante',
  'cafeteria',
  'panaderia',
  'supermercado',
]

export function esEstablecimiento(tipo: TipoUsuario): boolean {
  return TIPOS_ESTABLECIMIENTO.includes(tipo)
}
