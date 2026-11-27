import type { Establecimiento } from '../modelos/Establecimiento.js'
import type { RegistroNotificacion } from '../modelos/RegistroNotificacion.js'
import type { Reservacion } from '../modelos/Reservacion.js'
import type { Usuario } from '../modelos/Usuario.js'
import type { PublicacionAlimento } from '../patrones/factory/PublicacionAlimento.js'
import { RegistroDesperdicioEvitado } from '../registro/RegistroDesperdicioEvitado.js'

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
  usuarios: [
    {
      id: 'usr-001',
      nombre: 'Cliente Demo',
      correo: 'cliente@demo.mx',
      telefono: '2221234567',
      tipo: 'persona',
      canalNotificacion: 'email',
    },
    {
      id: 'usr-002',
      nombre: 'Empresa Demo',
      correo: 'empresa@demo.mx',
      telefono: '2225554433',
      tipo: 'panaderia',
      nombreEstablecimiento: 'Panadería La Espiga',
      canalNotificacion: 'sms',
    },
    {
      id: 'usr-003',
      nombre: 'Transportista Demo',
      correo: 'transportista@demo.mx',
      telefono: '2227778899',
      tipo: 'organizacion',
      canalNotificacion: 'whatsapp',
    },
    {
      id: 'usr-004',
      nombre: 'Administrador Demo',
      correo: 'admin@demo.mx',
      telefono: '2220000000',
      tipo: 'persona',
      canalNotificacion: 'email',
    },
  ],
  establecimientos: [],
  publicaciones: [],
  reservaciones: [],
  notificaciones: [],
  mensajesEnviados: [],
  registro: new RegistroDesperdicioEvitado(),
}
