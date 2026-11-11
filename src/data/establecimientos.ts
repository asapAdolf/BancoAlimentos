import type { Establecimiento } from '../types/alimento'
import type { Usuario } from '../types/usuario'

// DATOS DE EJEMPLO (direcciones ficticias). Después vendrán de la API.
export const establecimientosDemo: Establecimiento[] = [
  {
    id: 'est-01',
    nombre: 'Panadería La Espiga',
    tipo: 'panaderia',
    direccion: 'Av. Reforma 120, Col. Centro',
    zona: 'Centro',
    puntoRecoleccion: 'Mostrador lateral, puerta azul',
    telefono: '222 555 44 33',
  },
  {
    id: 'est-02',
    nombre: 'Café Raíces',
    tipo: 'cafeteria',
    direccion: 'Calle Hidalgo 45, Col. Jardines del Norte',
    zona: 'Norte',
    puntoRecoleccion: 'Barra de entrega para llevar',
    telefono: '222 555 12 90',
  },
  {
    id: 'est-03',
    nombre: 'Restaurante El Fogón',
    tipo: 'restaurante',
    direccion: 'Blvd. Las Palmas 800, Col. Residencial Sur',
    zona: 'Sur',
    puntoRecoleccion: 'Entrada de servicio, junto al estacionamiento',
    telefono: '222 555 70 08',
  },
  {
    id: 'est-04',
    nombre: 'Supermercado Fresco Mart',
    tipo: 'supermercado',
    direccion: 'Av. Universidad 2200, Col. Oriente',
    zona: 'Oriente',
    puntoRecoleccion: 'Módulo de atención a clientes',
    telefono: '222 555 31 31',
  },
  {
    id: 'est-05',
    nombre: 'Cafetería Aroma',
    tipo: 'cafeteria',
    direccion: 'Calle 5 de Mayo 310, Col. Poniente',
    zona: 'Poniente',
    puntoRecoleccion: 'Caja principal',
    telefono: '222 555 66 20',
  },
  {
    id: 'est-06',
    nombre: 'Restaurante Sabor Casero',
    tipo: 'restaurante',
    direccion: 'Calle Morelos 77, Col. Centro',
    zona: 'Centro',
    puntoRecoleccion: 'Puerta trasera de la cocina',
    telefono: '222 555 98 45',
  },
]

// Nombre con el que se identifica a un usuario establecimiento en las listas.
export function nombreDeEstablecimiento(usuario: Usuario): string {
  return (usuario.nombreEstablecimiento || usuario.nombre).trim()
}

// Busca el establecimiento de ejemplo del usuario; si no existe, arma uno genérico.
export function resolverEstablecimiento(usuario: Usuario): Establecimiento {
  const nombre = nombreDeEstablecimiento(usuario)
  const existente = establecimientosDemo.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase())
  if (existente) return existente
  return {
    id: `est-${usuario.id}`,
    nombre,
    tipo: usuario.tipo,
    direccion: 'Dirección del establecimiento (dato de ejemplo)',
    zona: 'Centro',
    puntoRecoleccion: 'Entrada principal',
    telefono: usuario.telefono || 'Sin teléfono',
  }
}
