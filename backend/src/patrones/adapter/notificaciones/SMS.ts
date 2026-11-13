// SERVICIO EXTERNO de SMS (Adaptee). Simula la librería o API del proveedor.
// En el código muestra:
//
//   public class SMS {
//       void enviarMensaje(String mensaje) {
//           System.out.println("Enviando Mensaje " + mensaje);
//       }
//   }
export class SMS {
  enviarMensaje(mensaje: string): void {
    console.log('[SMS] Enviando Mensaje ' + mensaje)
  }
}
