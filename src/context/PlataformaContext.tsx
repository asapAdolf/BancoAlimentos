import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types/usuario'
import type {
  CategoriaAlimento,
  EstrategiaDescuento,
  HorarioRecoleccion,
  Modalidad,
  PublicacionAlimento,
  UnidadAlimento,
} from '../types/alimento'
import type { Reservacion } from '../types/reservacion'
import type { Notificacion, TipoNotificacion } from '../types/notificacion'
import type { RegistroDesperdicioEvitado } from '../types/impacto'
import { publicacionesIniciales } from '../data/publicaciones'
import { reservacionesIniciales } from '../data/reservaciones'
import { notificacionesIniciales } from '../data/notificaciones'
import { registroInicial } from '../data/impacto'
import { resolverEstablecimiento } from '../data/establecimientos'
import { fotoPorCategoria } from '../data/fotos'
import { fechaEnDias } from '../utils/formato'
import { precioFinal } from '../utils/precios'

// ESTADO SIMULADO DE LA INTERFAZ.
// Aquí viven los datos de ejemplo y las acciones que cambian lo que se ve en pantalla
// (publicar, reservar, confirmar entrega...). NO es un Back-End: al recargar la página,
// todo vuelve a los datos de ejemplo. Cuando exista la API, estas acciones llamarán al servidor.

export interface NuevaPublicacion {
  nombre: string
  descripcion: string
  categoria: CategoriaAlimento
  unidad: UnidadAlimento
  cantidad: number
  kilos: number
  precioBase: number
  fechaCaducidad: string
  horario: HorarioRecoleccion
  modalidad: Modalidad
  estrategia: EstrategiaDescuento
  porcentaje: number
  foto: string
}

export interface CambiosPublicacion {
  nombre: string
  descripcion: string
  cantidad: number
  precioBase: number
  porcentaje: number
}

export interface Mensaje {
  id: number
  texto: string
  tipo: 'exito' | 'info' | 'error'
}

interface PlataformaValor {
  publicaciones: PublicacionAlimento[]
  reservaciones: Reservacion[]
  notificaciones: Notificacion[]
  registro: RegistroDesperdicioEvitado
  noLeidas: number
  mensajes: Mensaje[]
  publicar: (datos: NuevaPublicacion, usuario: Usuario) => PublicacionAlimento
  reservar: (publicacionId: string, usuario: Usuario) => void
  confirmarEntrega: (publicacionId: string) => void
  cancelarPublicacion: (publicacionId: string) => void
  editarPublicacion: (publicacionId: string, cambios: CambiosPublicacion) => void
  marcarLeida: (id: string) => void
  marcarTodasLeidas: () => void
  avisar: (texto: string, tipo?: Mensaje['tipo']) => void
}

const PlataformaContexto = createContext<PlataformaValor | null>(null)

export function PlataformaProvider({ children }: { children: ReactNode }) {
  const [publicaciones, setPublicaciones] = useState<PublicacionAlimento[]>(publicacionesIniciales)
  const [reservaciones, setReservaciones] = useState<Reservacion[]>(reservacionesIniciales)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesIniciales)
  const [registro, setRegistro] = useState<RegistroDesperdicioEvitado>(registroInicial)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])

  // Mensaje emergente ("toast") que desaparece solo.
  const avisar = useCallback((texto: string, tipo: Mensaje['tipo'] = 'exito') => {
    const id = Date.now() + Math.random()
    setMensajes((m) => [...m, { id, texto, tipo }])
    setTimeout(() => setMensajes((m) => m.filter((x) => x.id !== id)), 3800)
  }, [])

  const agregarNotificacion = (
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    publicacionId?: string,
  ) => {
    const nueva: Notificacion = {
      id: `n-${Date.now()}-${Math.random()}`,
      tipo,
      titulo,
      mensaje,
      fecha: new Date().toISOString(),
      leida: false,
      publicacionId,
    }
    setNotificaciones((n) => [nueva, ...n])
  }

  const publicar = (d: NuevaPublicacion, usuario: Usuario): PublicacionAlimento => {
    const nueva: PublicacionAlimento = {
      id: `p-${Date.now()}`,
      modalidad: d.modalidad,
      estadoActual: 'disponible',
      estrategiaDescuento: d.modalidad === 'descuento' ? d.estrategia : undefined,
      precioBase: d.modalidad === 'donacion' ? 0 : d.precioBase,
      porcentajeDescuento: d.modalidad === 'descuento' ? d.porcentaje : 0,
      fechaPublicacion: new Date().toISOString(),
      establecimiento: resolverEstablecimiento(usuario),
      horarioRecoleccion: d.horario,
      alimento: {
        nombre: d.nombre.trim(),
        descripcion: d.descripcion.trim() || 'Sin descripción.',
        categoria: d.categoria,
        unidad: d.unidad,
        cantidadDisponible: d.cantidad,
        kilos: d.kilos,
        fechaCaducidad: d.fechaCaducidad,
        foto: d.foto || fotoPorCategoria(d.categoria),
      },
    }
    setPublicaciones((p) => [nueva, ...p])

    const nombreEst = nueva.establecimiento.nombre
    if (d.modalidad === 'descuento') {
      agregarNotificacion(
        'descuento',
        'Nueva publicación con descuento',
        `${nombreEst} publicó "${nueva.alimento.nombre}" con ${d.porcentaje}% de descuento.`,
        nueva.id,
      )
    } else {
      agregarNotificacion(
        'nuevo',
        'Nuevo alimento disponible',
        `${nombreEst} publicó "${nueva.alimento.nombre}".`,
        nueva.id,
      )
    }
    avisar('¡Alimento publicado! (Demostración) Se generó un aviso para las organizaciones suscritas.')
    return nueva
  }

  const reservar = (publicacionId: string, usuario: Usuario) => {
    const pub = publicaciones.find((p) => p.id === publicacionId)
    if (!pub || pub.estadoActual !== 'disponible') return

    const codigo = `RA-${Math.floor(1000 + Math.random() * 9000)}`
    const nueva: Reservacion = {
      id: `r-${Date.now()}`,
      publicacionId,
      usuarioNombre: usuario.nombre,
      cantidad: pub.alimento.cantidadDisponible,
      precioTotal: precioFinal(pub),
      fecha: fechaEnDias(0),
      codigo,
    }
    setReservaciones((r) => [nueva, ...r])
    setPublicaciones((lista) =>
      lista.map((p) => (p.id === publicacionId ? { ...p, estadoActual: 'reservado' } : p)),
    )
    agregarNotificacion(
      'reservado',
      'Alimento reservado',
      `Reservaste "${pub.alimento.nombre}". Tu código es ${codigo}.`,
      publicacionId,
    )
    agregarNotificacion(
      'listo',
      'Alimento listo para recoger',
      `Pasa por "${pub.alimento.nombre}" a ${pub.establecimiento.nombre}.`,
      publicacionId,
    )
    avisar('Reservación realizada. Puedes consultarla en "Reservaciones".')
  }

  const confirmarEntrega = (publicacionId: string) => {
    const pub = publicaciones.find((p) => p.id === publicacionId)
    if (!pub || pub.estadoActual !== 'reservado') return

    setPublicaciones((lista) =>
      lista.map((p) => (p.id === publicacionId ? { ...p, estadoActual: 'entregado' } : p)),
    )

    // Equivale a "registrar la recuperación" en el registro de desperdicio evitado (solo visual).
    const kilosRecuperados = pub.alimento.kilos
    setRegistro((r) => ({
      ...r,
      totalKilosEvitados: r.totalKilosEvitados + kilosRecuperados,
      totalAlimentosRecuperados: r.totalAlimentosRecuperados + pub.alimento.cantidadDisponible,
      entregasConfirmadas: r.entregasConfirmadas + 1,
      historialMensual: r.historialMensual.map((m, i, todos) =>
        i === todos.length - 1 ? { ...m, kilos: m.kilos + kilosRecuperados } : m,
      ),
      porModalidad: { ...r.porModalidad, [pub.modalidad]: r.porModalidad[pub.modalidad] + kilosRecuperados },
      porCategoria: {
        ...r.porCategoria,
        [pub.alimento.categoria]: r.porCategoria[pub.alimento.categoria] + kilosRecuperados,
      },
    }))

    agregarNotificacion(
      'entrega',
      'Entrega confirmada',
      `Se confirmó la entrega de "${pub.alimento.nombre}". Sumaste ${kilosRecuperados} kg rescatados.`,
      publicacionId,
    )
    avisar('Entrega confirmada. El impacto se actualizó en Estadísticas.')
  }

  const cancelarPublicacion = (publicacionId: string) => {
    const pub = publicaciones.find((p) => p.id === publicacionId)
    if (!pub || pub.estadoActual !== 'disponible') return
    setPublicaciones((lista) => lista.filter((p) => p.id !== publicacionId))
    avisar(`Publicación "${pub.alimento.nombre}" cancelada.`, 'info')
  }

  const editarPublicacion = (publicacionId: string, c: CambiosPublicacion) => {
    setPublicaciones((lista) =>
      lista.map((p) =>
        p.id === publicacionId
          ? {
              ...p,
              precioBase: p.modalidad === 'donacion' ? 0 : c.precioBase,
              porcentajeDescuento: p.modalidad === 'descuento' ? c.porcentaje : 0,
              alimento: {
                ...p.alimento,
                nombre: c.nombre.trim(),
                descripcion: c.descripcion.trim(),
                cantidadDisponible: c.cantidad,
              },
            }
          : p,
      ),
    )
    avisar('Publicación actualizada.')
  }

  const marcarLeida = (id: string) => {
    setNotificaciones((n) => n.map((x) => (x.id === id ? { ...x, leida: true } : x)))
  }

  const marcarTodasLeidas = () => {
    setNotificaciones((n) => n.map((x) => ({ ...x, leida: true })))
  }

  const noLeidas = notificaciones.filter((n) => !n.leida).length

  return (
    <PlataformaContexto.Provider
      value={{
        publicaciones,
        reservaciones,
        notificaciones,
        registro,
        noLeidas,
        mensajes,
        publicar,
        reservar,
        confirmarEntrega,
        cancelarPublicacion,
        editarPublicacion,
        marcarLeida,
        marcarTodasLeidas,
        avisar,
      }}
    >
      {children}
    </PlataformaContexto.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlataforma(): PlataformaValor {
  const contexto = useContext(PlataformaContexto)
  if (!contexto) throw new Error('usePlataforma debe usarse dentro de <PlataformaProvider>.')
  return contexto
}
