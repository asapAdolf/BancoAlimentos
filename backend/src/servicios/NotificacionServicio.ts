import { bd } from '../datos/BaseDatosMemoria.js'
import { IllegalArgumentException, NoEncontradoException } from '../errores/Excepciones.js'
import type { RegistroNotificacion, TipoNotificacion } from '../modelos/RegistroNotificacion.js'
import { esEstablecimiento, type CanalNotificacion, type Usuario } from '../modelos/Usuario.js'
import { emailAdapter } from '../patrones/adapter/notificaciones/emailAdapter.js'
import type { Notificacion } from '../patrones/adapter/notificaciones/Notificacion.js'
import { smsAdapter } from '../patrones/adapter/notificaciones/smsAdapter.js'
import { whatsappAdapter } from '../patrones/adapter/notificaciones/whatsappAdapter.js'
import { generarId } from '../utils/ids.js'

export const CANALES: CanalNotificacion[] = ['sms', 'whatsapp', 'email']

// Servicio que usa el PATRÓN ADAPTER para enviar avisos.
// Elige el adaptador con un switch, igual que el menú del Main del código muestra:
//
//   case 1: Notificacion sms = new smsAdapter();            sms.enviarMensaje(mensaje);
//   case 2: Notificacion Whatsapp = new whatsappAdapter();  Whatsapp.enviarMensaje(mensaje);
//   case 3: Notificacion email = new emailAdapter();        email.enviarMensaje(mensaje);
export class NotificacionServicio {
  static crearNotificacion(canal: string, destinatario: string = ''): Notificacion {
    switch (canal.trim().toLowerCase()) {
      case 'sms': {
        const sms: Notificacion = new smsAdapter(destinatario)
        return sms
      }
      case 'whatsapp': {
        const Whatsapp: Notificacion = new whatsappAdapter(destinatario)
        return Whatsapp
      }
      case 'email': {
        const email: Notificacion = new emailAdapter(destinatario)
        return email
      }
      default:
        throw new IllegalArgumentException('Canal de notificación no válido')
    }
  }

  // Envía un mensaje por el canal indicado y deja constancia del envío.
  static enviarPorCanal(canal: string, destinatario: string, mensaje: string): void {
    const notificacion: Notificacion = NotificacionServicio.crearNotificacion(canal, destinatario)
    notificacion.enviarMensaje(mensaje)
    bd.mensajesEnviados.unshift({
      canal: canal.toLowerCase(),
      destinatario,
      mensaje,
      fecha: new Date().toISOString(),
    })
  }

  // Guarda el aviso para la pantalla de Notificaciones y lo envía por el canal preferido del usuario.
  static notificarUsuario(
    usuario: Usuario,
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    publicacionId?: string,
  ): RegistroNotificacion {
    const registro: RegistroNotificacion = {
      id: generarId('n'),
      usuarioId: usuario.id,
      tipo,
      titulo,
      mensaje,
      fecha: new Date().toISOString(),
      leida: false,
      publicacionId,
    }
    bd.notificaciones.unshift(registro)

    const canal = usuario.canalNotificacion ?? 'email'
    const destinatario = canal === 'email' ? usuario.correo : usuario.telefono
    NotificacionServicio.enviarPorCanal(canal, destinatario, `${titulo}: ${mensaje}`)
    return registro
  }

  // Avisa a todas las personas y organizaciones (por ejemplo, cuando hay una nueva publicación).
  static notificarInteresados(
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    publicacionId?: string,
  ): number {
    const interesados = bd.usuarios.filter((u) => !esEstablecimiento(u.tipo))
    for (const usuario of interesados) {
      NotificacionServicio.notificarUsuario(usuario, tipo, titulo, mensaje, publicacionId)
    }
    return interesados.length
  }

  static listar(usuarioId: string): RegistroNotificacion[] {
    return bd.notificaciones.filter((n) => n.usuarioId === usuarioId)
  }

  static marcarLeida(id: string, usuarioId: string): RegistroNotificacion {
    const notificacion = bd.notificaciones.find((n) => n.id === id && n.usuarioId === usuarioId)
    if (!notificacion) throw new NoEncontradoException('Notificación no encontrada.')
    notificacion.leida = true
    return notificacion
  }

  static marcarTodasLeidas(usuarioId: string): number {
    let total = 0
    for (const n of bd.notificaciones) {
      if (n.usuarioId === usuarioId && !n.leida) {
        n.leida = true
        total++
      }
    }
    return total
  }
}
