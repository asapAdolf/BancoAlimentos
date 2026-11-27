import type { Alimento } from '../../modelos/Alimento.js'
import type { EstrategiaDescuento } from '../../modelos/tipos.js'
import { porcentajeDe, type DescuentoStrategy } from './DescuentoStrategy.js'

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
