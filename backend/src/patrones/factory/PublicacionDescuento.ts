import { IllegalArgumentException } from '../../errores/Excepciones.js'
import type { Alimento } from '../../modelos/Alimento.js'
import type { Establecimiento } from '../../modelos/Establecimiento.js'
import type { HorarioRecoleccion } from '../../modelos/HorarioRecoleccion.js'
import type { EstadoPublicacion, Modalidad } from '../../modelos/tipos.js'
import { crearEstrategia } from '../strategy/crearEstrategia.js'
import { DESCUENTO_MAXIMO, DESCUENTO_MINIMO, type DescuentoStrategy } from '../strategy/DescuentoStrategy.js'
import {
  redondear,
  type DatosPublicacion,
  type PublicacionAlimento,
  type PublicacionDTO,
} from './PublicacionAlimento.js'

export { DESCUENTO_MAXIMO, DESCUENTO_MINIMO }

// PATRÓN FACTORY METHOD — Producto concreto (como "Arquero implements Personajes").
// Venta con descuento: el precio final se reduce según el porcentaje que calcula la estrategia.
//
// PATRÓN STRATEGY — Contexto. Cumple el papel de "Paqueteria" / "Negocio" del código muestra:
//
//   class Paqueteria
//   {
//     private envio : EnvioStrategy;
//     constructor(envio:EnvioStrategy) { this.envio = envio; }
//     cambiarEnvio(envio:EnvioStrategy):void { this.envio = envio; }
//     aplicarEnvio():void { this.envio.calcularCosto(); }
//   }
//
// La publicación guarda una DescuentoStrategy y le delega el cálculo del porcentaje.
// Se puede cambiar la estrategia en cualquier momento con cambiarEstrategia().
export class PublicacionDescuento implements PublicacionAlimento {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  estadoActual: EstadoPublicacion
  precioBase: number
  fechaPublicacion: string
  porcentajeMaximo: number // tope que eligió el establecimiento
  private estrategia: DescuentoStrategy

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
    this.porcentajeMaximo = datos.porcentajeDescuento as number
    this.estrategia = crearEstrategia(datos.estrategiaDescuento ?? 'caducidad')
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

  // Equivale a cambiarEnvio(envio) / cambiarEstrategia(estrategia).
  cambiarEstrategia(estrategia: DescuentoStrategy): void {
    this.estrategia = estrategia
  }

  getEstrategia(): DescuentoStrategy {
    return this.estrategia
  }

  // Equivale a aplicarEnvio() / aplicarEstrategia(): delega el cálculo en la estrategia actual.
  aplicarEstrategia(): number {
    return this.estrategia.calcularDescuento(this.alimento, this.porcentajeMaximo)
  }

  getModalidad(): Modalidad {
    return 'descuento'
  }

  getPorcentajeDescuento(): number {
    return this.aplicarEstrategia()
  }

  calcularPrecioFinal(): number {
    return redondear(this.precioBase * (1 - this.getPorcentajeDescuento() / 100))
  }

  mostrarPublicacion(): void {
    console.log(
      `\n[Descuento] "${this.alimento.nombre}" de ${this.establecimiento.nombre}: ` +
        `antes $${this.precioBase}, ahora $${this.calcularPrecioFinal()} MXN (-${this.getPorcentajeDescuento()}%). ` +
        this.estrategia.getDescripcion(),
    )
  }

  toJSON(): PublicacionDTO {
    return {
      id: this.id,
      modalidad: this.getModalidad(),
      alimento: this.alimento,
      horarioRecoleccion: this.horarioRecoleccion,
      estadoActual: this.estadoActual,
      estrategiaDescuento: this.estrategia.getTipo(),
      precioBase: this.precioBase,
      porcentajeMaximo: this.porcentajeMaximo,
      porcentajeDescuento: this.getPorcentajeDescuento(),
      precioFinal: this.calcularPrecioFinal(),
      establecimiento: this.establecimiento,
      fechaPublicacion: this.fechaPublicacion,
    }
  }
}
