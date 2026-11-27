import type { Alimento } from '../../modelos/Alimento.js'
import type { EstrategiaDescuento } from '../../modelos/tipos.js'
import { diasHasta } from '../../utils/fechas.js'
import { porcentajeDe, type DescuentoStrategy } from './DescuentoStrategy.js'

export class DescuentoPorCaducidad implements DescuentoStrategy {
  calcularDescuento(alimento: Alimento, porcentajeMaximo: number): number {
    const dias = diasHasta(alimento.fechaCaducidad)
    if (dias <= 0) return porcentajeDe(porcentajeMaximo, 1)
    else if (dias === 1) return porcentajeDe(porcentajeMaximo, 0.75)
    else if (dias === 2) return porcentajeDe(porcentajeMaximo, 0.5)
    return porcentajeDe(porcentajeMaximo, 0.25)
  }

  getTipo(): EstrategiaDescuento {
    return 'caducidad'
  }

  getDescripcion(): string {
    return 'Descuento por caducidad: entre más cerca de caducar, mayor descuento.'
  }
}
