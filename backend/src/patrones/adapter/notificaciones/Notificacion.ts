// PATRÓN ADAPTER — Interfaz objetivo (Target).
// Igual que en el código muestra:
//
//   public interface Notificacion {
//       public void enviarMensaje(String mensaje);
//   }
//
// El resto del sistema solo conoce esta interfaz; no sabe si el mensaje sale por SMS,
// WhatsApp o correo.
export interface Notificacion {
  enviarMensaje(mensaje: string): void
}
