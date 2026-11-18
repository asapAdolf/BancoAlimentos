import type { Alimento } from '../../modelos/Alimento.js'
import type { EstrategiaDescuento } from '../../modelos/tipos.js'
import { diasHasta } from '../../utils/fechas.js'
import { porcentajeDe, type DescuentoStrategy } from './DescuentoStrategy.js'

// PATRÓN STRATEGY — Estrategia concreta (como "EnvioEstandar implements EnvioStrategy").
// Entre más cerca está la fecha de caducidad, mayor es el descuento:
//
//   caduca hoy (o ya caducó) -> 100% del máximo
//   caduca mañana            ->  75% del máximo
//   caduca en 2 días         ->  50% del máximo
//   caduca en 3 días o más   ->  25% del máximo
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
