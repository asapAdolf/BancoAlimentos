import type { Notificacion } from './Notificacion.js'
import { Whatsapp } from './Whatsapp.js'

export class whatsappAdapter implements Notificacion {
  private whatsapp: Whatsapp = new Whatsapp()
  private destinatario: string

  constructor(destinatario: string = '') {
    this.destinatario = destinatario
  }

  enviarMensaje(mensaje: string): void {
    const texto = this.destinatario ? `(para ${this.destinatario}) ${mensaje}` : mensaje
    this.whatsapp.enviarMensaje(texto)
  }
}
