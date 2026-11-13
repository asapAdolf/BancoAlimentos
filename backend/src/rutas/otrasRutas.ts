import { Router } from 'express'
import { bd } from '../datos/BaseDatosMemoria.js'
import { IllegalArgumentException } from '../errores/Excepciones.js'
import { NotificacionServicio } from '../servicios/NotificacionServicio.js'
import { PublicacionServicio } from '../servicios/PublicacionServicio.js'
import { UbicacionServicio } from '../servicios/UbicacionServicio.js'
import { UsuarioServicio } from '../servicios/UsuarioServicio.js'
import { parametro, usuarioActual } from './utilidades.js'

// ---------- Autenticación (demostración) ----------
export const authRutas = Router()

authRutas.post('/login', (req, res) => {
  res.json(UsuarioServicio.iniciarSesion(req.body?.correo))
})

authRutas.post('/registro', (req, res) => {
  res.status(201).json(UsuarioServicio.registrar(req.body))
})

authRutas.get('/yo', (req, res) => {
  res.json(usuarioActual(req))
})

// ---------- Reservaciones ----------
export const reservacionesRutas = Router()

reservacionesRutas.get('/', (req, res) => {
  res.json(PublicacionServicio.listarReservaciones(usuarioActual(req)))
})

// ---------- Notificaciones (patrón Adapter) ----------
export const notificacionesRutas = Router()

notificacionesRutas.get('/', (req, res) => {
  res.json(NotificacionServicio.listar(usuarioActual(req).id))
})

notificacionesRutas.patch('/leidas', (req, res) => {
  res.json({ marcadas: NotificacionServicio.marcarTodasLeidas(usuarioActual(req).id) })
})

notificacionesRutas.patch('/:id/leida', (req, res) => {
  res.json(NotificacionServicio.marcarLeida(req.params.id, usuarioActual(req).id))
})

// POST /api/notificaciones/enviar { canal: "sms" | "whatsapp" | "email", destinatario, mensaje }
// Equivale al menú del Main del código muestra (1. SMS 2. WhatsApp 3. Email).
notificacionesRutas.post('/enviar', (req, res) => {
  const canal = parametro(req.body?.canal)
  const mensaje = parametro(req.body?.mensaje)
  if (!canal || !mensaje) throw new IllegalArgumentException('"canal" y "mensaje" son obligatorios.')
  NotificacionServicio.enviarPorCanal(canal, parametro(req.body?.destinatario) ?? '', mensaje)
  res.status(201).json(bd.mensajesEnviados[0])
})

// Historial de mensajes que salieron por los adaptadores.
notificacionesRutas.get('/enviados', (_req, res) => {
  res.json(bd.mensajesEnviados)
})

// ---------- Ubicación (patrón Adapter de mapas) ----------
export const ubicacionRutas = Router()

// GET /api/ubicacion?direccion=...&proveedor=google|openstreetmap
ubicacionRutas.get('/', (req, res) => {
  res.json(UbicacionServicio.ubicar(parametro(req.query.direccion) ?? '', parametro(req.query.proveedor)))
})

ubicacionRutas.get('/establecimientos', (req, res) => {
  res.json(UbicacionServicio.ubicarEstablecimientos(parametro(req.query.proveedor)))
})

// GET /api/ubicacion/ruta?origen=...&destino=...
ubicacionRutas.get('/ruta', (req, res) => {
  res.json(
    UbicacionServicio.calcularRuta(
      parametro(req.query.origen) ?? '',
      parametro(req.query.destino) ?? '',
      parametro(req.query.proveedor),
    ),
  )
})

// GET /api/ubicacion/publicacion/:id?origen=...
ubicacionRutas.get('/publicacion/:id', (req, res) => {
  res.json(
    UbicacionServicio.rutaHaciaPublicacion(
      req.params.id,
      parametro(req.query.origen) ?? '',
      parametro(req.query.proveedor),
    ),
  )
})

// ---------- Impacto (RegistroDesperdicioEvitado) ----------
export const impactoRutas = Router()

impactoRutas.get('/', (_req, res) => {
  res.json(bd.registro)
})

impactoRutas.get('/reporte', (_req, res) => {
  res.type('text/plain').send(bd.registro.generarReporteImpacto())
})
