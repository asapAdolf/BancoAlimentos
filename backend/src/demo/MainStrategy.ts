import type { DatosPublicacion } from '../patrones/factory/PublicacionAlimento.js'
import { PublicacionDescuento } from '../patrones/factory/PublicacionDescuento.js'
import { DescuentoPorCaducidad } from '../patrones/strategy/DescuentoPorCaducidad.js'
import { DescuentoPorDisponibilidad } from '../patrones/strategy/DescuentoPorDisponibilidad.js'
import { fechaEnDias } from '../utils/fechas.js'

// DEMO DE CONSOLA del Strategy. Equivale al programa principal del código muestra:
//
//   const paquete = new Paqueteria(new EnvioEstandar());
//   paquete.aplicarEnvio();
//   paquete.cambiarEnvio(new EnvioExpres());
//   paquete.aplicarEnvio();
//
// Ejecutar con: npm run demo:strategy

const datos: DatosPublicacion = {
  id: 'demo-1',
  precioBase: 200,
  porcentajeDescuento: 60, // porcentaje máximo
  estrategiaDescuento: 'caducidad',
  horarioRecoleccion: { fecha: fechaEnDias(0), desde: '19:00', hasta: '20:30' },
  establecimiento: {
    id: 'est-03',
    nombre: 'Restaurante El Fogón',
    tipo: 'restaurante',
    direccion: 'Blvd. Las Palmas 800, Col. Residencial Sur',
    zona: 'Sur',
    puntoRecoleccion: 'Entrada de servicio',
    telefono: '222 555 70 08',
  },
  alimento: {
    nombre: 'Porciones de lasaña',
    descripcion: 'Lasaña de carne preparada hoy',
    categoria: 'Comida preparada',
    unidad: 'porciones',
    cantidadDisponible: 4,
    kilos: 4,
    fechaCaducidad: fechaEnDias(1),
    foto: '',
  },
}

const publicacion = new PublicacionDescuento(datos)

console.log('--- Estrategia: caducidad (caduca mañana) ---')
publicacion.cambiarEstrategia(new DescuentoPorCaducidad())
console.log(`Descuento aplicado: ${publicacion.aplicarEstrategia()}%`)
publicacion.mostrarPublicacion()

console.log('\n--- Estrategia: disponibilidad (4 porciones) ---')
publicacion.cambiarEstrategia(new DescuentoPorDisponibilidad())
console.log(`Descuento aplicado: ${publicacion.aplicarEstrategia()}%`)
publicacion.mostrarPublicacion()

console.log('\n--- Misma estrategia, pero ahora quedan 25 porciones ---')
publicacion.alimento.cantidadDisponible = 25
console.log(`Descuento aplicado: ${publicacion.aplicarEstrategia()}%`)
publicacion.mostrarPublicacion()
