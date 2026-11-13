import type { Alimento } from '../../modelos/Alimento.js'
import type { Establecimiento } from '../../modelos/Establecimiento.js'
import type { HorarioRecoleccion } from '../../modelos/HorarioRecoleccion.js'
import type { EstadoPublicacion, Modalidad } from '../../modelos/tipos.js'
import type { DatosPublicacion, PublicacionAlimento, PublicacionDTO } from './PublicacionAlimento.js'

// PATRÓN FACTORY METHOD — Producto concreto (como "Guerrero implements Personajes").
// Donación: el alimento se entrega gratis, sin importar el precio que se haya enviado.
export class PublicacionDonacion implements PublicacionAlimento {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  estadoActual: EstadoPublicacion
  precioBase: number
  fechaPublicacion: string

  constructor(datos: DatosPublicacion) {
    this.id = datos.id
    this.alimento = datos.alimento
    this.horarioRecoleccion = datos.horarioRecoleccion
    this.establecimiento = datos.establecimiento
    this.estadoActual = datos.estadoActual ?? 'disponible'
    this.precioBase = 0
    this.fechaPublicacion = datos.fechaPublicacion ?? new Date().toISOString()
  }

  getModalidad(): Modalidad {
    return 'donacion'
  }

  getPorcentajeDescuento(): number {
    return 0
  }

  calcularPrecioFinal(): number {
    return 0
  }

  mostrarPublicacion(): void {
    console.log(
      `\n[Donación] "${this.alimento.nombre}" de ${this.establecimiento.nombre}, gratis para organizaciones y personas.`,
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
