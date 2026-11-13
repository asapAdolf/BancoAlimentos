import { GoogleMaps } from './GoogleMaps.js'
import type { Mapa, Ruta, Ubicacion } from './Mapa.js'

// PATRÓN ADAPTER — Adaptador de Google Maps.
// Misma estructura que "smsAdapter" del código muestra: guarda una instancia del servicio
// externo y traduce cada llamada de la interfaz Mapa al método equivalente de GoogleMaps.
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
      distanciaKm: Math.round(resultado.distanceMeters / 100) / 10, // metros -> km
      minutosEstimados: Math.round(resultado.durationSeconds / 60), // segundos -> minutos
      proveedor: 'Google Maps',
    }
  }
}
