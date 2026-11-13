// SERVICIO EXTERNO de WhatsApp (Adaptee). Simula la librería o API del proveedor.
// En el código muestra:
//
//   public class Whatsapp {
//       void enviarMensaje(String mensaje) {
//           System.out.println("Enviando Mensaje " + mensaje);
//       }
//   }
export class Whatsapp {
  enviarMensaje(mensaje: string): void {
    console.log('[Whatsapp] Enviando Mensaje ' + mensaje)
  }
}
