import type { PublicacionAlimento } from '../factory/PublicacionAlimento.js'
import type { Observador } from './Observador.js'

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
