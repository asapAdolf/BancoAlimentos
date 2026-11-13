import { bd } from '../datos/BaseDatosMemoria.js'
import { IllegalArgumentException, IllegalStateException, NoAutorizadoException } from '../errores/Excepciones.js'
import { esEstablecimiento, type Usuario } from '../modelos/Usuario.js'
import { generarId } from '../utils/ids.js'
import { validarNuevoUsuario } from '../validaciones/validaciones.js'

// Inicio de sesión de DEMOSTRACIÓN (igual que en el Front-End): no se verifican contraseñas.
// Las peticiones identifican al usuario con el encabezado "x-usuario-id".
export class UsuarioServicio {
  static iniciarSesion(correo: unknown): Usuario {
    if (typeof correo !== 'string' || !correo.trim()) {
      throw new IllegalArgumentException('El correo es obligatorio.')
    }
    const clave = correo.trim().toLowerCase()
    const existente = bd.usuarios.find((u) => u.correo === clave)
    if (existente) return existente

    // Con un correo desconocido entra como "Persona", como en el Front-End.
    const nuevo: Usuario = {
      id: generarId('usr'),
      nombre: clave.split('@')[0],
      correo: clave,
      telefono: '',
      tipo: 'persona',
      canalNotificacion: 'email',
    }
    bd.usuarios.push(nuevo)
    return nuevo
  }

  static registrar(datos: unknown): Usuario {
    const valido = validarNuevoUsuario(datos)
    if (bd.usuarios.some((u) => u.correo === valido.correo)) {
      throw new IllegalStateException('Ya existe una cuenta con ese correo.')
    }
    const nuevo: Usuario = { ...valido, id: generarId('usr') }
    if (!esEstablecimiento(nuevo.tipo)) delete nuevo.nombreEstablecimiento
    bd.usuarios.push(nuevo)
    return nuevo
  }

  static obtener(id: string | undefined): Usuario {
    const usuario = id ? bd.usuarios.find((u) => u.id === id) : undefined
    if (!usuario) throw new NoAutorizadoException('Usuario no identificado. Inicia sesión de nuevo.')
    return usuario
  }
}
