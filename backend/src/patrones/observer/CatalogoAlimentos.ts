import type { PublicacionAlimento } from '../factory/PublicacionAlimento.js'
import type { Observador } from './Observador.js'

// PATRÓN OBSERVER — Sujeto (el que avisa).
// Cumple el papel de "Influencer" del código muestra:
//
//   class Influencer {
//     private observadores: Observador[] = [];
//     private nomInfluencer: string;
//     agregarObservador(obs: Observador) { this.observadores.push(obs); }
//     eliminarObservador(obs: Observador) { this.observadores = this.observadores.filter(o => o !== obs); }
//     notificar(mensaje: String) { this.observadores.forEach(obs => obs.actualizar(mensaje)) }
//   }
//
// Cada vez que se publica un alimento nuevo, el catálogo notifica a todos sus observadores
// (personas y organizaciones suscritas). El catálogo no sabe cómo se entrega cada aviso.
export class CatalogoAlimentos {
  private observadores: Observador[] = []
  private nomCatalogo: string

  constructor(nomCatalogo: string) {
    this.nomCatalogo = nomCatalogo
  }

  agregarObservador(obs: Observador): void {
    if (!this.observadores.includes(obs)) this.observadores.push(obs)
  }

  eliminarObservador(obs: Observador): void {
    this.observadores = this.observadores.filter((o) => o !== obs)
  }

  notificar(mensaje: string, publicacion: PublicacionAlimento): number {
    console.log(`\n[${this.nomCatalogo}] Avisando a ${this.observadores.length} observador(es): ${mensaje}`)
    this.observadores.forEach((obs) => obs.actualizar(mensaje, publicacion))
    return this.observadores.length
  }

  // Nuevo alimento disponible: arma el mensaje y avisa a todos.
  nuevoAlimento(publicacion: PublicacionAlimento): number {
    const nombreEst = publicacion.establecimiento.nombre
    const mensaje =
      publicacion.getModalidad() === 'descuento'
        ? `${nombreEst} publicó "${publicacion.alimento.nombre}" con ${publicacion.getPorcentajeDescuento()}% de descuento.`
        : `${nombreEst} publicó "${publicacion.alimento.nombre}".`
    return this.notificar(mensaje, publicacion)
  }

  getTotalObservadores(): number {
    return this.observadores.length
  }
}
