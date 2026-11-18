import type { PublicacionAlimento } from '../factory/PublicacionAlimento.js'

// PATRÓN OBSERVER — Interfaz del observador.
// Igual que en el código muestra:
//
//   interface Observador {
//     actualizar(mensaje: String): void;
//   }
//
// Además del mensaje se recibe la publicación, para poder ligar el aviso con el alimento.
export interface Observador {
  actualizar(mensaje: string, publicacion: PublicacionAlimento): void
}
