import type { Mapa, Ruta, Ubicacion } from './Mapa.js'
import { OpenStreetMap } from './OpenStreetMap.js'

// PATRÓN ADAPTER — Adaptador de OpenStreetMap.
// Traduce la interfaz Mapa a los métodos buscar() y ruta() del servicio externo.
export class openStreetMapAdapter implements Mapa {
  private openStreetMap: OpenStreetMap = new OpenStreetMap()

  obtenerUbicacion(direccion: string): Ubicacion {
    const resultado = this.openStreetMap.buscar(direccion)
    return { direccion, latitud: resultado.lat, longitud: resultado.lon, proveedor: 'OpenStreetMap' }
  }

  calcularRuta(origen: string, destino: string): Ruta {
    const resultado = this.openStreetMap.ruta(origen, destino)
    return {
      origen: this.obtenerUbicacion(origen),
      destino: this.obtenerUbicacion(destino),
      distanciaKm: Math.round(resultado.distancia * 10) / 10,
      minutosEstimados: Math.round(resultado.duracion),
      proveedor: 'OpenStreetMap',
    }
  }
}
