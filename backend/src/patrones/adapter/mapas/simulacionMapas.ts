// Utilidades para SIMULAR los servicios externos de mapas (no se llama a ninguna API real).
// Convierte una dirección en coordenadas fijas cercanas al centro de Puebla, siempre las mismas
// para la misma dirección, y calcula distancias en línea recta.

const LATITUD_CENTRO = 19.0414
const LONGITUD_CENTRO = -98.2063

export function coordenadasSimuladas(direccion: string): [number, number] {
  let hash = 0
  for (const caracter of direccion.trim().toLowerCase()) {
    hash = (hash * 31 + caracter.charCodeAt(0)) | 0
  }
  const desplazamientoLat = ((hash & 0xffff) / 0xffff - 0.5) * 0.08
  const desplazamientoLng = (((hash >>> 16) & 0xffff) / 0xffff - 0.5) * 0.08
  return [
    Number((LATITUD_CENTRO + desplazamientoLat).toFixed(6)),
    Number((LONGITUD_CENTRO + desplazamientoLng).toFixed(6)),
  ]
}

// Distancia en kilómetros entre dos coordenadas (fórmula de Haversine).
export function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radioTierra = 6371
  const aRadianes = (grados: number) => (grados * Math.PI) / 180
  const dLat = aRadianes(lat2 - lat1)
  const dLng = aRadianes(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * radioTierra * Math.asin(Math.sqrt(a))
}
