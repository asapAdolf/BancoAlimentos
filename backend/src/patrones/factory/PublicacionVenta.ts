import { IllegalArgumentException } from '../../errores/Excepciones.js'
import type { Alimento } from '../../modelos/Alimento.js'
import type { Establecimiento } from '../../modelos/Establecimiento.js'
import type { HorarioRecoleccion } from '../../modelos/HorarioRecoleccion.js'
import type { EstadoPublicacion, Modalidad } from '../../modelos/tipos.js'
import type { DatosPublicacion, PublicacionAlimento, PublicacionDTO } from './PublicacionAlimento.js'

// PATRÓN FACTORY METHOD — Producto concreto (como "Mago implements Personajes").
// Venta normal: el precio final es el precio base.
export class PublicacionVenta implements PublicacionAlimento {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  estadoActual: EstadoPublicacion
  precioBase: number
  fechaPublicacion: string

  constructor(datos: DatosPublicacion) {
    if (!(datos.precioBase > 0)) {
      throw new IllegalArgumentException('Una publicación de venta necesita un precio mayor a 0.')
    }
    this.id = datos.id
    this.alimento = datos.alimento
    this.horarioRecoleccion = datos.horarioRecoleccion
    this.establecimiento = datos.establecimiento
    this.estadoActual = datos.estadoActual ?? 'disponible'
    this.precioBase = datos.precioBase
    this.fechaPublicacion = datos.fechaPublicacion ?? new Date().toISOString()
  }

  getModalidad(): Modalidad {
    return 'venta'
  }

  getPorcentajeDescuento(): number {
    return 0
  }

  calcularPrecioFinal(): number {
    return this.precioBase
  }

  mostrarPublicacion(): void {
    console.log(
      `\n[Venta] "${this.alimento.nombre}" de ${this.establecimiento.nombre} a $${this.calcularPrecioFinal()} MXN.`,
    )
  }

  toJSON(): PublicacionDTO {
    return {
      id: this.id,
      modalidad: this.getModalidad(),
      alimento: this.alimento,
      horarioRecoleccion: this.horarioRecoleccion,
      estadoActual: this.estadoActual,
      precioBase: this.precioBase,
      porcentajeDescuento: this.getPorcentajeDescuento(),
      precioFinal: this.calcularPrecioFinal(),
      establecimiento: this.establecimiento,
      fechaPublicacion: this.fechaPublicacion,
    }
  }
}
