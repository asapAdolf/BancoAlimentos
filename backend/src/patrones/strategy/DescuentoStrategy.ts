import type { Alimento } from '../../modelos/Alimento.js'
import type { EstrategiaDescuento } from '../../modelos/tipos.js'

export interface DescuentoStrategy {
  calcularDescuento(alimento: Alimento, porcentajeMaximo: number): number
  getTipo(): EstrategiaDescuento
  getDescripcion(): string
}

export const DESCUENTO_MINIMO = 1
export const DESCUENTO_MAXIMO = 90

export function porcentajeDe(porcentajeMaximo: number, fraccion: number): number {
  return Math.max(DESCUENTO_MINIMO, Math.round(porcentajeMaximo * fraccion))
}
