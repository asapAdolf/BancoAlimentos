import type { CategoriaAlimento, EstadoPublicacion, Modalidad } from './alimento'

export const PRECIO_MAXIMO = 800

export interface Filtros {
  busqueda: string
  categoria: CategoriaAlimento | 'todas'
  modalidad: Modalidad | 'todas'
  precioMax: number
  zona: string
  disponibilidad: EstadoPublicacion | 'todas'
  orden: 'recientes' | 'caducidad' | 'precio'
}

export const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  categoria: 'todas',
  modalidad: 'todas',
  precioMax: PRECIO_MAXIMO,
  zona: 'todas',
  disponibilidad: 'todas',
  orden: 'recientes',
}
