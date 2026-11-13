// PATRÓN ADAPTER — Interfaz objetivo (Target) para los servicios de mapas.
// Funciona igual que "Notificacion" en el código muestra: el sistema solo conoce
// esta interfaz y no le importa si detrás está Google Maps u OpenStreetMap.
export interface Mapa {
  obtenerUbicacion(direccion: string): Ubicacion
  calcularRuta(origen: string, destino: string): Ruta
}

export interface Ubicacion {
  direccion: string
  latitud: number
  longitud: number
  proveedor: string
}

export interface Ruta {
  origen: Ubicacion
  destino: Ubicacion
  distanciaKm: number
  minutosEstimados: number
  proveedor: string
}
