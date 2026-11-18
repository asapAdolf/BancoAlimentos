import cors from 'cors'
import express from 'express'
import {
  authRutas,
  impactoRutas,
  notificacionesRutas,
  reservacionesRutas,
  suscripcionRutas,
  ubicacionRutas,
} from './rutas/otrasRutas.js'
import { publicacionesRutas } from './rutas/publicacionesRutas.js'
import { manejarErrores } from './rutas/utilidades.js'
import { SuscripcionServicio } from './servicios/SuscripcionServicio.js'

export function crearApp() {
  // PATRÓN OBSERVER: los usuarios de ejemplo quedan suscritos a los avisos de nuevos alimentos.
  SuscripcionServicio.inicializar()

  const app = express()
  app.use(cors({ origin: process.env.ORIGEN_FRONTEND ?? 'http://localhost:5173' }))
  app.use(express.json())

  app.get('/api/salud', (_req, res) => {
    res.json({ estado: 'ok', servicio: 'rescate-alimentario-backend' })
  })

  app.use('/api/auth', authRutas)
  app.use('/api/publicaciones', publicacionesRutas)
  app.use('/api/reservaciones', reservacionesRutas)
  app.use('/api/notificaciones', notificacionesRutas)
  app.use('/api/suscripcion', suscripcionRutas)
  app.use('/api/ubicacion', ubicacionRutas)
  app.use('/api/impacto', impactoRutas)

  app.use((_req, res) => {
    res.status(404).json({ error: 'NoEncontrado', mensaje: 'Ruta no encontrada.' })
  })
  app.use(manejarErrores)
  return app
}
