import type { Reservacion } from '../types/reservacion'
import { fechaEnDias } from '../utils/formato'

// DATOS DE EJEMPLO. Las reservaciones de "Ana Torres" se ven con persona@demo.mx;
// las de "Fundación Manos Unidas" con organizacion@demo.mx.
export const reservacionesIniciales: Reservacion[] = [
  {
    id: 'r-001',
    publicacionId: 'p-003',
    usuarioNombre: 'Ana Torres',
    cantidad: 6,
    precioTotal: 105,
    fecha: fechaEnDias(0),
    codigo: 'RA-4821',
  },
  {
    id: 'r-002',
    publicacionId: 'p-008',
    usuarioNombre: 'Fundación Manos Unidas',
    cantidad: 20,
    precioTotal: 0,
    fecha: fechaEnDias(0),
    codigo: 'RA-7345',
  },
  {
    id: 'r-003',
    publicacionId: 'p-010',
    usuarioNombre: 'Ana Torres',
    cantidad: 12,
    precioTotal: 270,
    fecha: fechaEnDias(-1),
    codigo: 'RA-1190',
  },
  {
    id: 'r-004',
    publicacionId: 'p-011',
    usuarioNombre: 'Fundación Manos Unidas',
    cantidad: 10,
    precioTotal: 0,
    fecha: fechaEnDias(-1),
    codigo: 'RA-6032',
  },
]
