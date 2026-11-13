import type { CategoriaAlimento, UnidadAlimento } from './tipos.js'

// Clase "Alimento" del diagrama: nombre, kilos, fechaCaducidad, cantidadDisponible.
export interface Alimento {
  nombre: string
  kilos: number
  fechaCaducidad: string // AAAA-MM-DD
  cantidadDisponible: number
  descripcion: string
  categoria: CategoriaAlimento
  unidad: UnidadAlimento
  foto: string
}
