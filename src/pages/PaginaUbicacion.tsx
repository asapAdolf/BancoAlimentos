import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, MapPin, MapPinOff, Navigation, Package, Phone, Route, Scale, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlataforma } from '../context/PlataformaContext'
import { useBase } from '../hooks/useBase'
import { diasParaCaducar, kilos, textoDias, textoHorario } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import MapaDemo from '../components/ui/MapaDemo'
import NotaDiseno from '../components/ui/NotaDiseno'
import FotoAlimento from '../components/ui/FotoAlimento'
import { InsigniaEstado } from '../components/ui/Insignias'

// Distancia y tiempo de EJEMPLO (se calculan a partir del identificador para que siempre sean los mismos).
function rutaDeEjemplo(id: string) {
  const semilla = id.split('').reduce((suma, c) => suma + c.charCodeAt(0), 0)
  const distancia = 0.8 + (semilla % 35) / 10
  const minutos = Math.round(distancia * 4 + 3)
  return { distancia: distancia.toFixed(1), minutos }
}

// PANTALLA 11: Ubicación y recolección con mapa de demostración.
export default function PaginaUbicacion() {
  const { usuario } = useAuth()
  const { publicaciones, reservaciones } = usePlataforma()
  const { base } = useBase()
  const [params, setParams] = useSearchParams()
  const [verRuta, setVerRuta] = useState(false)

  // Las recolecciones del usuario aparecen primero en la lista.
  const misIds = reservaciones.filter((r) => r.usuarioNombre === usuario?.nombre).map((r) => r.publicacionId)
  const opciones = publicaciones
    .filter((p) => p.estadoActual !== 'entregado')
    .sort((a, b) => Number(misIds.includes(b.id)) - Number(misIds.includes(a.id)))

  const seleccionada = publicaciones.find((p) => p.id === params.get('pub')) ?? opciones[0]

  const elegir = (id: string) => {
    setParams({ pub: id })
    setVerRuta(false)
  }

  if (!seleccionada) {
    return (
      <Pagina titulo="Ubicación y recolección">
        <EstadoVacio
          icono={<MapPinOff size={34} />}
          titulo="No hay puntos de recolección activos"
          texto="Cuando haya alimentos disponibles o reservados, verás aquí dónde recogerlos."
        >
          <Link to={`${base}/catalogo`} className="btn btn-primario">
            Ver catálogo
          </Link>
        </EstadoVacio>
      </Pagina>
    )
  }

  const { alimento, establecimiento } = seleccionada
  const ruta = rutaDeEjemplo(seleccionada.id)
  const dias = diasParaCaducar(alimento.fechaCaducidad)

  return (
    <Pagina
      titulo="Ubicación y recolección"
      subtitulo="Consulta dónde y cuándo recoger tus alimentos."
    >
      <div className="ubicacion-rejilla">
        <aside className="lista-puntos">
          <h2 className="titulo-seccion">Puntos de recolección</h2>
          <ul>
            {opciones.map((p) => (
              <li key={p.id}>
                <button
                  className={`punto ${p.id === seleccionada.id ? 'activo' : ''}`}
                  onClick={() => elegir(p.id)}
                >
                  <FotoAlimento src={p.alimento.foto} alt={p.alimento.nombre} className="punto-foto" />
                  <div>
                    <strong>{p.alimento.nombre}</strong>
                    <span>{p.establecimiento.nombre}</span>
                    {misIds.includes(p.id) && <em className="etiqueta-mia">Tu reservación</em>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="ubicacion-detalle">
          <MapaDemo ruta={verRuta} nombre={establecimiento.nombre} />

          <div className="ubicacion-acciones">
            <button className="btn btn-secundario" onClick={() => setVerRuta(!verRuta)}>
              <Route size={18} /> {verRuta ? 'Ocultar ruta' : 'Consultar ruta'}
            </button>
            <Link to={`${base}/catalogo/${seleccionada.id}`} className="btn btn-borde">
              Ver alimento
            </Link>
          </div>

          {verRuta && (
            <div className="ruta-resumen">
              <Navigation size={22} />
              <div>
                <strong>
                  {ruta.distancia} km · {ruta.minutos} min en auto
                </strong>
                <span>Ruta de ejemplo desde "Tu ubicación". El trazado real vendrá del servicio de mapas.</span>
              </div>
            </div>
          )}

          <div className="ubicacion-tarjetas">
            <article className="tarjeta-panel">
              <h2 className="titulo-seccion">
                <Store size={18} /> Establecimiento
              </h2>
              <ul className="lista-datos">
                <li>
                  <span>Nombre</span>
                  <strong>{establecimiento.nombre}</strong>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Dirección</span>
                  <strong>{establecimiento.direccion}</strong>
                </li>
                <li>
                  <span>Punto de recolección</span>
                  <strong>{establecimiento.puntoRecoleccion}</strong>
                </li>
                <li>
                  <Clock size={16} />
                  <span>Horario</span>
                  <strong>{textoHorario(seleccionada.horarioRecoleccion)}</strong>
                </li>
                <li>
                  <Phone size={16} />
                  <span>Teléfono</span>
                  <strong>{establecimiento.telefono}</strong>
                </li>
              </ul>
            </article>

            <article className="tarjeta-panel">
              <h2 className="titulo-seccion">
                <Package size={18} /> Información del alimento
              </h2>
              <div className="fila-insignias">
                <InsigniaEstado estado={seleccionada.estadoActual} />
              </div>
              <ul className="lista-datos">
                <li>
                  <span>Alimento</span>
                  <strong>{alimento.nombre}</strong>
                </li>
                <li>
                  <Package size={16} />
                  <span>Cantidad</span>
                  <strong>
                    {alimento.cantidadDisponible} {alimento.unidad}
                  </strong>
                </li>
                <li>
                  <Scale size={16} />
                  <span>Peso</span>
                  <strong>{kilos(alimento.kilos)}</strong>
                </li>
                <li className={dias <= 1 ? 'urgente' : ''}>
                  <Clock size={16} />
                  <span>Caducidad</span>
                  <strong>{textoDias(dias)}</strong>
                </li>
              </ul>
            </article>
          </div>

          <NotaDiseno patron="Adapter">
            El mapa y la ruta reales se obtendrían con <strong>ServicioMapasAdapter</strong> →{' '}
            <strong>AdaptadorGoogleMaps</strong>. Aún no hay ninguna API conectada: esta es una vista de demostración.
          </NotaDiseno>
        </section>
      </div>
    </Pagina>
  )
}
