import type { Notificacion } from './Notificacion.js'
import { Whatsapp } from './Whatsapp.js'

// PATRÓN ADAPTER — Adaptador de WhatsApp.
// En el código muestra:
//
//   public class whatsappAdapter implements Notificacion {
//       private Whatsapp whatsapp = new Whatsapp();
//       @Override
//       public void enviarMensaje(String mensaje) {
//           whatsapp.enviarMensaje(mensaje);
//       }
//   }
//
// Opcionalmente recibe el destinatario para anteponerlo al mensaje.
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
