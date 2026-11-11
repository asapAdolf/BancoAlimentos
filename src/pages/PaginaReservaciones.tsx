import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, CalendarClock, MapPin, PackageCheck, Store, Ticket } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlataforma } from '../context/PlataformaContext'
import { esEstablecimiento } from '../types/usuario'
import type { PublicacionAlimento } from '../types/alimento'
import type { Reservacion } from '../types/reservacion'
import { nombreDeEstablecimiento } from '../data/establecimientos'
import { fechaCorta, kilos, moneda, textoHorario } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import FotoAlimento from '../components/ui/FotoAlimento'
import LineaEstados from '../components/ui/LineaEstados'
import Modal from '../components/ui/Modal'
import { InsigniaEstado } from '../components/ui/Insignias'

interface Elemento {
  reserva: Reservacion
  pub: PublicacionAlimento
}

type Filtro = 'todas' | 'reservado' | 'entregado'

// PANTALLA 9: Reservaciones (las que hice o las que recibí, según el tipo de cuenta).
export default function PaginaReservaciones() {
  const { usuario } = useAuth()
  const { reservaciones, publicaciones, confirmarEntrega } = usePlataforma()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [detalle, setDetalle] = useState<Elemento | null>(null)
  const [confirmando, setConfirmando] = useState<Elemento | null>(null)

  const esNegocio = !!usuario && esEstablecimiento(usuario.tipo)
  const miNombreEst = usuario ? nombreDeEstablecimiento(usuario).toLowerCase() : ''

  // Une cada reservación con su publicación y se queda con las del usuario actual.
  const mias: Elemento[] = reservaciones
    .map((reserva) => ({ reserva, pub: publicaciones.find((p) => p.id === reserva.publicacionId) }))
    .filter((x): x is Elemento => !!x.pub)
    .filter((x) =>
      esNegocio
        ? x.pub.establecimiento.nombre.toLowerCase() === miNombreEst
        : x.reserva.usuarioNombre === usuario?.nombre,
    )

  const visibles = filtro === 'todas' ? mias : mias.filter((x) => x.pub.estadoActual === filtro)
  const contar = (e: Filtro) => mias.filter((x) => x.pub.estadoActual === e).length

  const confirmar = () => {
    if (!confirmando) return
    confirmarEntrega(confirmando.pub.id)
    setConfirmando(null)
    setDetalle(null)
  }

  return (
    <Pagina
      titulo={esNegocio ? 'Reservaciones recibidas' : 'Mis reservaciones'}
      subtitulo={
        esNegocio
          ? 'Alimentos tuyos que ya fueron reservados. Confirma la entrega cuando se recojan.'
          : 'Consulta los alimentos que reservaste y su horario de recolección.'
      }
    >
      {mias.length === 0 ? (
        <EstadoVacio
          icono={<CalendarCheck size={34} />}
          titulo="Todavía no hay reservaciones"
          texto={
            esNegocio
              ? 'Cuando alguien reserve uno de tus alimentos, aparecerá aquí.'
              : 'Explora el catálogo y reserva tu primer alimento.'
          }
        >
          {!esNegocio && (
            <Link to="/app/catalogo" className="btn btn-primario">
              Explorar alimentos
            </Link>
          )}
        </EstadoVacio>
      ) : (
        <>
          <div className="chips" role="tablist" aria-label="Filtrar reservaciones">
            <button className={`chip ${filtro === 'todas' ? 'activo' : ''}`} onClick={() => setFiltro('todas')}>
              Todas ({mias.length})
            </button>
            <button className={`chip ${filtro === 'reservado' ? 'activo' : ''}`} onClick={() => setFiltro('reservado')}>
              Por recoger ({contar('reservado')})
            </button>
            <button className={`chip ${filtro === 'entregado' ? 'activo' : ''}`} onClick={() => setFiltro('entregado')}>
              Entregadas ({contar('entregado')})
            </button>
          </div>

          <div className="lista-reservas">
            {visibles.map((x) => (
              <article className="reserva" key={x.reserva.id}>
                <FotoAlimento src={x.pub.alimento.foto} alt={x.pub.alimento.nombre} className="reserva-foto" />
                <div className="reserva-cuerpo">
                  <div className="reserva-titulo">
                    <h3>{x.pub.alimento.nombre}</h3>
                    <InsigniaEstado estado={x.pub.estadoActual} />
                  </div>
                  <p className="reserva-est">
                    <Store size={15} /> {x.pub.establecimiento.nombre}
                    {esNegocio && <> · Reservó: <strong>{x.reserva.usuarioNombre}</strong></>}
                  </p>
                  <ul className="reserva-datos">
                    <li>
                      <span>Cantidad</span>
                      <strong>
                        {x.reserva.cantidad} {x.pub.alimento.unidad}
                      </strong>
                    </li>
                    <li>
                      <span>Precio</span>
                      <strong>{x.reserva.precioTotal === 0 ? 'Gratis' : moneda(x.reserva.precioTotal)}</strong>
                    </li>
                    <li>
                      <span>Reservado el</span>
                      <strong>{fechaCorta(x.reserva.fecha)}</strong>
                    </li>
                    <li>
                      <span>Recolección</span>
                      <strong>{textoHorario(x.pub.horarioRecoleccion)}</strong>
                    </li>
                  </ul>
                </div>
                <div className="reserva-acciones">
                  <button className="btn btn-borde btn-chico" onClick={() => setDetalle(x)}>
                    Ver detalles
                  </button>
                  {x.pub.estadoActual === 'reservado' && (
                    <button className="btn btn-primario btn-chico" onClick={() => setConfirmando(x)}>
                      <PackageCheck size={16} /> Confirmar entrega
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {detalle && (
        <Modal titulo="Detalle de la reservación" ancho="ancho" onCerrar={() => setDetalle(null)}>
          <div className="modal-detalle">
            <FotoAlimento src={detalle.pub.alimento.foto} alt={detalle.pub.alimento.nombre} className="modal-foto" />
            <div>
              <h3>{detalle.pub.alimento.nombre}</h3>
              <p className="reserva-est">
                <Store size={15} /> {detalle.pub.establecimiento.nombre}
              </p>
              <div className="codigo-reserva">
                <Ticket size={20} />
                <div>
                  <small>Código de recolección</small>
                  <strong>{detalle.reserva.codigo}</strong>
                </div>
              </div>
              <ul className="lista-datos">
                <li>
                  <span>Cantidad reservada</span>
                  <strong>
                    {detalle.reserva.cantidad} {detalle.pub.alimento.unidad} · {kilos(detalle.pub.alimento.kilos)}
                  </strong>
                </li>
                <li>
                  <span>Precio</span>
                  <strong>{detalle.reserva.precioTotal === 0 ? 'Gratis' : moneda(detalle.reserva.precioTotal)}</strong>
                </li>
                <li>
                  <CalendarClock size={16} />
                  <span>Horario</span>
                  <strong>{textoHorario(detalle.pub.horarioRecoleccion)}</strong>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Dirección</span>
                  <strong>{detalle.pub.establecimiento.direccion}</strong>
                </li>
                <li>
                  <span>Punto de recolección</span>
                  <strong>{detalle.pub.establecimiento.puntoRecoleccion}</strong>
                </li>
              </ul>
              <LineaEstados estado={detalle.pub.estadoActual} />
              <div className="modal-pie sin-borde">
                <Link
                  to={`/app/ubicacion?pub=${detalle.pub.id}`}
                  className="btn btn-borde btn-chico"
                  onClick={() => setDetalle(null)}
                >
                  <MapPin size={16} /> Ver ubicación
                </Link>
                {detalle.pub.estadoActual === 'reservado' && (
                  <button className="btn btn-primario btn-chico" onClick={() => setConfirmando(detalle)}>
                    <PackageCheck size={16} /> Confirmar entrega
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {confirmando && (
        <Modal
          titulo="Confirmar entrega"
          onCerrar={() => setConfirmando(null)}
          pie={
            <>
              <button className="btn btn-borde" onClick={() => setConfirmando(null)}>
                Todavía no
              </button>
              <button className="btn btn-primario" onClick={confirmar}>
                Sí, se entregó
              </button>
            </>
          }
        >
          <p>
            ¿Confirmas que <strong>{confirmando.pub.alimento.nombre}</strong> ya fue entregado a{' '}
            <strong>{confirmando.reserva.usuarioNombre}</strong>?
          </p>
          <p className="aviso-chico">
            Se sumarán {kilos(confirmando.pub.alimento.kilos)} al registro de desperdicio evitado (demostración).
          </p>
        </Modal>
      )}
    </Pagina>
  )
}
