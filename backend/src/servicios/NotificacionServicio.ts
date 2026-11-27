import { bd } from '../datos/BaseDatosMemoria.js'
import { IllegalArgumentException, NoEncontradoException } from '../errores/Excepciones.js'
import type { RegistroNotificacion, TipoNotificacion } from '../modelos/RegistroNotificacion.js'
import type { CanalNotificacion, Usuario } from '../modelos/Usuario.js'
import { emailAdapter } from '../patrones/adapter/notificaciones/emailAdapter.js'
import type { Notificacion } from '../patrones/adapter/notificaciones/Notificacion.js'
import { smsAdapter } from '../patrones/adapter/notificaciones/smsAdapter.js'
import { whatsappAdapter } from '../patrones/adapter/notificaciones/whatsappAdapter.js'
import { generarId } from '../utils/ids.js'

export const CANALES: CanalNotificacion[] = ['sms', 'whatsapp', 'email']

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
