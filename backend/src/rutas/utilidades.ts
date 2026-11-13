import type { NextFunction, Request, Response } from 'express'
import type { Usuario } from '../modelos/Usuario.js'
import { UsuarioServicio } from '../servicios/UsuarioServicio.js'

// Usuario que hace la petición (encabezado "x-usuario-id" que devuelve /api/auth/login).
export function usuarioActual(req: Request): Usuario {
  return UsuarioServicio.obtener(req.header('x-usuario-id'))
}

// Lee un parámetro de la URL o de la consulta como texto.
export function parametro(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : undefined
}

// Convierte las excepciones en respuestas JSON con su código HTTP.
export function manejarErrores(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof Error && 'codigoHttp' in error) {
    res.status(Number(error.codigoHttp)).json({ error: error.name, mensaje: error.message })
    return
  }
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'SyntaxError', mensaje: 'El cuerpo de la petición no es un JSON válido.' })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'ErrorInterno', mensaje: 'Ocurrió un error inesperado en el servidor.' })
}
