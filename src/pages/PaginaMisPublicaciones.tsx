import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Eye, Lock, PackageCheck, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlataforma } from '../context/PlataformaContext'
import { ESTADOS, ETIQUETA_ESTADO, type EstadoPublicacion, type PublicacionAlimento } from '../types/alimento'
import { esEstablecimiento } from '../types/usuario'
import { nombreDeEstablecimiento } from '../data/establecimientos'
import { descuentoAplicado, precioFinal } from '../utils/precios'
import { fechaCorta, moneda } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import FotoAlimento from '../components/ui/FotoAlimento'
import Modal from '../components/ui/Modal'
import NotaDiseno from '../components/ui/NotaDiseno'
import LineaEstados from '../components/ui/LineaEstados'
import { InsigniaEstado, InsigniaModalidad } from '../components/ui/Insignias'

type FiltroEstado = EstadoPublicacion | 'todas'

// Formulario del modal de edición. Vive en su propio componente para que
// sus campos arranquen con los datos de la publicación elegida.
function FormularioEdicion({
  pub,
  onGuardar,
  onCerrar,
}: {
  pub: PublicacionAlimento
  onGuardar: (cambios: { nombre: string; descripcion: string; cantidad: number; precioBase: number; porcentaje: number }) => void
  onCerrar: () => void
}) {
  const [nombre, setNombre] = useState(pub.alimento.nombre)
  const [descripcion, setDescripcion] = useState(pub.alimento.descripcion)
  const [cantidad, setCantidad] = useState(String(pub.alimento.cantidadDisponible))
  const [precio, setPrecio] = useState(String(pub.precioBase))
  const [porcentaje, setPorcentaje] = useState(pub.porcentajeDescuento)
  const [error, setError] = useState('')

  const guardar = (e: FormEvent) => {
    e.preventDefault()
    if (nombre.trim().length < 3) return setError('El nombre debe tener al menos 3 letras.')
    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 1) return setError('La cantidad debe ser un número entero mayor a 0.')
    if (pub.modalidad !== 'donacion' && !(Number(precio) > 0)) return setError('El precio base debe ser mayor a 0.')
    onGuardar({
      nombre,
      descripcion,
      cantidad: Number(cantidad),
      precioBase: Number(precio),
      porcentaje,
    })
  }

  return (
    <form onSubmit={guardar} noValidate>
      <div className="campo-form">
        <label htmlFor="e-nombre">Nombre</label>
        <input id="e-nombre" className="control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="campo-form">
        <label htmlFor="e-desc">Descripción</label>
        <textarea id="e-desc" className="control" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>
      <div className="rejilla-dos-form">
        <div className="campo-form">
          <label htmlFor="e-cant">Cantidad disponible</label>
          <input id="e-cant" type="number" min={1} className="control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </div>
        {pub.modalidad !== 'donacion' && (
          <div className="campo-form">
            <label htmlFor="e-precio">Precio base (MXN)</label>
            <input id="e-precio" type="number" min={0} className="control" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
        )}
      </div>
      {pub.modalidad === 'descuento' && (
        <div className="campo-form">
          <label htmlFor="e-pct">
            Porcentaje de descuento: <strong>{porcentaje}%</strong>
          </label>
          <input id="e-pct" type="range" min={5} max={90} step={5} value={porcentaje} onChange={(e) => setPorcentaje(Number(e.target.value))} />
        </div>
      )}
      {error && <div className="alerta-error">{error}</div>}
      <div className="modal-pie sin-borde">
        <button type="button" className="btn btn-borde" onClick={onCerrar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primario">
          Guardar cambios
        </button>
      </div>
    </form>
  )
}

// PANTALLA 8: Mis publicaciones (solo establecimientos).
export default function PaginaMisPublicaciones() {
  const { usuario } = useAuth()
  const { publicaciones, cancelarPublicacion, editarPublicacion, confirmarEntrega } = usePlataforma()
  const [filtro, setFiltro] = useState<FiltroEstado>('todas')
  const [editando, setEditando] = useState<PublicacionAlimento | null>(null)
  const [cancelando, setCancelando] = useState<PublicacionAlimento | null>(null)

  if (!usuario || !esEstablecimiento(usuario.tipo)) {
    return (
      <Pagina titulo="Mis publicaciones">
        <EstadoVacio
          icono={<Lock size={34} />}
          titulo="Esta sección es para establecimientos"
          texto="Aquí los negocios administran los alimentos que publican. Prueba con panaderia@demo.mx."
        >
          <Link to="/app/catalogo" className="btn btn-primario">
            Explorar el catálogo
          </Link>
        </EstadoVacio>
      </Pagina>
    )
  }

  const miNombre = nombreDeEstablecimiento(usuario).toLowerCase()
  const mias = publicaciones.filter((p) => p.establecimiento.nombre.toLowerCase() === miNombre)
  const visibles = filtro === 'todas' ? mias : mias.filter((p) => p.estadoActual === filtro)
  const contar = (e: EstadoPublicacion) => mias.filter((p) => p.estadoActual === e).length

  return (
    <Pagina
      titulo="Mis publicaciones"
      subtitulo="Consulta, edita o cancela los alimentos que publicaste."
      acciones={
        <Link to="/app/publicar" className="btn btn-secundario">
          <PlusCircle size={18} /> Nueva publicación
        </Link>
      }
    >
      <section className="tarjeta-panel ciclo-vida">
        <div>
          <h2 className="titulo-seccion">Ciclo de una publicación</h2>
          <p className="ayuda">
            <strong>Disponible:</strong> se puede editar y cancelar. <strong>Reservado:</strong> solo se puede confirmar
            la entrega. <strong>Entregado:</strong> solo consulta.
          </p>
        </div>
        <LineaEstados estado="reservado" />
      </section>
      <NotaDiseno patron="State">
        Los botones se habilitan según el estado (<strong>EstadoDisponible</strong>, <strong>EstadoReservado</strong>,{' '}
        <strong>EstadoEntregado</strong>). Estas reglas son un ejemplo visual: ajústalas a las que defina tu equipo.
      </NotaDiseno>

      {mias.length === 0 ? (
        <EstadoVacio
          icono={<ClipboardList size={34} />}
          titulo="Aún no tienes publicaciones"
          texto="Publica tus primeros alimentos para que personas y organizaciones puedan reservarlos."
        >
          <Link to="/app/publicar" className="btn btn-secundario">
            Publicar alimento
          </Link>
        </EstadoVacio>
      ) : (
        <>
          <div className="chips" role="tablist" aria-label="Filtrar por estado">
            <button className={`chip ${filtro === 'todas' ? 'activo' : ''}`} onClick={() => setFiltro('todas')}>
              Todas ({mias.length})
            </button>
            {ESTADOS.map((e) => (
              <button key={e} className={`chip ${filtro === e ? 'activo' : ''}`} onClick={() => setFiltro(e)}>
                {ETIQUETA_ESTADO[e]} ({contar(e)})
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <EstadoVacio
              icono={<ClipboardList size={34} />}
              titulo="Sin publicaciones en este estado"
              texto="Cambia el filtro para ver el resto."
            />
          ) : (
            <div className="tabla-caja">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Alimento</th>
                    <th>Modalidad</th>
                    <th>Cantidad</th>
                    <th>Caducidad</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((p) => {
                    const disponible = p.estadoActual === 'disponible'
                    const reservado = p.estadoActual === 'reservado'
                    return (
                      <tr key={p.id}>
                        <td data-etiqueta="Alimento">
                          <div className="celda-alimento">
                            <FotoAlimento src={p.alimento.foto} alt={p.alimento.nombre} className="mini-foto" />
                            <strong>{p.alimento.nombre}</strong>
                          </div>
                        </td>
                        <td data-etiqueta="Modalidad">
                          <InsigniaModalidad modalidad={p.modalidad} />
                        </td>
                        <td data-etiqueta="Cantidad">
                          {p.alimento.cantidadDisponible} {p.alimento.unidad}
                        </td>
                        <td data-etiqueta="Caducidad">{fechaCorta(p.alimento.fechaCaducidad)}</td>
                        <td data-etiqueta="Precio">
                          {p.modalidad === 'donacion' ? (
                            <strong className="precio-gratis">Gratis</strong>
                          ) : (
                            <>
                              {descuentoAplicado(p) > 0 && <s className="precio-tachado">{moneda(p.precioBase)}</s>}{' '}
                              <strong>{moneda(precioFinal(p))}</strong>
                            </>
                          )}
                        </td>
                        <td data-etiqueta="Estado">
                          <InsigniaEstado estado={p.estadoActual} />
                        </td>
                        <td data-etiqueta="Acciones">
                          <div className="acciones">
                            <Link to={`/app/catalogo/${p.id}`} className="btn-icono" title="Consultar" aria-label="Consultar">
                              <Eye size={18} />
                            </Link>
                            <button
                              className="btn-icono"
                              title={disponible ? 'Editar' : 'Solo se puede editar si está disponible'}
                              aria-label="Editar"
                              disabled={!disponible}
                              onClick={() => setEditando(p)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              className="btn-icono peligro"
                              title={disponible ? 'Cancelar publicación' : 'Solo se puede cancelar si está disponible'}
                              aria-label="Cancelar publicación"
                              disabled={!disponible}
                              onClick={() => setCancelando(p)}
                            >
                              <Trash2 size={18} />
                            </button>
                            {reservado && (
                              <button
                                className="btn-icono exito"
                                title="Confirmar entrega"
                                aria-label="Confirmar entrega"
                                onClick={() => confirmarEntrega(p.id)}
                              >
                                <PackageCheck size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {editando && (
        <Modal titulo={`Editar "${editando.alimento.nombre}"`} onCerrar={() => setEditando(null)}>
          <FormularioEdicion
            pub={editando}
            onCerrar={() => setEditando(null)}
            onGuardar={(cambios) => {
              editarPublicacion(editando.id, cambios)
              setEditando(null)
            }}
          />
        </Modal>
      )}

      {cancelando && (
        <Modal
          titulo="Cancelar publicación"
          onCerrar={() => setCancelando(null)}
          pie={
            <>
              <button className="btn btn-borde" onClick={() => setCancelando(null)}>
                Mejor no
              </button>
              <button
                className="btn btn-peligro"
                onClick={() => {
                  cancelarPublicacion(cancelando.id)
                  setCancelando(null)
                }}
              >
                Sí, cancelar
              </button>
            </>
          }
        >
          <p>
            ¿Seguro que quieres cancelar <strong>{cancelando.alimento.nombre}</strong>? Dejará de aparecer en el
            catálogo.
          </p>
        </Modal>
      )}
    </Pagina>
  )
}
