import type { Notificacion } from './Notificacion.js'
import { Email } from './Email.js'

// PATRÓN ADAPTER — Adaptador de correo electrónico.
// En el código muestra:
//
//   public class emailAdapter implements Notificacion {
//       private Email email = new Email();
//       @Override
//       public void enviarMensaje(String mensaje) {
//           email.enviarMensaje(mensaje);
//       }
//   }
//
// Opcionalmente recibe el destinatario para anteponerlo al mensaje.
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
