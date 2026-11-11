import type { RegistroDesperdicioEvitado } from '../types/impacto'

// DATOS DE DEMOSTRACIÓN. Más adelante los entregará el registro de desperdicio evitado del Back-End.

// Nombres de los últimos 6 meses (el último es el mes actual).
function mesesRecientes(): string[] {
  const salida: string[] = []
  const ahora = new Date()
  for (let i = 5; i >= 0; i--) {
    const f = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
    const mes = f.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '')
    salida.push(mes.charAt(0).toUpperCase() + mes.slice(1))
  }
  return salida
}

const kilosPorMes = [1480, 1720, 1960, 2210, 2480, 2630]

export const registroInicial: RegistroDesperdicioEvitado = {
  totalKilosEvitados: 12480,
  totalAlimentosRecuperados: 3860,
  entregasConfirmadas: 1204,
  historialMensual: mesesRecientes().map((mes, i) => ({ mes, kilos: kilosPorMes[i] })),
  porModalidad: { venta: 3740, descuento: 5990, donacion: 2750 },
  porCategoria: {
    'Pan y repostería': 3370,
    'Frutas y verduras': 3120,
    'Comida preparada': 2870,
    Lácteos: 1250,
    Bebidas: 870,
    Abarrotes: 1000,
  },
}
