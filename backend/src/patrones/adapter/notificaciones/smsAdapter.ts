import type { Notificacion } from './Notificacion.js'
import { SMS } from './SMS.js'

export class smsAdapter implements Notificacion {
  private sms: SMS = new SMS()
  private destinatario: string

  constructor(destinatario: string = '') {
    this.destinatario = destinatario
  }

  enviarMensaje(mensaje: string): void {
    const texto = this.destinatario ? `(para ${this.destinatario}) ${mensaje}` : mensaje
    this.sms.enviarMensaje(texto)
  }
}
