import type { Notificacion } from '../types/notificacion'
import { haceMinutos } from '../utils/formato'

// DATOS DE EJEMPLO para el centro de notificaciones.
export const notificacionesIniciales: Notificacion[] = [
  {
    id: 'n-001',
    tipo: 'nuevo',
    titulo: 'Nuevo alimento disponible',
    mensaje: 'Restaurante El Fogón publicó "Combos de hamburguesa con papas".',
    fecha: haceMinutos(12),
    leida: false,
    publicacionId: 'p-012',
  },
  {
    id: 'n-002',
    tipo: 'descuento',
    titulo: 'Nueva publicación con descuento',
    mensaje: 'Panadería La Espiga publicó "Croissants de mantequilla" con 40% de descuento.',
    fecha: haceMinutos(40),
    leida: false,
    publicacionId: 'p-002',
  },
  {
    id: 'n-003',
    tipo: 'reservado',
    titulo: 'Alimento reservado',
    mensaje: 'Reservaste "Rebanadas de pastel de chocolate". Tu código es RA-4821.',
    fecha: haceMinutos(120),
    leida: false,
    publicacionId: 'p-003',
  },
  {
    id: 'n-004',
    tipo: 'listo',
    titulo: 'Alimento listo para recoger',
    mensaje: 'Tu pedido "Pasta con salsa boloñesa" te espera hoy de 22:00 a 23:00.',
    fecha: haceMinutos(180),
    leida: false,
    publicacionId: 'p-008',
  },
  {
    id: 'n-005',
    tipo: 'entrega',
    titulo: 'Entrega confirmada',
    mensaje: 'Se confirmó la entrega de "Jugo natural de naranja". ¡Gracias por rescatar alimentos!',
    fecha: haceMinutos(1600),
    leida: true,
    publicacionId: 'p-010',
  },
  {
    id: 'n-006',
    tipo: 'nuevo',
    titulo: 'Nuevo alimento disponible',
    mensaje: 'Supermercado Fresco Mart publicó "Cajas de frutas y verduras de temporada".',
    fecha: haceMinutos(1700),
    leida: true,
    publicacionId: 'p-004',
  },
]
