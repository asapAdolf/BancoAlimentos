import { GoogleMaps } from './GoogleMaps.js'
import type { Mapa, Ruta, Ubicacion } from './Mapa.js'

export class googleMapsAdapter implements Mapa {
  private googleMaps: GoogleMaps = new GoogleMaps()

  obtenerUbicacion(direccion: string): Ubicacion {
    const resultado = this.googleMaps.geocode(direccion)
    return { direccion, latitud: resultado.lat, longitud: resultado.lng, proveedor: 'Google Maps' }
  }

  calcularRuta(origen: string, destino: string): Ruta {
    const resultado = this.googleMaps.directions(origen, destino)
    return {
      origen: this.obtenerUbicacion(origen),
      destino: this.obtenerUbicacion(destino),
      distanciaKm: Math.round(resultado.distanceMeters / 100) / 10,
      minutosEstimados: Math.round(resultado.durationSeconds / 60),
      proveedor: 'Google Maps',
    }
  }
}
