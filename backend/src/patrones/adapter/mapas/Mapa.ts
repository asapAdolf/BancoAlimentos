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
