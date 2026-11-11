import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Bell,
  BellOff,
  CalendarCheck,
  CheckCheck,
  MessageCircle,
  Percent,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { usePlataforma } from '../context/PlataformaContext'
import type { TipoNotificacion } from '../types/notificacion'
import { hace } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import NotaDiseno from '../components/ui/NotaDiseno'

const iconos: Record<TipoNotificacion, LucideIcon> = {
  nuevo: Sparkles,
  descuento: Percent,
  reservado: CalendarCheck,
  listo: ShoppingBag,
  entrega: BadgeCheck,
}

// PANTALLA 10: Centro de notificaciones.
export default function PaginaNotificaciones() {
  const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas } = usePlataforma()
  const [soloSinLeer, setSoloSinLeer] = useState(false)
  // Interruptores de ejemplo: solo cambian en pantalla.
  const [avisosPlataforma, setAvisosPlataforma] = useState(true)
  const [avisosDescuentos, setAvisosDescuentos] = useState(true)

  const visibles = soloSinLeer ? notificaciones.filter((n) => !n.leida) : notificaciones

  return (
    <Pagina
      titulo="Notificaciones"
      subtitulo={noLeidas > 0 ? `Tienes ${noLeidas} sin leer.` : 'Estás al día. No tienes avisos pendientes.'}
      acciones={
        <button className="btn btn-borde" onClick={marcarTodasLeidas} disabled={noLeidas === 0}>
          <CheckCheck size={18} /> Marcar todas como leídas
        </button>
      }
    >
      <div className="notif-rejilla">
        <section>
          <div className="chips">
            <button className={`chip ${!soloSinLeer ? 'activo' : ''}`} onClick={() => setSoloSinLeer(false)}>
              Todas ({notificaciones.length})
            </button>
            <button className={`chip ${soloSinLeer ? 'activo' : ''}`} onClick={() => setSoloSinLeer(true)}>
              Sin leer ({noLeidas})
            </button>
          </div>

          {visibles.length === 0 ? (
            <EstadoVacio
              icono={<BellOff size={34} />}
              titulo="No hay notificaciones"
              texto="Cuando haya alimentos nuevos, reservaciones o entregas, te avisaremos aquí."
            />
          ) : (
            <ul className="lista-notif">
              {visibles.map((n) => {
                const Icono = iconos[n.tipo]
                return (
                  <li key={n.id} className={`notif ${n.leida ? '' : 'sin-leer'}`}>
                    <span className={`notif-icono tipo-${n.tipo}`}>
                      <Icono size={22} />
                    </span>
                    <div className="notif-texto">
                      <div className="notif-titulo">
                        <strong>{n.titulo}</strong>
                        {!n.leida && <span className="punto-nuevo" aria-label="Sin leer" />}
                      </div>
                      <p>{n.mensaje}</p>
                      <div className="notif-pie">
                        <small>{hace(n.fecha)}</small>
                        {n.publicacionId && (
                          <Link to={`/app/catalogo/${n.publicacionId}`} onClick={() => marcarLeida(n.id)}>
                            Ver alimento
                          </Link>
                        )}
                        {!n.leida && (
                          <button className="enlace-boton" onClick={() => marcarLeida(n.id)}>
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside className="notif-lateral">
          <section className="tarjeta-panel">
            <h2 className="titulo-seccion">
              <Bell size={18} /> Preferencias de aviso
            </h2>
            <label className="interruptor-fila">
              <span>Avisos dentro de la plataforma</span>
              <input type="checkbox" checked={avisosPlataforma} onChange={(e) => setAvisosPlataforma(e.target.checked)} />
              <span className="interruptor" />
            </label>
            <label className="interruptor-fila">
              <span>Avisar de nuevos descuentos</span>
              <input type="checkbox" checked={avisosDescuentos} onChange={(e) => setAvisosDescuentos(e.target.checked)} />
              <span className="interruptor" />
            </label>
            <label className="interruptor-fila deshabilitado">
              <span>
                <MessageCircle size={15} /> Avisos por WhatsApp <em>Próximamente</em>
              </span>
              <input type="checkbox" disabled />
              <span className="interruptor" />
            </label>
          </section>

          <NotaDiseno patron="Observer + Adapter">
            Cuando se publica un alimento, <strong>GestorNotificaciones</strong> notifica a los observadores
            (<strong>UsuarioOrganizacion</strong>). El envío por WhatsApp usaría{' '}
            <strong>AdaptadorTwilioWhatsApp</strong>, que todavía no está conectado.
          </NotaDiseno>
        </aside>
      </div>
    </Pagina>
  )
}
