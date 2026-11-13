import { IllegalArgumentException } from '../../errores/Excepciones.js'
import { equalsIgnoreCase } from '../../utils/texto.js'
import type { DatosPublicacion, PublicacionAlimento } from './PublicacionAlimento.js'
import { PublicacionDescuento } from './PublicacionDescuento.js'
import { PublicacionDonacion } from './PublicacionDonacion.js'
import { PublicacionVenta } from './PublicacionVenta.js'

// PATRÓN FACTORY METHOD — Fábrica.
// Misma lógica que "PersonajesFactory" del código muestra:
//
//   public static Personajes crearPersonajes(String tipo) {
//       if (tipo.equalsIgnoreCase("mago")) return new Mago();
//       else if (tipo.equalsIgnoreCase("arquero")) return new Arquero();
//       else if (tipo.equalsIgnoreCase("guerrero")) return new Guerrero();
//       throw new IllegalArgumentException("Tipo de personaje no válido");
//   }
//
// Quien publica solo indica el tipo ("venta", "descuento" o "donacion") y la fábrica
// decide qué clase concreta crear. El resto del sistema trabaja con la interfaz PublicacionAlimento.
export class PublicacionFactory {
  static crearPublicacion(tipo: string, datos: DatosPublicacion): PublicacionAlimento {
    if (equalsIgnoreCase(tipo, 'venta')) {
      return new PublicacionVenta(datos)
    } else if (equalsIgnoreCase(tipo, 'descuento')) {
      return new PublicacionDescuento(datos)
    } else if (equalsIgnoreCase(tipo, 'donacion')) {
      return new PublicacionDonacion(datos)
    }
    throw new IllegalArgumentException('Tipo de publicación no válido')
  }
}
