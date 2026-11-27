import type { TipoUsuario } from './usuario'

export type Modalidad = 'venta' | 'descuento' | 'donacion'
export type EstadoPublicacion = 'disponible' | 'reservado' | 'entregado'
export type EstrategiaDescuento = 'caducidad' | 'disponibilidad'

export type CategoriaAlimento =
  | 'Pan y repostería'
  | 'Frutas y verduras'
  | 'Comida preparada'
  | 'Lácteos'
  | 'Bebidas'
  | 'Abarrotes'

export type UnidadAlimento = 'piezas' | 'porciones' | 'cajas' | 'botellas' | 'paquetes'

export const CATEGORIAS: CategoriaAlimento[] = [
  'Pan y repostería',
  'Frutas y verduras',
  'Comida preparada',
  'Lácteos',
  'Bebidas',
  'Abarrotes',
]

export const UNIDADES: UnidadAlimento[] = ['piezas', 'porciones', 'cajas', 'botellas', 'paquetes']

export const MODALIDADES: Modalidad[] = ['venta', 'descuento', 'donacion']
export const ESTADOS: EstadoPublicacion[] = ['disponible', 'reservado', 'entregado']
export const ZONAS = ['Centro', 'Norte', 'Sur', 'Oriente', 'Poniente']

export const ETIQUETA_MODALIDAD: Record<Modalidad, string> = {
  venta: 'Venta',
  descuento: 'Con descuento',
  donacion: 'Donación',
}

export const ETIQUETA_ESTADO: Record<EstadoPublicacion, string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  entregado: 'Entregado',
}

export const ETIQUETA_ESTRATEGIA: Record<EstrategiaDescuento, string> = {
  caducidad: 'Descuento por caducidad',
  disponibilidad: 'Descuento por disponibilidad',
}

export interface Alimento {
  nombre: string
  kilos: number
  fechaCaducidad: string
  cantidadDisponible: number
  descripcion: string
  categoria: CategoriaAlimento
  unidad: UnidadAlimento
  foto: string
}

export interface HorarioRecoleccion {
  fecha: string
  desde: string
  hasta: string
}

export interface Establecimiento {
  id: string
  nombre: string
  tipo: TipoUsuario
  direccion: string
  zona: string
  puntoRecoleccion: string
  telefono: string
}

export interface PublicacionAlimento {
  id: string
  modalidad: Modalidad
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  estadoActual: EstadoPublicacion
  estrategiaDescuento?: EstrategiaDescuento
  precioBase: number
  porcentajeDescuento: number
  establecimiento: Establecimiento
  fechaPublicacion: string
}
