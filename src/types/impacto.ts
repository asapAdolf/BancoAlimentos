import type { CategoriaAlimento, Modalidad } from './alimento'

// Datos que muestra la pantalla de estadísticas (clase RegistroDesperdicioEvitado del diagrama:
// totalKilosEvitados y totalAlimentosRecuperados). Los demás campos alimentan las gráficas.
export interface RegistroDesperdicioEvitado {
  totalKilosEvitados: number
  totalAlimentosRecuperados: number
  entregasConfirmadas: number
  historialMensual: { mes: string; kilos: number }[]
  porModalidad: Record<Modalidad, number>
  porCategoria: Record<CategoriaAlimento, number>
}
