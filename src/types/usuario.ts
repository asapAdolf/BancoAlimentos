// Tipos de usuario que pueden registrarse en la plataforma.
export type TipoUsuario =
  | 'persona'
  | 'organizacion'
  | 'restaurante'
  | 'cafeteria'
  | 'panaderia'
  | 'supermercado'

// NOTA: "Usuario" aparece en tu diagrama como parámetro de solicitarReserva(usuario),
// pero no tiene clase propia. Aquí es solo un tipo de TypeScript para la vista.
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

// Los establecimientos publican alimentos; personas y organizaciones los reservan.
export function esEstablecimiento(tipo: TipoUsuario): boolean {
  return TIPOS_ESTABLECIMIENTO.includes(tipo)
}
