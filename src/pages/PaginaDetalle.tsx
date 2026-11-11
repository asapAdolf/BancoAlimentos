import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarClock,
  CalendarX,
  Clock,
  Lock,
  MapPin,
  Package,
  PackageSearch,
  Scale,
  Store,
  Tag,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlataforma } from '../context/PlataformaContext'
import { ETIQUETA_ESTRATEGIA } from '../types/alimento'
import { esEstablecimiento } from '../types/usuario'
import { useBase } from '../hooks/useBase'
import { descuentoAplicado, precioFinal } from '../utils/precios'
import { diasParaCaducar, fechaCorta, kilos, moneda, textoHorario } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import FotoAlimento from '../components/ui/FotoAlimento'
import LineaEstados from '../components/ui/LineaEstados'
import Modal from '../components/ui/Modal'
import NotaDiseno from '../components/ui/NotaDiseno'
import { InsigniaEstado, InsigniaModalidad } from '../components/ui/Insignias'

// PANTALLA 6: Detalle del alimento, con botón para reservar.
export default function PaginaDetalle() {
  const { id } = useParams()
  const { publicaciones, reservar } = usePlataforma()
  const { usuario } = useAuth()
  const { base } = useBase()
  const navegar = useNavigate()
  const [confirmando, setConfirmando] = useState(false)

  const pub = publicaciones.find((p) => p.id === id)

  if (!pub) {
    return (
      <Pagina titulo="Alimento no encontrado">
        <EstadoVacio
          icono={<PackageSearch size={34} />}
          titulo="Esta publicación ya no existe"
          texto="Pudo haber sido cancelada por el establecimiento."
        >
          <Link to={`${base}/catalogo`} className="btn btn-primario">
            Volver al catálogo
          </Link>
        </EstadoVacio>
      </Pagina>
    )
  }

  const { alimento, establecimiento } = pub
  const final = precioFinal(pub)
  const descuento = descuentoAplicado(pub)
  const dias = diasParaCaducar(alimento.fechaCaducidad)
  const esNegocio = !!usuario && esEstablecimiento(usuario.tipo)
  const puedeReservar = pub.estadoActual === 'disponible' && !!usuario && !esNegocio

  const confirmar = () => {
    if (!usuario) return
    reservar(pub.id, usuario)
    setConfirmando(false)
    navegar('/app/reservaciones')
  }

  const datos = [
    { icono: <Package size={18} />, etiqueta: 'Cantidad disponible', valor: `${alimento.cantidadDisponible} ${alimento.unidad}` },
    { icono: <Scale size={18} />, etiqueta: 'Peso total', valor: kilos(alimento.kilos) },
    { icono: <CalendarX size={18} />, etiqueta: 'Fecha de caducidad', valor: fechaCorta(alimento.fechaCaducidad) },
    {
      icono: <Clock size={18} />,
      etiqueta: 'Días restantes',
      valor: dias < 0 ? 'Caducado' : `${dias} ${dias === 1 ? 'día' : 'días'}`,
      urgente: dias <= 1,
    },
    { icono: <CalendarClock size={18} />, etiqueta: 'Horario de recolección', valor: textoHorario(pub.horarioRecoleccion) },
    { icono: <MapPin size={18} />, etiqueta: 'Ubicación', valor: `${establecimiento.direccion}` },
  ]

  return (
    <Pagina titulo={alimento.nombre} subtitulo={`${establecimiento.nombre} · ${establecimiento.zona}`}>
      <Link to={`${base}/catalogo`} className="enlace-volver">
        <ArrowLeft size={18} /> Volver al catálogo
      </Link>

      <div className="detalle-rejilla">
        <div className="detalle-foto">
          <FotoAlimento src={alimento.foto} alt={alimento.nombre} />
          <div className="tarjeta-sup-izq">
            <InsigniaModalidad modalidad={pub.modalidad} />
          </div>
          {descuento > 0 && <span className="cinta-descuento">-{descuento}%</span>}
        </div>

        <div className="detalle-info">
          <div className="fila-insignias">
            <InsigniaEstado estado={pub.estadoActual} />
            <span className="insignia categoria">
              <Tag size={13} /> {alimento.categoria}
            </span>
          </div>

          <p className="detalle-descripcion">{alimento.descripcion}</p>

          <p className="detalle-est">
            <Store size={16} /> {establecimiento.nombre}
          </p>

          <div className="bloque-precio">
            {pub.modalidad === 'donacion' ? (
              <div className="precio-linea">
                <span>Precio</span>
                <strong className="precio-gratis grande">Gratis</strong>
              </div>
            ) : (
              <>
                <div className="precio-linea">
                  <span>Precio base</span>
                  <strong className={descuento > 0 ? 'tachado' : ''}>{moneda(pub.precioBase)}</strong>
                </div>
                {descuento > 0 && (
                  <div className="precio-linea">
                    <span>Descuento</span>
                    <strong className="texto-naranja">-{descuento}%</strong>
                  </div>
                )}
                <div className="precio-linea total">
                  <span>Precio final</span>
                  <strong>{moneda(final)}</strong>
                </div>
              </>
            )}
            <small className="precio-nota">El precio corresponde al lote completo.</small>
          </div>

          {pub.modalidad === 'descuento' && pub.estrategiaDescuento && (
            <NotaDiseno patron="Strategy">
              Descuento calculado con la estrategia <strong>{ETIQUETA_ESTRATEGIA[pub.estrategiaDescuento]}</strong>.
              El cálculo real lo hará el Back-End; aquí se muestra un valor de ejemplo.
            </NotaDiseno>
          )}

          <ul className="info-rejilla">
            {datos.map((d) => (
              <li key={d.etiqueta} className={d.urgente ? 'urgente' : ''}>
                <span className="info-icono">{d.icono}</span>
                <div>
                  <small>{d.etiqueta}</small>
                  <strong>{d.valor}</strong>
                </div>
              </li>
            ))}
          </ul>

          <div className="estado-actual">
            <small>Estado actual</small>
            <LineaEstados estado={pub.estadoActual} />
          </div>

          <div className="detalle-acciones">
            {puedeReservar && (
              <button className="btn btn-secundario" onClick={() => setConfirmando(true)}>
                <CalendarClock size={18} /> Reservar
              </button>
            )}
            {pub.estadoActual === 'disponible' && !usuario && (
              <Link to="/login" className="btn btn-secundario">
                <Lock size={18} /> Inicia sesión para reservar
              </Link>
            )}
            {pub.estadoActual === 'disponible' && esNegocio && (
              <span className="aviso-chico">Las cuentas de establecimiento no pueden reservar.</span>
            )}
            {pub.estadoActual !== 'disponible' && (
              <span className="aviso-chico">
                Esta publicación ya está {pub.estadoActual}. No se puede reservar.
              </span>
            )}
            <Link to={`${base}/ubicacion?pub=${pub.id}`} className="btn btn-borde">
              <MapPin size={18} /> Ver ubicación y ruta
            </Link>
          </div>
        </div>
      </div>

      {confirmando && (
        <Modal
          titulo="Confirmar reservación"
          onCerrar={() => setConfirmando(false)}
          pie={
            <>
              <button className="btn btn-borde" onClick={() => setConfirmando(false)}>
                Cancelar
              </button>
              <button className="btn btn-secundario" onClick={confirmar}>
                Confirmar reservación
              </button>
            </>
          }
        >
          <p>Vas a reservar el lote completo de:</p>
          <div className="resumen-reserva">
            <strong>{alimento.nombre}</strong>
            <span>
              {alimento.cantidadDisponible} {alimento.unidad} · {kilos(alimento.kilos)}
            </span>
            <span>
              Recolección: {textoHorario(pub.horarioRecoleccion)} en {establecimiento.nombre}
            </span>
            <span className="total-reserva">
              Total a pagar al recoger: {final === 0 ? 'Gratis' : moneda(final)}
            </span>
          </div>
          <p className="aviso-chico">Demostración: no se realiza ningún pago ni se envía información a un servidor.</p>
        </Modal>
      )}
    </Pagina>
  )
}
