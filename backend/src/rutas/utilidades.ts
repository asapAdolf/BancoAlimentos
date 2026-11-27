import type { NextFunction, Request, Response } from 'express'
import type { Usuario } from '../modelos/Usuario.js'
import { UsuarioServicio } from '../servicios/UsuarioServicio.js'

export function usuarioActual(req: Request): Usuario {
  return UsuarioServicio.obtener(req.header('x-usuario-id'))
}

export function parametro(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : undefined
}

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
