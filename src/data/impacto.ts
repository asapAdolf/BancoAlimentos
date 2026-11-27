import type { RegistroDesperdicioEvitado } from '../types/impacto'

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

export const registroInicial: RegistroDesperdicioEvitado = {
  totalKilosEvitados: 0,
  totalAlimentosRecuperados: 0,
  entregasConfirmadas: 0,
  historialMensual: mesesRecientes().map((mes) => ({ mes, kilos: 0 })),
  porModalidad: { venta: 0, descuento: 0, donacion: 0 },
  porCategoria: {
    'Pan y repostería': 0,
    'Frutas y verduras': 0,
    'Comida preparada': 0,
    Lácteos: 0,
    Bebidas: 0,
    Abarrotes: 0,
  },
}
