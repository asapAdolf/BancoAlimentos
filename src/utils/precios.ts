import type { PublicacionAlimento } from '../types/alimento'

// SOLO PARA MOSTRAR en pantalla los datos de ejemplo.
// El cálculo real de precios y descuentos (calcularPrecioFinal y las estrategias de descuento)
// le corresponde al Back-End.

export function precioFinal(pub: PublicacionAlimento): number {
  if (pub.modalidad === 'donacion') return 0
  if (pub.modalidad === 'descuento') {
    return Math.round(pub.precioBase * (1 - pub.porcentajeDescuento / 100) * 100) / 100
  }
  return pub.precioBase
}

export function descuentoAplicado(pub: PublicacionAlimento): number {
  return pub.modalidad === 'descuento' ? pub.porcentajeDescuento : 0
}
