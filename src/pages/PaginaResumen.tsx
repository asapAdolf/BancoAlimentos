import { Link } from 'react-router-dom'
import { CalendarClock, Leaf, Package, PackageCheck, PlusCircle, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlataforma } from '../context/PlataformaContext'
import { esEstablecimiento } from '../types/usuario'
import { descuentoAplicado, precioFinal } from '../utils/precios'
import { hace, kilos, moneda, numero } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import TarjetaEstadistica from '../components/ui/TarjetaEstadistica'
import GraficaBarras from '../components/ui/GraficaBarras'
import GraficaDonut from '../components/ui/GraficaDonut'
import FotoAlimento from '../components/ui/FotoAlimento'
import { InsigniaEstado, InsigniaModalidad } from '../components/ui/Insignias'

// PANTALLA 4: Panel principal (resumen).
export default function PaginaResumen() {
  const { usuario } = useAuth()
  const { publicaciones, notificaciones, registro } = usePlataforma()
  const esNegocio = !!usuario && esEstablecimiento(usuario.tipo)

  const disponibles = publicaciones.filter((p) => p.estadoActual === 'disponible').length
  const reservados = publicaciones.filter((p) => p.estadoActual === 'reservado').length
  const entregados = publicaciones.filter((p) => p.estadoActual === 'entregado').length

  const recientes = publicaciones.slice(0, 4)
  const avisos = notificaciones.slice(0, 4)

  return (
    <Pagina
      titulo={`¡Hola, ${usuario?.nombre.split(' ')[0] ?? ''}!`}
      subtitulo={
        esNegocio
          ? 'Publica tus excedentes y sigue su recolección.'
          : 'Encuentra alimentos para rescatar y revisa tus reservaciones.'
      }
      acciones={
        esNegocio ? (
          <Link to="/app/publicar" className="btn btn-secundario">
            <PlusCircle size={18} /> Publicar alimento
          </Link>
        ) : (
          <Link to="/app/catalogo" className="btn btn-primario">
            <Search size={18} /> Explorar alimentos
          </Link>
        )
      }
    >
      <div className="rejilla-stats">
        <TarjetaEstadistica icono={<Package size={24} />} valor={disponibles} etiqueta="Alimentos disponibles" tono="verde" />
        <TarjetaEstadistica icono={<CalendarClock size={24} />} valor={reservados} etiqueta="Alimentos reservados" tono="naranja" />
        <TarjetaEstadistica icono={<PackageCheck size={24} />} valor={entregados} etiqueta="Alimentos entregados" tono="azul" />
        <TarjetaEstadistica
          icono={<Leaf size={24} />}
          valor={kilos(registro.totalKilosEvitados)}
          etiqueta="Kilos recuperados"
          tono="rosa"
          nota="Dato de demostración"
        />
      </div>

      <div className="rejilla-graficas">
        <section className="tarjeta-panel">
          <h2 className="titulo-seccion">Kilos recuperados por mes</h2>
          <GraficaBarras
            datos={registro.historialMensual.map((m) => ({ etiqueta: m.mes, valor: m.kilos }))}
            formato={(n) => numero(n)}
          />
        </section>

        <section className="tarjeta-panel">
          <h2 className="titulo-seccion">Recuperación por modalidad</h2>
          <GraficaDonut
            centroValor={numero(registro.totalKilosEvitados)}
            centroEtiqueta="kg totales"
            datos={[
              { etiqueta: 'Venta', valor: registro.porModalidad.venta, color: 'var(--verde)' },
              { etiqueta: 'Con descuento', valor: registro.porModalidad.descuento, color: 'var(--naranja)' },
              { etiqueta: 'Donación', valor: registro.porModalidad.donacion, color: '#0e8a8a' },
            ]}
          />
        </section>
      </div>

      <div className="rejilla-listas">
        <section className="tarjeta-panel">
          <div className="seccion-cabecera">
            <h2 className="titulo-seccion">Publicados recientemente</h2>
            <Link to="/app/catalogo" className="enlace-flecha">
              Ver catálogo
            </Link>
          </div>
          <ul className="lista-simple">
            {recientes.map((pub) => (
              <li key={pub.id}>
                <Link to={`/app/catalogo/${pub.id}`} className="fila-pub">
                  <FotoAlimento src={pub.alimento.foto} alt={pub.alimento.nombre} className="fila-foto" />
                  <div className="fila-texto">
                    <strong>{pub.alimento.nombre}</strong>
                    <span>{pub.establecimiento.nombre}</span>
                    <div className="fila-insignias">
                      <InsigniaModalidad modalidad={pub.modalidad} />
                      <InsigniaEstado estado={pub.estadoActual} />
                    </div>
                  </div>
                  <div className="fila-precio">
                    {pub.modalidad === 'donacion' ? (
                      <strong className="precio-gratis">Gratis</strong>
                    ) : (
                      <>
                        {descuentoAplicado(pub) > 0 && <s>{moneda(pub.precioBase)}</s>}
                        <strong>{moneda(precioFinal(pub))}</strong>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="tarjeta-panel">
          <div className="seccion-cabecera">
            <h2 className="titulo-seccion">Notificaciones recientes</h2>
            <Link to="/app/notificaciones" className="enlace-flecha">
              Ver todas
            </Link>
          </div>
          <ul className="lista-simple">
            {avisos.map((n) => (
              <li key={n.id} className={`aviso-fila ${n.leida ? '' : 'sin-leer'}`}>
                <span className="punto-nuevo" aria-hidden="true" />
                <div>
                  <strong>{n.titulo}</strong>
                  <p>{n.mensaje}</p>
                  <small>{hace(n.fecha)}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="aviso-demo-claro">* Las cifras de impacto son datos de demostración.</p>
    </Pagina>
  )
}
