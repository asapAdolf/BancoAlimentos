import { bd } from '../datos/BaseDatosMemoria.js'
import { AccesoDenegadoException } from '../errores/Excepciones.js'
import { esEstablecimiento, type Usuario } from '../modelos/Usuario.js'
import type { PublicacionAlimento } from '../patrones/factory/PublicacionAlimento.js'
import { CatalogoAlimentos } from '../patrones/observer/CatalogoAlimentos.js'
import { UsuarioObservador } from '../patrones/observer/UsuarioObservador.js'

export interface EstadoSuscripcion {
  suscrito: boolean
  totalSuscritos: number
}

// Servicio que usa el PATRÓN OBSERVER para avisar de nuevos alimentos disponibles.
// Equivale al "programa principal" del código muestra:
//
//   const inf1 = new Influencer("Influencer 1");
//   const us1 = new Usuario("Usuario 1");
//   inf1.agregarObservador(us1)
//   inf1.notificar("Nuevo post")
//
// Personas y organizaciones quedan suscritas al registrarse y pueden darse de baja.
export class SuscripcionServicio {
  static catalogo: CatalogoAlimentos = new CatalogoAlimentos('Rescate Alimentario')
  private static observadores = new Map<string, UsuarioObservador>()

  // Suscribe a los usuarios que ya existen (se llama una vez al iniciar el servidor).
  static inicializar(): void {
    for (const usuario of bd.usuarios) {
      if (!esEstablecimiento(usuario.tipo)) SuscripcionServicio.suscribir(usuario)
    }
  }

  static suscribir(usuario: Usuario): EstadoSuscripcion {
    if (esEstablecimiento(usuario.tipo)) {
      throw new AccesoDenegadoException('Solo personas y organizaciones reciben avisos de nuevos alimentos.')
    }
    if (!SuscripcionServicio.observadores.has(usuario.id)) {
      const obs = new UsuarioObservador(usuario)
      SuscripcionServicio.observadores.set(usuario.id, obs)
      SuscripcionServicio.catalogo.agregarObservador(obs)
    }
    return SuscripcionServicio.estado(usuario)
  }

  static cancelarSuscripcion(usuario: Usuario): EstadoSuscripcion {
    const obs = SuscripcionServicio.observadores.get(usuario.id)
    if (obs) {
      SuscripcionServicio.catalogo.eliminarObservador(obs)
      SuscripcionServicio.observadores.delete(usuario.id)
    }
    return SuscripcionServicio.estado(usuario)
  }

  static estado(usuario: Usuario): EstadoSuscripcion {
    return {
      suscrito: SuscripcionServicio.observadores.has(usuario.id),
      totalSuscritos: SuscripcionServicio.catalogo.getTotalObservadores(),
    }
  }

  // Se llama al publicar: el catálogo notifica a todos los observadores.
  static notificarNuevoAlimento(publicacion: PublicacionAlimento): number {
    return SuscripcionServicio.catalogo.nuevoAlimento(publicacion)
  }
}
