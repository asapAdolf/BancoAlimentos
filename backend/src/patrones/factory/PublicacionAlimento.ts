import type { Alimento } from '../../modelos/Alimento.js'
import type { Establecimiento } from '../../modelos/Establecimiento.js'
import type { HorarioRecoleccion } from '../../modelos/HorarioRecoleccion.js'
import type { EstadoPublicacion, EstrategiaDescuento, Modalidad } from '../../modelos/tipos.js'

export interface PublicacionAlimento {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  estadoActual: EstadoPublicacion
  precioBase: number
  fechaPublicacion: string

  getModalidad(): Modalidad
  getPorcentajeDescuento(): number
  calcularPrecioFinal(): number
  mostrarPublicacion(): void
  toJSON(): PublicacionDTO
}

export interface DatosPublicacion {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  precioBase: number
  porcentajeDescuento?: number
  estrategiaDescuento?: EstrategiaDescuento
  estadoActual?: EstadoPublicacion
  fechaPublicacion?: string
}

export interface PublicacionDTO {
  id: string
  modalidad: Modalidad
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  estadoActual: EstadoPublicacion
  estrategiaDescuento?: EstrategiaDescuento
  precioBase: number
  porcentajeMaximo?: number
  porcentajeDescuento: number
  precioFinal: number
  establecimiento: Establecimiento
  fechaPublicacion: string
}

export function redondear(valor: number): number {
  return Math.round(valor * 100) / 100
}
