import { bd } from '../datos/BaseDatosMemoria.js'
import { CatalogoAlimentos } from '../patrones/observer/CatalogoAlimentos.js'
import { UsuarioObservador } from '../patrones/observer/UsuarioObservador.js'

// DEMO DE CONSOLA del Observer. Equivale al programa principal del código muestra:
//
//   const inf1 = new Influencer("Influencer 1");
//   const us1 = new Usuario("Usuario 1");
//   inf1.agregarObservador(us1)
//   inf1.notificar("Nuevo post")
//
// Cada observador, al recibir el aviso, lo envía por su canal (Adapter: SMS, WhatsApp o Email).
//
// Ejecutar con: npm run demo:observer

const cat1 = new CatalogoAlimentos('Rescate Alimentario')

const us1 = new UsuarioObservador(bd.usuarios[0]) // persona, avisos por email
const us2 = new UsuarioObservador(bd.usuarios[1]) // organización, avisos por WhatsApp

cat1.agregarObservador(us1)
cat1.agregarObservador(us2)

cat1.nuevoAlimento(bd.publicaciones[0])
cat1.nuevoAlimento(bd.publicaciones[2])

console.log('\n--- us2 se da de baja (eliminarObservador) ---')
cat1.eliminarObservador(us2)
cat1.nuevoAlimento(bd.publicaciones[3])
