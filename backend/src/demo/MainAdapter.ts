import { createInterface } from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'
import { emailAdapter } from '../patrones/adapter/notificaciones/emailAdapter.js'
import type { Notificacion } from '../patrones/adapter/notificaciones/Notificacion.js'
import { smsAdapter } from '../patrones/adapter/notificaciones/smsAdapter.js'
import { whatsappAdapter } from '../patrones/adapter/notificaciones/whatsappAdapter.js'
import type { Mapa } from '../patrones/adapter/mapas/Mapa.js'
import { googleMapsAdapter } from '../patrones/adapter/mapas/googleMapsAdapter.js'
import { openStreetMapAdapter } from '../patrones/adapter/mapas/openStreetMapAdapter.js'

// DEMO DE CONSOLA del Adapter. Misma lógica que el Main del código muestra
// (Scanner + do/while + switch). Se agregó la opción 4 para probar los adaptadores de mapas.
//
// Ejecutar con: npm run demo:adapter

// Equivalente a Scanner sc = new Scanner(System.in)
const sc = createInterface({ input, output })
const lineas = sc[Symbol.asyncIterator]()

async function leer(texto: string): Promise<string | null> {
  output.write(texto)
  const linea = await lineas.next()
  return linea.done ? null : linea.value
}

let opc: number
let mensaje: string

do {
  console.log('\n1. SMS 2.WhatsApp 3.Email 4.Mapas 5.Salir')
  const entrada = await leer('')
  opc = entrada === null ? 5 : Number(entrada) // fin de la entrada = Salir
  switch (opc) {
    case 1: {
      mensaje = (await leer('Ingrese el mensaje: ')) ?? ''
      const sms: Notificacion = new smsAdapter()
      sms.enviarMensaje(mensaje)
      break
    }
    case 2: {
      mensaje = (await leer('Ingrese el mensaje: ')) ?? ''
      const Whatsapp: Notificacion = new whatsappAdapter()
      Whatsapp.enviarMensaje(mensaje)
      break
    }
    case 3: {
      mensaje = (await leer('Ingrese el mensaje: ')) ?? ''
      const email: Notificacion = new emailAdapter()
      email.enviarMensaje(mensaje)
      break
    }
    case 4: {
      const origen = (await leer('Dirección de origen: ')) ?? ''
      const destino = (await leer('Dirección de destino: ')) ?? ''
      const mapas: Mapa[] = [new googleMapsAdapter(), new openStreetMapAdapter()]
      for (const mapa of mapas) {
        const ruta = mapa.calcularRuta(origen, destino)
        console.log(`${ruta.proveedor}: ${ruta.distanciaKm} km, ~${ruta.minutosEstimados} min`)
      }
      break
    }
  }
} while (opc !== 5)

sc.close()
