import type { Establecimiento } from '../types/alimento'
import type { Usuario } from '../types/usuario'

export const establecimientosIniciales: Establecimiento[] = []

export function nombreDeEstablecimiento(usuario: Usuario): string {
  return (usuario.nombreEstablecimiento || usuario.nombre).trim()
}

export function resolverEstablecimiento(usuario: Usuario): Establecimiento {
  const nombre = nombreDeEstablecimiento(usuario)
  const existente = establecimientosIniciales.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase())
  if (existente) return existente
  return {
    id: `est-${usuario.id}`,
    nombre,
    tipo: usuario.tipo,
    direccion: 'Dirección registrada en sucursal',
    zona: 'Centro',
    puntoRecoleccion: 'Entrada principal',
    telefono: usuario.telefono || 'Sin teléfono',
  }
}
