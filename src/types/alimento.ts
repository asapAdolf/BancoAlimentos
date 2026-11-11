import type { TipoUsuario } from './usuario'

// TIPOS SOLO PARA LA VISTA. Reflejan los datos que muestran las pantallas;
// no implementan las clases del diagrama (eso le toca al Back-End).

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

// Clase "Alimento" del diagrama: nombre, kilos, fechaCaducidad, cantidadDisponible.
// Los demás campos (descripción, categoría, unidad, foto) son solo para mostrar en pantalla.
export interface Alimento {
  nombre: string
  kilos: number
  fechaCaducidad: string // formato AAAA-MM-DD
  cantidadDisponible: number
  descripcion: string
  categoria: CategoriaAlimento
  unidad: UnidadAlimento
  foto: string
}

// El diagrama menciona HorarioRecoleccion como parámetro, pero no define su clase.
export interface HorarioRecoleccion {
  fecha: string // AAAA-MM-DD
  desde: string // HH:MM
  hasta: string // HH:MM
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

// Representa a PublicacionAlimento (y sus tipos Venta / Descuento / Donación)
// mediante el campo "modalidad".
export interface PublicacionAlimento {
  id: string
  modalidad: Modalidad
  alimento: Alimento
  horarioRecoleccion: HorarioRecoleccion
  estadoActual: EstadoPublicacion
  estrategiaDescuento?: EstrategiaDescuento
  precioBase: number // precio del lote completo
  porcentajeDescuento: number
  establecimiento: Establecimiento
  fechaPublicacion: string // fecha y hora ISO
}
