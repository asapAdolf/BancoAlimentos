import type { Establecimiento } from '../modelos/Establecimiento.js'
import type { RegistroNotificacion } from '../modelos/RegistroNotificacion.js'
import type { Reservacion } from '../modelos/Reservacion.js'
import type { Usuario } from '../modelos/Usuario.js'
import type { PublicacionAlimento } from '../patrones/factory/PublicacionAlimento.js'
import { PublicacionFactory } from '../patrones/factory/PublicacionFactory.js'
import { RegistroDesperdicioEvitado } from '../registro/RegistroDesperdicioEvitado.js'
import { fechaEnDias, haceMinutos, mesesRecientes } from '../utils/fechas.js'
import { FOTOS } from './fotos.js'

// BASE DE DATOS EN MEMORIA.
// Guarda la información mientras el servidor está encendido; al reiniciarlo vuelve a los datos
// de ejemplo. Más adelante se puede cambiar por una base de datos real sin tocar los patrones.

export interface MensajeEnviado {
  canal: string
  destinatario: string
  mensaje: string
  fecha: string
}

export interface BaseDatos {
  usuarios: Usuario[]
  establecimientos: Establecimiento[]
  publicaciones: PublicacionAlimento[]
  reservaciones: Reservacion[]
  notificaciones: RegistroNotificacion[]
  mensajesEnviados: MensajeEnviado[]
  registro: RegistroDesperdicioEvitado
}

const usuarios: Usuario[] = [
  {
    id: 'usr-001',
    nombre: 'Ana Torres',
    correo: 'persona@demo.mx',
    telefono: '2221234567',
    tipo: 'persona',
    canalNotificacion: 'email',
  },
  {
    id: 'usr-002',
    nombre: 'Fundación Manos Unidas',
    correo: 'organizacion@demo.mx',
    telefono: '2229876543',
    tipo: 'organizacion',
    canalNotificacion: 'whatsapp',
  },
  {
    id: 'usr-003',
    nombre: 'Luis Ramírez',
    correo: 'panaderia@demo.mx',
    telefono: '2225554433',
    tipo: 'panaderia',
    nombreEstablecimiento: 'Panadería La Espiga',
    canalNotificacion: 'sms',
  },
]

const establecimientos: Establecimiento[] = [
  {
    id: 'est-01',
    nombre: 'Panadería La Espiga',
    tipo: 'panaderia',
    direccion: 'Av. Reforma 120, Col. Centro',
    zona: 'Centro',
    puntoRecoleccion: 'Mostrador lateral, puerta azul',
    telefono: '222 555 44 33',
    usuarioId: 'usr-003',
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

const est = (id: string): Establecimiento => establecimientos.find((e) => e.id === id)!
const hoy = fechaEnDias(0)
const manana = fechaEnDias(1)

// Las publicaciones de ejemplo también se crean con la fábrica (Factory Method).
const publicaciones: PublicacionAlimento[] = [
  PublicacionFactory.crearPublicacion('descuento', {
    id: 'p-012',
    precioBase: 780,
    porcentajeDescuento: 45,
    estrategiaDescuento: 'caducidad',
    establecimiento: est('est-03'),
    fechaPublicacion: haceMinutos(12),
    horarioRecoleccion: { fecha: hoy, desde: '21:00', hasta: '22:00' },
    alimento: {
      nombre: 'Combos de hamburguesa con papas',
      descripcion: 'Seis combos preparados hoy: hamburguesa de res, papas a la francesa y aderezo.',
      categoria: 'Comida preparada',
      unidad: 'paquetes',
      cantidadDisponible: 6,
      kilos: 6,
      fechaCaducidad: hoy,
      foto: FOTOS.hamburguesa,
    },
  }),
  PublicacionFactory.crearPublicacion('descuento', {
    id: 'p-002',
    precioBase: 120,
    porcentajeDescuento: 40,
    estrategiaDescuento: 'caducidad',
    establecimiento: est('est-01'),
    fechaPublicacion: haceMinutos(45),
    horarioRecoleccion: { fecha: hoy, desde: '19:00', hasta: '20:30' },
    alimento: {
      nombre: 'Croissants de mantequilla',
      descripcion: 'Croissants horneados esta mañana.',
      categoria: 'Pan y repostería',
      unidad: 'piezas',
      cantidadDisponible: 8,
      kilos: 1.2,
      fechaCaducidad: manana,
      foto: FOTOS.croissant,
    },
  }),
  PublicacionFactory.crearPublicacion('venta', {
    id: 'p-001',
    precioBase: 90,
    establecimiento: est('est-01'),
    fechaPublicacion: haceMinutos(90),
    horarioRecoleccion: { fecha: hoy, desde: '19:00', hasta: '20:30' },
    alimento: {
      nombre: 'Pan artesanal surtido',
      descripcion: 'Bolillos, conchas y pan integral del día.',
      categoria: 'Pan y repostería',
      unidad: 'piezas',
      cantidadDisponible: 12,
      kilos: 3.5,
      fechaCaducidad: manana,
      foto: FOTOS.pan,
    },
  }),
  PublicacionFactory.crearPublicacion('donacion', {
    id: 'p-005',
    precioBase: 0,
    establecimiento: est('est-03'),
    fechaPublicacion: haceMinutos(130),
    horarioRecoleccion: { fecha: hoy, desde: '20:30', hasta: '21:30' },
    alimento: {
      nombre: 'Ensaladas preparadas',
      descripcion: 'Ensaladas frescas con aderezo aparte.',
      categoria: 'Comida preparada',
      unidad: 'porciones',
      cantidadDisponible: 15,
      kilos: 6,
      fechaCaducidad: manana,
      foto: FOTOS.ensalada,
    },
  }),
  PublicacionFactory.crearPublicacion('descuento', {
    id: 'p-006',
    precioBase: 180,
    porcentajeDescuento: 35,
    estrategiaDescuento: 'disponibilidad',
    establecimiento: est('est-06'),
    fechaPublicacion: haceMinutos(200),
    horarioRecoleccion: { fecha: hoy, desde: '21:30', hasta: '22:30' },
    alimento: {
      nombre: 'Pizzas familiares del día',
      descripcion: 'Pizzas de pepperoni y hawaiana.',
      categoria: 'Comida preparada',
      unidad: 'piezas',
      cantidadDisponible: 4,
      kilos: 4,
      fechaCaducidad: hoy,
      foto: FOTOS.pizza,
    },
  }),
  PublicacionFactory.crearPublicacion('donacion', {
    id: 'p-007',
    precioBase: 0,
    establecimiento: est('est-04'),
    fechaPublicacion: haceMinutos(260),
    horarioRecoleccion: { fecha: manana, desde: '09:00', hasta: '11:00' },
    alimento: {
      nombre: 'Caja de frutas y verduras',
      descripcion: 'Jitomate, calabaza, plátano y manzana en buen estado.',
      categoria: 'Frutas y verduras',
      unidad: 'cajas',
      cantidadDisponible: 5,
      kilos: 25,
      fechaCaducidad: fechaEnDias(3),
      foto: FOTOS.verduras,
    },
  }),
]

const kilosPorMes = [1480, 1720, 1960, 2210, 2480, 2630]

export const bd: BaseDatos = {
  usuarios,
  establecimientos,
  publicaciones,
  reservaciones: [],
  notificaciones: [],
  mensajesEnviados: [],
  registro: new RegistroDesperdicioEvitado({
    totalKilosEvitados: 12480,
    totalAlimentosRecuperados: 3860,
    entregasConfirmadas: 1204,
    historialMensual: mesesRecientes(6).map((mes, i) => ({ mes, kilos: kilosPorMes[i] })),
    porModalidad: { venta: 3740, descuento: 5990, donacion: 2750 },
    porCategoria: {
      'Pan y repostería': 3370,
      'Frutas y verduras': 3120,
      'Comida preparada': 2870,
      Lácteos: 1250,
      Bebidas: 870,
      Abarrotes: 1000,
    },
  }),
}
