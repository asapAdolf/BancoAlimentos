// SERVICIO EXTERNO de correo electrónico (Adaptee). Simula la librería o API del proveedor.
// En el código muestra:
//
//   public class Email {
//       void enviarMensaje(String mensaje) {
//           System.out.println("Enviando Mensaje " + mensaje);
//       }
//   }
export class Email {
  enviarMensaje(mensaje: string): void {
    console.log('[Email] Enviando Mensaje ' + mensaje)
  }
}
