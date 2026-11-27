import type { CategoriaAlimento, UnidadAlimento } from './tipos.js'

export interface Alimento {
  nombre: string
  kilos: number
  fechaCaducidad: string
  cantidadDisponible: number
  descripcion: string
  categoria: CategoriaAlimento
  unidad: UnidadAlimento
  foto: string
}
