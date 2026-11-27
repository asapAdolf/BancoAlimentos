import { IllegalArgumentException } from '../../errores/Excepciones.js'
import { equalsIgnoreCase } from '../../utils/texto.js'
import type { DatosPublicacion, PublicacionAlimento } from './PublicacionAlimento.js'
import { PublicacionDescuento } from './PublicacionDescuento.js'
import { PublicacionDonacion } from './PublicacionDonacion.js'
import { PublicacionVenta } from './PublicacionVenta.js'
import { PublicacionSubasta } from './PublicacionSubasta.js'

export class PublicacionFactory {
  static crearPublicacion(tipo: string, datos: DatosPublicacion): PublicacionAlimento {
    if (equalsIgnoreCase(tipo, 'venta')) {
      return new PublicacionVenta(datos)
    } else if (equalsIgnoreCase(tipo, 'descuento')) {
      return new PublicacionDescuento(datos)
    } else if (equalsIgnoreCase(tipo, 'donacion')) {
      return new PublicacionDonacion(datos)
    } else if (equalsIgnoreCase(tipo, 'subasta')) {
      return new PublicacionSubasta(datos)
    }
    throw new IllegalArgumentException('Tipo de publicación no válido')
  }
}
