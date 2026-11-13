import type { PublicacionAlimento } from '../patrones/factory/PublicacionAlimento.js'
import { CATEGORIAS, MODALIDADES, type CategoriaAlimento, type Modalidad } from '../modelos/tipos.js'
import { mesActual, mesesRecientes } from '../utils/fechas.js'

export interface DatosRegistro {
  totalKilosEvitados: number
  totalAlimentosRecuperados: number
  entregasConfirmadas: number
  historialMensual: { mes: string; kilos: number }[]
  porModalidad: Record<Modalidad, number>
  porCategoria: Record<CategoriaAlimento, number>
}

// Clase "RegistroDesperdicioEvitado" del diagrama.
// Lleva la cuenta de los kilos y alimentos rescatados cada vez que se confirma una entrega.
export class RegistroDesperdicioEvitado {
  private totalKilosEvitados: number
  private totalAlimentosRecuperados: number
  private entregasConfirmadas: number
  private historialMensual: { mes: string; kilos: number }[]
  private porModalidad: Record<Modalidad, number>
  private porCategoria: Record<CategoriaAlimento, number>

  constructor(inicial?: Partial<DatosRegistro>) {
    this.totalKilosEvitados = inicial?.totalKilosEvitados ?? 0
    this.totalAlimentosRecuperados = inicial?.totalAlimentosRecuperados ?? 0
    this.entregasConfirmadas = inicial?.entregasConfirmadas ?? 0
    this.historialMensual = inicial?.historialMensual ?? mesesRecientes(6).map((mes) => ({ mes, kilos: 0 }))
    this.porModalidad =
      inicial?.porModalidad ?? (Object.fromEntries(MODALIDADES.map((m) => [m, 0])) as Record<Modalidad, number>)
    this.porCategoria =
      inicial?.porCategoria ??
      (Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as Record<CategoriaAlimento, number>)
  }

  // Se llama al confirmar la entrega de una publicación.
  registrarRecuperacion(publicacion: PublicacionAlimento): void {
    const kilos = publicacion.alimento.kilos
    this.totalKilosEvitados = redondear(this.totalKilosEvitados + kilos)
    this.totalAlimentosRecuperados += publicacion.alimento.cantidadDisponible
    this.entregasConfirmadas++

    const mes = mesActual()
    const ultimo = this.historialMensual[this.historialMensual.length - 1]
    if (ultimo && ultimo.mes === mes) {
      ultimo.kilos = redondear(ultimo.kilos + kilos)
    } else {
      this.historialMensual.push({ mes, kilos })
      if (this.historialMensual.length > 6) this.historialMensual.shift()
    }

    const modalidad = publicacion.getModalidad()
    this.porModalidad[modalidad] = redondear(this.porModalidad[modalidad] + kilos)
    const categoria = publicacion.alimento.categoria
    this.porCategoria[categoria] = redondear(this.porCategoria[categoria] + kilos)
  }

  // Resumen para el botón "Generar reporte" de la pantalla de estadísticas.
  generarReporteImpacto(): string {
    const promedio = this.entregasConfirmadas ? this.totalKilosEvitados / this.entregasConfirmadas : 0
    return [
      'REPORTE DE IMPACTO — Rescate Alimentario',
      `Kilos de alimento rescatados: ${this.totalKilosEvitados} kg`,
      `Alimentos recuperados: ${this.totalAlimentosRecuperados}`,
      `Entregas confirmadas: ${this.entregasConfirmadas}`,
      `Promedio por entrega: ${redondear(promedio)} kg`,
      `Por modalidad: venta ${this.porModalidad.venta} kg, descuento ${this.porModalidad.descuento} kg, ` +
        `donación ${this.porModalidad.donacion} kg`,
    ].join('\n')
  }

  toJSON(): DatosRegistro {
    return {
      totalKilosEvitados: this.totalKilosEvitados,
      totalAlimentosRecuperados: this.totalAlimentosRecuperados,
      entregasConfirmadas: this.entregasConfirmadas,
      historialMensual: this.historialMensual.map((m) => ({ ...m })),
      porModalidad: { ...this.porModalidad },
      porCategoria: { ...this.porCategoria },
    }
  }
}

function redondear(valor: number): number {
  return Math.round(valor * 100) / 100
}
