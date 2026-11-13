import type { PublicacionAlimento, DatosPublicacion } from '../patrones/factory/PublicacionAlimento.js'
import { PublicacionFactory } from '../patrones/factory/PublicacionFactory.js'
import { fechaEnDias } from '../utils/fechas.js'

// DEMO DE CONSOLA del Factory Method. Equivale al Main del código muestra:
//
//   Personajes p1 = PersonajesFactory.crearPersonajes("Arquero");
//   Personajes p2 = PersonajesFactory.crearPersonajes("Mago");
//   p1.atacar();
//   p2.atacar();
//
// Ejecutar con: npm run demo:factory

const datos: DatosPublicacion = {
  id: 'demo-1',
  precioBase: 120,
  porcentajeDescuento: 40,
  estrategiaDescuento: 'caducidad',
  horarioRecoleccion: { fecha: fechaEnDias(0), desde: '19:00', hasta: '20:30' },
  establecimiento: {
    id: 'est-01',
    nombre: 'Panadería La Espiga',
    tipo: 'panaderia',
    direccion: 'Av. Reforma 120, Col. Centro',
    zona: 'Centro',
    puntoRecoleccion: 'Mostrador lateral',
    telefono: '222 555 44 33',
  },
  alimento: {
    nombre: 'Pan artesanal surtido',
    descripcion: 'Pan del día',
    categoria: 'Pan y repostería',
    unidad: 'piezas',
    cantidadDisponible: 12,
    kilos: 3.5,
    fechaCaducidad: fechaEnDias(1),
    foto: '',
  },
}

const p1: PublicacionAlimento = PublicacionFactory.crearPublicacion('Venta', datos)
const p2: PublicacionAlimento = PublicacionFactory.crearPublicacion('Descuento', datos)
const p3: PublicacionAlimento = PublicacionFactory.crearPublicacion('Donación', datos)

p1.mostrarPublicacion()
p2.mostrarPublicacion()
p3.mostrarPublicacion()

try {
  PublicacionFactory.crearPublicacion('Subasta', datos)
} catch (error) {
  console.log(`\nError esperado: ${(error as Error).message}`)
}
