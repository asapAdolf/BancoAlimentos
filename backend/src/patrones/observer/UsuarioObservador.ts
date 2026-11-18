import type { Usuario } from '../../modelos/Usuario.js'
import { NotificacionServicio } from '../../servicios/NotificacionServicio.js'
import type { PublicacionAlimento } from '../factory/PublicacionAlimento.js'
import type { Observador } from './Observador.js'

// PATRÓN OBSERVER — Observador concreto.
// En el código muestra:
//
//   class Usuario implements Observador {
//     private nomUsuario: string;
//     constructor(nomUsuario: string) { this.nomUsuario = nomUsuario; }
//     actualizar(mensaje: String) {
//       console.log(`${this.nomUsuario} recibio: ${mensaje}`);
//     }
//   }
//
// Aquí se llama "UsuarioObservador" porque "Usuario" ya es el modelo de la cuenta.
// Cuando recibe el aviso, además de imprimirlo, lo guarda en sus notificaciones y lo envía
// por su canal preferido (SMS, WhatsApp o correo) usando el PATRÓN ADAPTER.
export class UsuarioObservador implements Observador {
  private nomUsuario: string
  private usuario: Usuario

  constructor(usuario: Usuario) {
    this.usuario = usuario
    this.nomUsuario = usuario.nombre
  }

  getUsuario(): Usuario {
    return this.usuario
  }

  actualizar(mensaje: string, publicacion: PublicacionAlimento): void {
    console.log(`${this.nomUsuario} recibio: ${mensaje}`)
    const conDescuento = publicacion.getModalidad() === 'descuento'
    NotificacionServicio.notificarUsuario(
      this.usuario,
      conDescuento ? 'descuento' : 'nuevo',
      conDescuento ? 'Nueva publicación con descuento' : 'Nuevo alimento disponible',
      mensaje,
      publicacion.id,
    )
  }
}
