import type { Alimento } from '../../modelos/Alimento.js'
import type { EstrategiaDescuento } from '../../modelos/tipos.js'
import { porcentajeDe, type DescuentoStrategy } from './DescuentoStrategy.js'

// PATRÓN STRATEGY — Estrategia concreta (como "EnvioExpres implements EnvioStrategy").
// Entre más unidades quedan disponibles, mayor es el descuento (para venderlas antes):
//
//   20 unidades o más -> 100% del máximo
//   10 a 19 unidades  ->  75% del máximo
//    5 a 9 unidades   ->  50% del máximo
//    menos de 5       ->  25% del máximo
export class DescuentoPorDisponibilidad implements DescuentoStrategy {
  calcularDescuento(alimento: Alimento, porcentajeMaximo: number): number {
    const cantidad = alimento.cantidadDisponible
    if (cantidad >= 20) return porcentajeDe(porcentajeMaximo, 1)
    else if (cantidad >= 10) return porcentajeDe(porcentajeMaximo, 0.75)
    else if (cantidad >= 5) return porcentajeDe(porcentajeMaximo, 0.5)
    return porcentajeDe(porcentajeMaximo, 0.25)
  }

  getTipo(): EstrategiaDescuento {
    return 'disponibilidad'
  }

  getDescripcion(): string {
    return 'Descuento por disponibilidad: entre más unidades quedan, mayor descuento.'
  }
}
