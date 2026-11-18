import type { Alimento } from '../../modelos/Alimento.js'
import type { EstrategiaDescuento } from '../../modelos/tipos.js'

// PATRÓN STRATEGY — Interfaz de la estrategia.
// Equivale a "EnvioStrategy" / "PatronStrategy" del código muestra:
//
//   interface EnvioStrategy
//   {
//     calcularCosto():void;
//   }
//
// Cada estrategia calcula el porcentaje de descuento de una forma distinta:
// según la caducidad del alimento o según cuántas unidades quedan disponibles.
// "porcentajeMaximo" es el tope que eligió el establecimiento al publicar.
export interface DescuentoStrategy {
  calcularDescuento(alimento: Alimento, porcentajeMaximo: number): number
  getTipo(): EstrategiaDescuento
  getDescripcion(): string
}

export const DESCUENTO_MINIMO = 1
export const DESCUENTO_MAXIMO = 90

// Aplica una fracción del porcentaje máximo y lo deja en un número entero válido.
export function porcentajeDe(porcentajeMaximo: number, fraccion: number): number {
  return Math.max(DESCUENTO_MINIMO, Math.round(porcentajeMaximo * fraccion))
}
