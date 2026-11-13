import { IllegalArgumentException } from '../../errores/Excepciones.js'
import type { Alimento } from '../../modelos/Alimento.js'
import type { Establecimiento } from '../../modelos/Establecimiento.js'
import type { HorarioRecoleccion } from '../../modelos/HorarioRecoleccion.js'
import type { EstadoPublicacion, EstrategiaDescuento, Modalidad } from '../../modelos/tipos.js'
import {
  redondear,
  type DatosPublicacion,
  type PublicacionAlimento,
  type PublicacionDTO,
} from './PublicacionAlimento.js'

export const DESCUENTO_MINIMO = 1
export const DESCUENTO_MAXIMO = 90

// PATRÓN FACTORY METHOD — Producto concreto (como "Arquero implements Personajes").
// Venta con descuento: el precio final se reduce según porcentajeDescuento.
export class PublicacionDescuento implements PublicacionAlimento {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  estadoActual: EstadoPublicacion
  precioBase: number
  fechaPublicacion: string
  porcentajeDescuento: number
  estrategiaDescuento: EstrategiaDescuento

  constructor(datos: DatosPublicacion) {
    if (!(datos.precioBase > 0)) {
      throw new IllegalArgumentException('Una publicación con descuento necesita un precio mayor a 0.')
    }
    PublicacionDescuento.validarPorcentaje(datos.porcentajeDescuento)
    this.id = datos.id
    this.alimento = datos.alimento
    this.horarioRecoleccion = datos.horarioRecoleccion
    this.establecimiento = datos.establecimiento
    this.estadoActual = datos.estadoActual ?? 'disponible'
    this.precioBase = datos.precioBase
    this.fechaPublicacion = datos.fechaPublicacion ?? new Date().toISOString()
    this.porcentajeDescuento = datos.porcentajeDescuento as number
    this.estrategiaDescuento = datos.estrategiaDescuento ?? 'caducidad'
  }

  static validarPorcentaje(porcentaje: number | undefined): void {
    if (
      typeof porcentaje !== 'number' ||
      !Number.isFinite(porcentaje) ||
      porcentaje < DESCUENTO_MINIMO ||
      porcentaje > DESCUENTO_MAXIMO
    ) {
      throw new IllegalArgumentException(
        `El descuento debe estar entre ${DESCUENTO_MINIMO}% y ${DESCUENTO_MAXIMO}%.`,
      )
    }
  }

  getModalidad(): Modalidad {
    return 'descuento'
  }

  getPorcentajeDescuento(): number {
    return this.porcentajeDescuento
  }

  calcularPrecioFinal(): number {
    return redondear(this.precioBase * (1 - this.porcentajeDescuento / 100))
  }

  mostrarPublicacion(): void {
    console.log(
      `\n[Descuento] "${this.alimento.nombre}" de ${this.establecimiento.nombre}: ` +
        `antes $${this.precioBase}, ahora $${this.calcularPrecioFinal()} MXN (-${this.porcentajeDescuento}%).`,
    )
  }

  toJSON(): PublicacionDTO {
    return {
      id: this.id,
      modalidad: this.getModalidad(),
      alimento: this.alimento,
      horarioRecoleccion: this.horarioRecoleccion,
      estadoActual: this.estadoActual,
      estrategiaDescuento: this.estrategiaDescuento,
      precioBase: this.precioBase,
      porcentajeDescuento: this.getPorcentajeDescuento(),
      precioFinal: this.calcularPrecioFinal(),
      establecimiento: this.establecimiento,
      fechaPublicacion: this.fechaPublicacion,
    }
  }
}
