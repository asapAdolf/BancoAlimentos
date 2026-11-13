import type { Notificacion } from './Notificacion.js'
import { SMS } from './SMS.js'

// PATRÓN ADAPTER — Adaptador de SMS.
// En el código muestra:
//
//   public class smsAdapter implements Notificacion {
//       private SMS sms = new SMS();
//       @Override
//       public void enviarMensaje(String mensaje) {
//           sms.enviarMensaje(mensaje);
//       }
//   }
//
// Opcionalmente recibe el destinatario para anteponerlo al mensaje.
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
