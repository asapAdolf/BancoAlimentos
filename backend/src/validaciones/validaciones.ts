import { IllegalArgumentException } from '../errores/Excepciones.js'
import type { HorarioRecoleccion } from '../modelos/HorarioRecoleccion.js'
import {
  CATEGORIAS,
  ESTRATEGIAS,
  UNIDADES,
  type CategoriaAlimento,
  type EstrategiaDescuento,
  type Modalidad,
  type UnidadAlimento,
} from '../modelos/tipos.js'
import { TIPOS_USUARIO, esEstablecimiento, type CanalNotificacion, type Usuario } from '../modelos/Usuario.js'

// Validaciones de los datos que llegan en el cuerpo de las peticiones.
// Si algo está mal se lanza IllegalArgumentException y la API responde 400 con el mensaje.

// Datos para publicar un alimento (mismos nombres que "NuevaPublicacion" del Front-End).
export interface NuevaPublicacion {
  nombre: string
  descripcion: string
  categoria: CategoriaAlimento
  unidad: UnidadAlimento
  cantidad: number
  kilos: number
  precioBase: number
  fechaCaducidad: string
  horario: HorarioRecoleccion
  modalidad: Modalidad
  estrategia: EstrategiaDescuento
  porcentaje: number
  foto: string
}

export interface CambiosPublicacion {
  nombre?: string
  descripcion?: string
  cantidad?: number
  precioBase?: number
  porcentaje?: number
}

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/
const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CANALES: CanalNotificacion[] = ['sms', 'whatsapp', 'email']

function objeto(valor: unknown): Record<string, unknown> {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    throw new IllegalArgumentException('El cuerpo de la petición debe ser un objeto JSON.')
  }
  return valor as Record<string, unknown>
}

function texto(valor: unknown, campo: string, minimo = 1): string {
  if (typeof valor !== 'string' || valor.trim().length < minimo) {
    throw new IllegalArgumentException(
      minimo > 1 ? `"${campo}" debe tener al menos ${minimo} caracteres.` : `"${campo}" es obligatorio.`,
    )
  }
  return valor.trim()
}

function numero(valor: unknown, campo: string, minimo: number, entero = false): number {
  const n = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor
  if (typeof n !== 'number' || !Number.isFinite(n) || n < minimo || (entero && !Number.isInteger(n))) {
    throw new IllegalArgumentException(
      `"${campo}" debe ser un número${entero ? ' entero' : ''} mayor o igual a ${minimo}.`,
    )
  }
  return n
}

function opcion<T extends string>(valor: unknown, campo: string, opciones: T[]): T {
  if (typeof valor !== 'string' || !opciones.includes(valor as T)) {
    throw new IllegalArgumentException(`"${campo}" debe ser uno de: ${opciones.join(', ')}.`)
  }
  return valor as T
}

function fecha(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || !FORMATO_FECHA.test(valor) || Number.isNaN(Date.parse(valor))) {
    throw new IllegalArgumentException(`"${campo}" debe tener el formato AAAA-MM-DD.`)
  }
  return valor
}

function hora(valor: unknown, campo: string): string {
  if (typeof valor !== 'string' || !FORMATO_HORA.test(valor)) {
    throw new IllegalArgumentException(`"${campo}" debe tener el formato HH:MM.`)
  }
  return valor
}

export function validarNuevaPublicacion(cuerpo: unknown): NuevaPublicacion {
  const d = objeto(cuerpo)
  // La modalidad no se valida aquí: la fábrica (PublicacionFactory) decide si es válida.
  const modalidad = texto(d.modalidad, 'modalidad') as Modalidad
  const h = objeto(d.horario)
  const horario: HorarioRecoleccion = {
    fecha: fecha(h.fecha, 'horario.fecha'),
    desde: hora(h.desde, 'horario.desde'),
    hasta: hora(h.hasta, 'horario.hasta'),
  }
  if (horario.desde >= horario.hasta) {
    throw new IllegalArgumentException('La hora "hasta" debe ser posterior a la hora "desde".')
  }

  return {
    nombre: texto(d.nombre, 'nombre', 3),
    descripcion: typeof d.descripcion === 'string' ? d.descripcion.trim() : '',
    categoria: opcion(d.categoria, 'categoria', CATEGORIAS),
    unidad: opcion(d.unidad, 'unidad', UNIDADES),
    cantidad: numero(d.cantidad, 'cantidad', 1, true),
    kilos: numero(d.kilos, 'kilos', 0.1),
    precioBase: d.precioBase === undefined ? 0 : numero(d.precioBase, 'precioBase', 0),
    fechaCaducidad: fecha(d.fechaCaducidad, 'fechaCaducidad'),
    horario,
    modalidad,
    estrategia: d.estrategia === undefined ? 'caducidad' : opcion(d.estrategia, 'estrategia', ESTRATEGIAS),
    porcentaje: d.porcentaje === undefined ? 0 : numero(d.porcentaje, 'porcentaje', 0),
    foto: typeof d.foto === 'string' ? d.foto.trim() : '',
  }
}

export function validarCambiosPublicacion(cuerpo: unknown): CambiosPublicacion {
  const d = objeto(cuerpo)
  const cambios: CambiosPublicacion = {}
  if (d.nombre !== undefined) cambios.nombre = texto(d.nombre, 'nombre', 3)
  if (d.descripcion !== undefined) cambios.descripcion = typeof d.descripcion === 'string' ? d.descripcion.trim() : ''
  if (d.cantidad !== undefined) cambios.cantidad = numero(d.cantidad, 'cantidad', 1, true)
  if (d.precioBase !== undefined) cambios.precioBase = numero(d.precioBase, 'precioBase', 0)
  if (d.porcentaje !== undefined) cambios.porcentaje = numero(d.porcentaje, 'porcentaje', 0)
  return cambios
}

export function validarNuevoUsuario(cuerpo: unknown): Omit<Usuario, 'id'> {
  const d = objeto(cuerpo)
  const correo = texto(d.correo, 'correo').toLowerCase()
  if (!FORMATO_CORREO.test(correo)) {
    throw new IllegalArgumentException('Escribe un correo válido, por ejemplo nombre@correo.com.')
  }
  const telefono = typeof d.telefono === 'string' ? d.telefono.replace(/\s/g, '') : ''
  if (!/^\d{10}$/.test(telefono)) throw new IllegalArgumentException('Escribe un teléfono de 10 dígitos.')

  const tipo = opcion(d.tipo, 'tipo', TIPOS_USUARIO)
  const nombreEstablecimiento = esEstablecimiento(tipo)
    ? texto(d.nombreEstablecimiento, 'nombreEstablecimiento', 3)
    : undefined

  return {
    nombre: texto(d.nombre, 'nombre', 3),
    correo,
    telefono,
    tipo,
    nombreEstablecimiento,
    canalNotificacion: d.canalNotificacion === undefined ? 'email' : opcion(d.canalNotificacion, 'canalNotificacion', CANALES),
  }
}
