import type { Usuario } from '../modelos/Usuario.js'
import { PublicacionFactory } from '../patrones/factory/PublicacionFactory.js'
import { CatalogoAlimentos } from '../patrones/observer/CatalogoAlimentos.js'
import { UsuarioObservador } from '../patrones/observer/UsuarioObservador.js'
import { fechaEnDias } from '../utils/fechas.js'

// Script de prueba en consola del patrón Observer.
// Ejecutar con: npm run demo:observer

const cat1 = new CatalogoAlimentos('Rescate Alimentario')

const usuarioEmail: Usuario = {
  id: 'usr-1',
  nombre: 'Beneficiario 1',
  correo: 'beneficiario@correo.mx',
  telefono: '2220000001',
  tipo: 'persona',
  canalNotificacion: 'email',
}

const usuarioWhatsapp: Usuario = {
  id: 'usr-2',
  nombre: 'Organización Comunitaria',
  correo: 'organizacion@correo.mx',
  telefono: '2220000002',
  tipo: 'organizacion',
  canalNotificacion: 'whatsapp',
}

const us1 = new UsuarioObservador(usuarioEmail)
const us2 = new UsuarioObservador(usuarioWhatsapp)

cat1.agregarObservador(us1)
cat1.agregarObservador(us2)

const establecimientoBase = {
  id: 'est-1',
  nombre: 'Establecimiento Local',
  tipo: 'panaderia' as const,
  direccion: 'Centro',
  zona: 'Centro',
  puntoRecoleccion: 'Entrada principal',
  telefono: '2220000000',
}

const pub1 = PublicacionFactory.crearPublicacion('descuento', {
  id: 'p-1',
  precioBase: 100,
  porcentajeDescuento: 40,
  estrategiaDescuento: 'caducidad',
  establecimiento: establecimientoBase,
  horarioRecoleccion: { fecha: fechaEnDias(0), desde: '18:00', hasta: '20:00' },
  alimento: {
    nombre: 'Lote de pan del día',
    descripcion: 'Piezas horneadas hoy',
    categoria: 'Pan y repostería',
    unidad: 'piezas',
    cantidadDisponible: 10,
    kilos: 2,
    fechaCaducidad: fechaEnDias(1),
    foto: '',
  },
})

const pub2 = PublicacionFactory.crearPublicacion('donacion', {
  id: 'p-2',
  precioBase: 0,
  establecimiento: establecimientoBase,
  horarioRecoleccion: { fecha: fechaEnDias(0), desde: '19:00', hasta: '20:30' },
  alimento: {
    nombre: 'Frutas de temporada',
    descripcion: 'Caja surtida',
    categoria: 'Frutas y verduras',
    unidad: 'cajas',
    cantidadDisponible: 2,
    kilos: 5,
    fechaCaducidad: fechaEnDias(2),
    foto: '',
  },
})

cat1.nuevoAlimento(pub1)

console.log('\n--- us2 se da de baja (eliminarObservador) ---')
cat1.eliminarObservador(us2)
cat1.nuevoAlimento(pub2)
