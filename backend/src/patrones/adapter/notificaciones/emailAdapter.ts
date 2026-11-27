import type { Notificacion } from './Notificacion.js'
import { Email } from './Email.js'

export class emailAdapter implements Notificacion {
  private email: Email = new Email()
  private destinatario: string

  constructor(destinatario: string = '') {
    this.destinatario = destinatario
  }

  enviarMensaje(mensaje: string): void {
    const texto = this.destinatario ? `(para ${this.destinatario}) ${mensaje}` : mensaje
    this.email.enviarMensaje(texto)
  }
}
