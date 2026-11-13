import { bd } from '../datos/BaseDatosMemoria.js'
import { fotoPorCategoria } from '../datos/fotos.js'
import {
  AccesoDenegadoException,
  IllegalArgumentException,
  IllegalStateException,
  NoEncontradoException,
} from '../errores/Excepciones.js'
import type { Establecimiento } from '../modelos/Establecimiento.js'
import type { Reservacion } from '../modelos/Reservacion.js'
import type { CategoriaAlimento, EstadoPublicacion, Modalidad } from '../modelos/tipos.js'
import { esEstablecimiento, type Usuario } from '../modelos/Usuario.js'
import type { PublicacionAlimento } from '../patrones/factory/PublicacionAlimento.js'
import { PublicacionDescuento } from '../patrones/factory/PublicacionDescuento.js'
import { PublicacionFactory } from '../patrones/factory/PublicacionFactory.js'
import { fechaEnDias } from '../utils/fechas.js'
import { generarCodigoReservacion, generarId } from '../utils/ids.js'
import type { CambiosPublicacion, NuevaPublicacion } from '../validaciones/validaciones.js'
import { NotificacionServicio } from './NotificacionServicio.js'

// Filtros del catálogo (mismos que "Filtros" del Front-End).
export interface FiltrosCatalogo {
  busqueda?: string
  categoria?: CategoriaAlimento | 'todas'
  modalidad?: Modalidad | 'todas'
  precioMax?: number
  zona?: string
  disponibilidad?: EstadoPublicacion | 'todas'
  orden?: 'recientes' | 'caducidad' | 'precio'
  establecimientoId?: string
}

// Lógica de negocio de las publicaciones: publicar (con Factory Method), reservar,
// confirmar entrega, editar y cancelar. Los avisos salen con el Adapter de notificaciones.
export class PublicacionServicio {
  static listar(filtros: FiltrosCatalogo = {}): PublicacionAlimento[] {
    const busqueda = filtros.busqueda?.trim().toLowerCase() ?? ''
    const resultado = bd.publicaciones.filter((p) => {
      if (busqueda) {
        const enTexto = `${p.alimento.nombre} ${p.alimento.descripcion} ${p.establecimiento.nombre}`.toLowerCase()
        if (!enTexto.includes(busqueda)) return false
      }
      if (filtros.categoria && filtros.categoria !== 'todas' && p.alimento.categoria !== filtros.categoria) return false
      if (filtros.modalidad && filtros.modalidad !== 'todas' && p.getModalidad() !== filtros.modalidad) return false
      if (filtros.precioMax !== undefined && p.calcularPrecioFinal() > filtros.precioMax) return false
      if (filtros.zona && filtros.zona !== 'todas' && p.establecimiento.zona !== filtros.zona) return false
      if (filtros.disponibilidad && filtros.disponibilidad !== 'todas' && p.estadoActual !== filtros.disponibilidad)
        return false
      if (filtros.establecimientoId && p.establecimiento.id !== filtros.establecimientoId) return false
      return true
    })

    switch (filtros.orden) {
      case 'caducidad':
        return resultado.sort((a, b) => a.alimento.fechaCaducidad.localeCompare(b.alimento.fechaCaducidad))
      case 'precio':
        return resultado.sort((a, b) => a.calcularPrecioFinal() - b.calcularPrecioFinal())
      default:
        return resultado.sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion))
    }
  }

  static obtener(id: string): PublicacionAlimento {
    const publicacion = bd.publicaciones.find((p) => p.id === id)
    if (!publicacion) throw new NoEncontradoException('Publicación no encontrada.')
    return publicacion
  }

  // Publicaciones del establecimiento del usuario (pantalla "Mis publicaciones").
  static listarDelUsuario(usuario: Usuario): PublicacionAlimento[] {
    const establecimiento = PublicacionServicio.establecimientoDe(usuario)
    return PublicacionServicio.listar({ establecimientoId: establecimiento.id })
  }

  // PATRÓN FACTORY METHOD en acción: el servicio no sabe qué clase concreta se crea,
  // solo le pasa la modalidad a la fábrica y recibe una PublicacionAlimento.
  static verificarPuedePublicar(usuario: Usuario): void {
    if (!esEstablecimiento(usuario.tipo)) {
      throw new AccesoDenegadoException('Solo los establecimientos pueden publicar alimentos.')
    }
  }

  static publicar(datos: NuevaPublicacion, usuario: Usuario): PublicacionAlimento {
    PublicacionServicio.verificarPuedePublicar(usuario)
    if (datos.horario.fecha < fechaEnDias(0)) {
      throw new IllegalArgumentException('La fecha de recolección no puede ser anterior a hoy.')
    }

    const publicacion = PublicacionFactory.crearPublicacion(datos.modalidad, {
      id: generarId('p'),
      precioBase: datos.precioBase,
      porcentajeDescuento: datos.porcentaje,
      estrategiaDescuento: datos.estrategia,
      establecimiento: PublicacionServicio.establecimientoDe(usuario),
      horarioRecoleccion: datos.horario,
      alimento: {
        nombre: datos.nombre,
        descripcion: datos.descripcion || 'Sin descripción.',
        categoria: datos.categoria,
        unidad: datos.unidad,
        cantidadDisponible: datos.cantidad,
        kilos: datos.kilos,
        fechaCaducidad: datos.fechaCaducidad,
        foto: datos.foto || fotoPorCategoria(datos.categoria),
      },
    })
    bd.publicaciones.unshift(publicacion)
    publicacion.mostrarPublicacion()

    const nombreEst = publicacion.establecimiento.nombre
    if (publicacion instanceof PublicacionDescuento) {
      NotificacionServicio.notificarInteresados(
        'descuento',
        'Nueva publicación con descuento',
        `${nombreEst} publicó "${publicacion.alimento.nombre}" con ${publicacion.porcentajeDescuento}% de descuento.`,
        publicacion.id,
      )
    } else {
      NotificacionServicio.notificarInteresados(
        'nuevo',
        'Nuevo alimento disponible',
        `${nombreEst} publicó "${publicacion.alimento.nombre}".`,
        publicacion.id,
      )
    }
    return publicacion
  }

  static editar(id: string, cambios: CambiosPublicacion, usuario: Usuario): PublicacionAlimento {
    const publicacion = PublicacionServicio.obtener(id)
    PublicacionServicio.verificarDueno(publicacion, usuario)
    if (publicacion.estadoActual !== 'disponible') {
      throw new IllegalStateException('Solo se pueden editar publicaciones disponibles.')
    }
    const modalidad = publicacion.getModalidad()
    if (cambios.precioBase !== undefined && modalidad !== 'donacion' && cambios.precioBase <= 0) {
      throw new IllegalArgumentException('El precio debe ser mayor a 0.')
    }
    if (cambios.porcentaje !== undefined && publicacion instanceof PublicacionDescuento) {
      PublicacionDescuento.validarPorcentaje(cambios.porcentaje)
    }

    if (cambios.nombre !== undefined) publicacion.alimento.nombre = cambios.nombre
    if (cambios.descripcion !== undefined) publicacion.alimento.descripcion = cambios.descripcion
    if (cambios.cantidad !== undefined) publicacion.alimento.cantidadDisponible = cambios.cantidad
    if (cambios.precioBase !== undefined && modalidad !== 'donacion') publicacion.precioBase = cambios.precioBase
    if (cambios.porcentaje !== undefined && publicacion instanceof PublicacionDescuento) {
      publicacion.porcentajeDescuento = cambios.porcentaje
    }
    return publicacion
  }

  static cancelar(id: string, usuario: Usuario): PublicacionAlimento {
    const publicacion = PublicacionServicio.obtener(id)
    PublicacionServicio.verificarDueno(publicacion, usuario)
    if (publicacion.estadoActual !== 'disponible') {
      throw new IllegalStateException('Solo se pueden cancelar publicaciones disponibles.')
    }
    bd.publicaciones = bd.publicaciones.filter((p) => p.id !== id)
    return publicacion
  }

  static reservar(id: string, usuario: Usuario): Reservacion {
    if (esEstablecimiento(usuario.tipo)) {
      throw new AccesoDenegadoException('Solo personas y organizaciones pueden reservar alimentos.')
    }
    const publicacion = PublicacionServicio.obtener(id)
    if (publicacion.estadoActual !== 'disponible') {
      throw new IllegalStateException('Esta publicación ya no está disponible.')
    }

    const reservacion: Reservacion = {
      id: generarId('r'),
      publicacionId: id,
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      cantidad: publicacion.alimento.cantidadDisponible,
      precioTotal: publicacion.calcularPrecioFinal(),
      fecha: fechaEnDias(0),
      codigo: generarCodigoReservacion(),
    }
    bd.reservaciones.unshift(reservacion)
    publicacion.estadoActual = 'reservado'

    const { nombre } = publicacion.alimento
    NotificacionServicio.notificarUsuario(
      usuario,
      'reservado',
      'Alimento reservado',
      `Reservaste "${nombre}". Tu código es ${reservacion.codigo}.`,
      id,
    )
    NotificacionServicio.notificarUsuario(
      usuario,
      'listo',
      'Alimento listo para recoger',
      `Pasa por "${nombre}" a ${publicacion.establecimiento.nombre} el ${publicacion.horarioRecoleccion.fecha} ` +
        `de ${publicacion.horarioRecoleccion.desde} a ${publicacion.horarioRecoleccion.hasta}.`,
      id,
    )
    const dueno = PublicacionServicio.duenoDe(publicacion)
    if (dueno) {
      NotificacionServicio.notificarUsuario(
        dueno,
        'reservado',
        'Nueva reservación',
        `${usuario.nombre} reservó "${nombre}" (código ${reservacion.codigo}).`,
        id,
      )
    }
    return reservacion
  }

  static confirmarEntrega(id: string, usuario: Usuario): PublicacionAlimento {
    const publicacion = PublicacionServicio.obtener(id)
    PublicacionServicio.verificarDueno(publicacion, usuario)
    if (publicacion.estadoActual !== 'reservado') {
      throw new IllegalStateException('Solo se puede confirmar la entrega de una publicación reservada.')
    }
    publicacion.estadoActual = 'entregado'
    bd.registro.registrarRecuperacion(publicacion)

    const reservacion = bd.reservaciones.find((r) => r.publicacionId === id)
    const receptor = reservacion && bd.usuarios.find((u) => u.id === reservacion.usuarioId)
    if (receptor) {
      NotificacionServicio.notificarUsuario(
        receptor,
        'entrega',
        'Entrega confirmada',
        `Se confirmó la entrega de "${publicacion.alimento.nombre}". Sumaste ${publicacion.alimento.kilos} kg rescatados.`,
        id,
      )
    }
    return publicacion
  }

  // Reservaciones hechas por el usuario, o recibidas si es un establecimiento.
  static listarReservaciones(usuario: Usuario): Reservacion[] {
    if (!esEstablecimiento(usuario.tipo)) {
      return bd.reservaciones.filter((r) => r.usuarioId === usuario.id)
    }
    const misIds = new Set(PublicacionServicio.listarDelUsuario(usuario).map((p) => p.id))
    return bd.reservaciones.filter((r) => misIds.has(r.publicacionId))
  }

  // Busca el establecimiento del usuario; si no existe, lo da de alta.
  static establecimientoDe(usuario: Usuario): Establecimiento {
    const nombre = (usuario.nombreEstablecimiento || usuario.nombre).trim()
    let establecimiento =
      bd.establecimientos.find((e) => e.usuarioId === usuario.id) ??
      bd.establecimientos.find((e) => !e.usuarioId && e.nombre.toLowerCase() === nombre.toLowerCase())
    if (establecimiento) {
      establecimiento.usuarioId = usuario.id
      return establecimiento
    }
    establecimiento = {
      id: generarId('est'),
      nombre,
      tipo: usuario.tipo,
      direccion: 'Dirección por registrar',
      zona: 'Centro',
      puntoRecoleccion: 'Entrada principal',
      telefono: usuario.telefono || 'Sin teléfono',
      usuarioId: usuario.id,
    }
    bd.establecimientos.push(establecimiento)
    return establecimiento
  }

  private static duenoDe(publicacion: PublicacionAlimento): Usuario | undefined {
    const usuarioId = publicacion.establecimiento.usuarioId
    return usuarioId ? bd.usuarios.find((u) => u.id === usuarioId) : undefined
  }

  private static verificarDueno(publicacion: PublicacionAlimento, usuario: Usuario): void {
    if (publicacion.establecimiento.usuarioId !== usuario.id) {
      throw new AccesoDenegadoException('Esta publicación pertenece a otro establecimiento.')
    }
  }
}
