import { bd } from '../datos/BaseDatosMemoria.js'
import { IllegalArgumentException } from '../errores/Excepciones.js'
import type { Mapa, Ruta, Ubicacion } from '../patrones/adapter/mapas/Mapa.js'
import { googleMapsAdapter } from '../patrones/adapter/mapas/googleMapsAdapter.js'
import { openStreetMapAdapter } from '../patrones/adapter/mapas/openStreetMapAdapter.js'
import { PublicacionServicio } from './PublicacionServicio.js'

// Servicio que usa el PATRÓN ADAPTER para los mapas.
// El proveedor se elige con la variable de entorno PROVEEDOR_MAPAS ("google" u "openstreetmap").
// Cambiar de proveedor no obliga a tocar el resto del código: todo trabaja con la interfaz Mapa.
export class UbicacionServicio {
  static crearMapa(proveedor: string = process.env.PROVEEDOR_MAPAS ?? 'google'): Mapa {
    switch (proveedor.trim().toLowerCase()) {
      case 'google': {
        const google: Mapa = new googleMapsAdapter()
        return google
      }
      case 'openstreetmap': {
        const openStreetMap: Mapa = new openStreetMapAdapter()
        return openStreetMap
      }
      default:
        throw new IllegalArgumentException('Proveedor de mapas no válido')
    }
  }

  static ubicar(direccion: string, proveedor?: string): Ubicacion {
    if (!direccion?.trim()) throw new IllegalArgumentException('La dirección es obligatoria.')
    return UbicacionServicio.crearMapa(proveedor).obtenerUbicacion(direccion)
  }

  static calcularRuta(origen: string, destino: string, proveedor?: string): Ruta {
    if (!origen?.trim() || !destino?.trim()) {
      throw new IllegalArgumentException('El origen y el destino son obligatorios.')
    }
    return UbicacionServicio.crearMapa(proveedor).calcularRuta(origen, destino)
  }

  // Ubicación de todos los establecimientos, para dibujar el mapa.
  static ubicarEstablecimientos(proveedor?: string) {
    const mapa = UbicacionServicio.crearMapa(proveedor)
    return bd.establecimientos.map((establecimiento) => ({
      establecimiento,
      ubicacion: mapa.obtenerUbicacion(establecimiento.direccion),
    }))
  }

  // Ruta desde la dirección del usuario hasta el punto de recolección de una publicación.
  static rutaHaciaPublicacion(publicacionId: string, origen: string, proveedor?: string) {
    const publicacion = PublicacionServicio.obtener(publicacionId)
    return {
      puntoRecoleccion: publicacion.establecimiento.puntoRecoleccion,
      horarioRecoleccion: publicacion.horarioRecoleccion,
      ruta: UbicacionServicio.calcularRuta(origen, publicacion.establecimiento.direccion, proveedor),
    }
  }
}
