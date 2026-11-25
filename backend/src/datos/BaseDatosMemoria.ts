import type { Establecimiento } from '../modelos/Establecimiento.js'
import type { RegistroNotificacion } from '../modelos/RegistroNotificacion.js'
import type { Reservacion } from '../modelos/Reservacion.js'
import type { Usuario } from '../modelos/Usuario.js'
import type { PublicacionAlimento } from '../patrones/factory/PublicacionAlimento.js'
import { RegistroDesperdicioEvitado } from '../registro/RegistroDesperdicioEvitado.js'

// BASE DE DATOS EN MEMORIA (inicia limpia sin registros de demostración).

export interface MensajeEnviado {
  canal: string
  destinatario: string
  mensaje: string
  fecha: string
}

export interface BaseDatos {
  usuarios: Usuario[]
  establecimientos: Establecimiento[]
  publicaciones: PublicacionAlimento[]
  reservaciones: Reservacion[]
  notificaciones: RegistroNotificacion[]
  mensajesEnviados: MensajeEnviado[]
  registro: RegistroDesperdicioEvitado
}

export const bd: BaseDatos = {
  usuarios: [],
  establecimientos: [],
  publicaciones: [],
  reservaciones: [],
  notificaciones: [],
  mensajesEnviados: [],
  registro: new RegistroDesperdicioEvitado(),
}
