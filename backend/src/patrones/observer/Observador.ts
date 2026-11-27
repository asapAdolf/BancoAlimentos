import type { PublicacionAlimento } from '../factory/PublicacionAlimento.js'

export interface Observador {
  actualizar(mensaje: string, publicacion: PublicacionAlimento): void
}
