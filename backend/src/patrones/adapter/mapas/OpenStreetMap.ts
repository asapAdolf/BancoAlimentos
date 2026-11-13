import { coordenadasSimuladas, distanciaKm } from './simulacionMapas.js'

// SERVICIO EXTERNO (Adaptee): simula la API de OpenStreetMap (Nominatim / OSRM).
// También tiene su propio "idioma": devuelve { lat, lon } y la ruta en km y minutos.
export class OpenStreetMap {
  buscar(consulta: string): { lat: number; lon: number } {
    const [lat, lon] = coordenadasSimuladas(consulta)
    console.log(`[OpenStreetMap] buscar("${consulta}")`)
    return { lat, lon }
  }

  ruta(desde: string, hasta: string): { distancia: number; duracion: number } {
    const a = this.buscar(desde)
    const b = this.buscar(hasta)
    const km = distanciaKm(a.lat, a.lon, b.lat, b.lon) * 1.3 // factor de calles
    console.log(`[OpenStreetMap] ruta("${desde}" -> "${hasta}")`)
    return { distancia: km, duracion: (km / 30) * 60 } // ~30 km/h
  }
}
