import type { CategoriaAlimento, Modalidad } from './alimento'

export interface RegistroDesperdicioEvitado {
  totalKilosEvitados: number
  totalAlimentosRecuperados: number
  entregasConfirmadas: number
  historialMensual: { mes: string; kilos: number }[]
  porModalidad: Record<Modalidad, number>
  porCategoria: Record<CategoriaAlimento, number>
}
