import { IllegalArgumentException } from '../../errores/Excepciones.js'
import { equalsIgnoreCase } from '../../utils/texto.js'
import { DescuentoPorCaducidad } from './DescuentoPorCaducidad.js'
import { DescuentoPorDisponibilidad } from './DescuentoPorDisponibilidad.js'
import type { DescuentoStrategy } from './DescuentoStrategy.js'

export function crearEstrategia(tipo: string): DescuentoStrategy {
  if (equalsIgnoreCase(tipo, 'caducidad')) return new DescuentoPorCaducidad()
  else if (equalsIgnoreCase(tipo, 'disponibilidad')) return new DescuentoPorDisponibilidad()
  throw new IllegalArgumentException('Estrategia de descuento no válida')
}
