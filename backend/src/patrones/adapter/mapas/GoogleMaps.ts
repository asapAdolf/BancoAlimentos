import { coordenadasSimuladas, distanciaKm } from './simulacionMapas.js'

// SERVICIO EXTERNO (Adaptee): simula el SDK de Google Maps.
// Su "idioma" es distinto al de nuestra interfaz Mapa: usa nombres en inglés,
// devuelve { lat, lng } y la ruta en metros y segundos. Por eso necesita un adaptador.
export class GoogleMaps {
  geocode(address: string): { lat: number; lng: number } {
    const [lat, lng] = coordenadasSimuladas(address)
    console.log(`[GoogleMaps] geocode("${address}")`)
    return { lat, lng }
  }

  directions(origin: string, destination: string): { distanceMeters: number; durationSeconds: number } {
    const a = this.geocode(origin)
    const b = this.geocode(destination)
    const metros = Math.round(distanciaKm(a.lat, a.lng, b.lat, b.lng) * 1000 * 1.3) // factor de calles
    console.log(`[GoogleMaps] directions("${origin}" -> "${destination}")`)
    return { distanceMeters: metros, durationSeconds: Math.round(metros / 8.3) } // ~30 km/h
  }
}
