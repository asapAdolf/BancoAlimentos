import type { Alimento } from '../../modelos/Alimento.js'
import type { Establecimiento } from '../../modelos/Establecimiento.js'
import type { HorarioRecoleccion } from '../../modelos/HorarioRecoleccion.js'
import type { EstadoPublicacion, EstrategiaDescuento, Modalidad } from '../../modelos/tipos.js'

// PATRÓN FACTORY METHOD — Producto.
// Equivale a la interfaz "Personajes" del código muestra:
//
//   public interface Personajes {
//       public void atacar();
//   }
//
// Cada modalidad (Venta, Descuento, Donación) implementa esta interfaz a su manera,
// igual que Mago y Arquero implementan atacar() de forma distinta.
export interface PublicacionAlimento {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  estadoActual: EstadoPublicacion
  precioBase: number
  fechaPublicacion: string

  getModalidad(): Modalidad
  getPorcentajeDescuento(): number
  calcularPrecioFinal(): number
  mostrarPublicacion(): void // equivalente a atacar(): imprime en consola
  toJSON(): PublicacionDTO
}

// Datos que recibe la fábrica para construir cualquier publicación.
export interface DatosPublicacion {
  id: string
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  establecimiento: Establecimiento
  precioBase: number
  porcentajeDescuento?: number // en descuento: porcentaje máximo que la estrategia puede aplicar
  estrategiaDescuento?: EstrategiaDescuento // estrategia (Strategy) con la que se calcula el descuento
  estadoActual?: EstadoPublicacion
  fechaPublicacion?: string
}

// Forma en la que se envía una publicación al Front-End (igual a src/types/alimento.ts,
// más el campo precioFinal ya calculado).
export interface PublicacionDTO {
  id: string
  modalidad: Modalidad
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  estadoActual: EstadoPublicacion
  estrategiaDescuento?: EstrategiaDescuento
  precioBase: number
  porcentajeMaximo?: number // solo en descuento: tope elegido por el establecimiento
  porcentajeDescuento: number // porcentaje aplicado (en descuento lo calcula la estrategia)
  precioFinal: number
  establecimiento: Establecimiento
  fechaPublicacion: string
}

// Redondea a dos decimales (centavos).
export function redondear(valor: number): number {
  return Math.round(valor * 100) / 100
}
