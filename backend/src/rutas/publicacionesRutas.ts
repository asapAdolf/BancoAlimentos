import { Router } from 'express'
import { PublicacionServicio, type FiltrosCatalogo } from '../servicios/PublicacionServicio.js'
import { validarCambiosPublicacion, validarNuevaPublicacion } from '../validaciones/validaciones.js'
import { parametro, usuarioActual } from './utilidades.js'

export const publicacionesRutas = Router()

// GET /api/publicaciones?busqueda=&categoria=&modalidad=&precioMax=&zona=&disponibilidad=&orden=
publicacionesRutas.get('/', (req, res) => {
  const precioMax = parametro(req.query.precioMax)
  const filtros: FiltrosCatalogo = {
    busqueda: parametro(req.query.busqueda),
    categoria: parametro(req.query.categoria) as FiltrosCatalogo['categoria'],
    modalidad: parametro(req.query.modalidad) as FiltrosCatalogo['modalidad'],
    precioMax: precioMax !== undefined && Number.isFinite(Number(precioMax)) ? Number(precioMax) : undefined,
    zona: parametro(req.query.zona),
    disponibilidad: parametro(req.query.disponibilidad) as FiltrosCatalogo['disponibilidad'],
    orden: parametro(req.query.orden) as FiltrosCatalogo['orden'],
  }
  res.json(PublicacionServicio.listar(filtros))
})

// GET /api/publicaciones/mias — publicaciones del establecimiento que inició sesión
publicacionesRutas.get('/mias', (req, res) => {
  res.json(PublicacionServicio.listarDelUsuario(usuarioActual(req)))
})

publicacionesRutas.get('/:id', (req, res) => {
  res.json(PublicacionServicio.obtener(req.params.id))
})

// POST /api/publicaciones — usa PublicacionFactory según "modalidad"
publicacionesRutas.post('/', (req, res) => {
  const usuario = usuarioActual(req)
  PublicacionServicio.verificarPuedePublicar(usuario)
  const datos = validarNuevaPublicacion(req.body)
  res.status(201).json(PublicacionServicio.publicar(datos, usuario))
})

publicacionesRutas.patch('/:id', (req, res) => {
  const usuario = usuarioActual(req)
  const cambios = validarCambiosPublicacion(req.body)
  res.json(PublicacionServicio.editar(req.params.id, cambios, usuario))
})

publicacionesRutas.delete('/:id', (req, res) => {
  res.json(PublicacionServicio.cancelar(req.params.id, usuarioActual(req)))
})

publicacionesRutas.post('/:id/reservar', (req, res) => {
  res.status(201).json(PublicacionServicio.reservar(req.params.id, usuarioActual(req)))
})

publicacionesRutas.post('/:id/confirmar-entrega', (req, res) => {
  res.json(PublicacionServicio.confirmarEntrega(req.params.id, usuarioActual(req)))
})
