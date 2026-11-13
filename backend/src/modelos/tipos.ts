// Tipos compartidos. Usan los mismos valores que el Front-End (src/types/alimento.ts)
// para que las respuestas de la API se puedan mostrar sin transformarlas.

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
export const ESTRATEGIAS: EstrategiaDescuento[] = ['caducidad', 'disponibilidad']
