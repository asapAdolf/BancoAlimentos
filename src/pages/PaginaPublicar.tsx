import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, Gift, Lock, Percent, Send, ShoppingBag, Trash2, type LucideIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlataforma } from '../context/PlataformaContext'
import {
  CATEGORIAS,
  ETIQUETA_ESTRATEGIA,
  UNIDADES,
  type CategoriaAlimento,
  type EstrategiaDescuento,
  type Modalidad,
  type PublicacionAlimento,
  type UnidadAlimento,
} from '../types/alimento'
import { esEstablecimiento } from '../types/usuario'
import { resolverEstablecimiento } from '../data/establecimientos'
import { fotoPorCategoria } from '../data/fotos'
import { fechaEnDias, moneda } from '../utils/formato'
import { precioFinal } from '../utils/precios'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import NotaDiseno from '../components/ui/NotaDiseno'
import TarjetaAlimento from '../components/catalog/TarjetaAlimento'

interface OpcionModalidad {
  valor: Modalidad
  titulo: string
  texto: string
  icono: LucideIcon
  creador: string
  publicacion: string
}

const opciones: OpcionModalidad[] = [
  {
    valor: 'venta',
    titulo: 'Venta',
    texto: 'Se vende al precio que tú fijas.',
    icono: ShoppingBag,
    creador: 'CreadorVenta',
    publicacion: 'PublicacionVenta',
  },
  {
    valor: 'descuento',
    titulo: 'Descuento',
    texto: 'Se vende con un porcentaje de descuento.',
    icono: Percent,
    creador: 'CreadorDescuento',
    publicacion: 'PublicacionDescuento',
  },
  {
    valor: 'donacion',
    titulo: 'Donación',
    texto: 'Se entrega de forma gratuita.',
    icono: Gift,
    creador: 'CreadorDonacion',
    publicacion: 'PublicacionDonacion',
  },
]

const textoEstrategia: Record<EstrategiaDescuento, string> = {
  caducidad: 'Pensado para alimentos cuya fecha de caducidad está muy cerca.',
  disponibilidad: 'Pensado para cuando hay muchas unidades disponibles que vender.',
}

// PANTALLA 7: Formulario para publicar un alimento (solo establecimientos).
export default function PaginaPublicar() {
  const { usuario } = useAuth()
  const { publicar } = usePlataforma()
  const navegar = useNavigate()

  const hoy = fechaEnDias(0)
  const [modalidad, setModalidad] = useState<Modalidad>('venta')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState<CategoriaAlimento>('Pan y repostería')
  const [cantidad, setCantidad] = useState('')
  const [unidad, setUnidad] = useState<UnidadAlimento>('piezas')
  const [kilosTexto, setKilosTexto] = useState('')
  const [precioBase, setPrecioBase] = useState('')
  const [estrategia, setEstrategia] = useState<EstrategiaDescuento>('caducidad')
  const [porcentaje, setPorcentaje] = useState(30)
  const [fechaCad, setFechaCad] = useState('')
  const [fechaRec, setFechaRec] = useState(hoy)
  const [desde, setDesde] = useState('18:00')
  const [hasta, setHasta] = useState('20:00')
  const [foto, setFoto] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})

  if (!usuario || !esEstablecimiento(usuario.tipo)) {
    return (
      <Pagina titulo="Publicar alimento">
        <EstadoVacio
          icono={<Lock size={34} />}
          titulo="Esta sección es para establecimientos"
          texto="Para publicar alimentos necesitas una cuenta de restaurante, cafetería, panadería o supermercado. Prueba con panaderia@demo.mx."
        >
          <Link to="/app/catalogo" className="btn btn-primario">
            Explorar el catálogo
          </Link>
        </EstadoVacio>
      </Pagina>
    )
  }

  const base = Number(precioBase) || 0
  const opcionActual = opciones.find((o) => o.valor === modalidad)!

  // Publicación de ejemplo para la vista previa en vivo.
  const vistaPrevia: PublicacionAlimento = {
    id: 'vista-previa',
    modalidad,
    estadoActual: 'disponible',
    estrategiaDescuento: modalidad === 'descuento' ? estrategia : undefined,
    precioBase: modalidad === 'donacion' ? 0 : base,
    porcentajeDescuento: modalidad === 'descuento' ? porcentaje : 0,
    fechaPublicacion: '',
    establecimiento: resolverEstablecimiento(usuario),
    horarioRecoleccion: { fecha: fechaRec, desde, hasta },
    alimento: {
      nombre: nombre.trim() || 'Nombre del alimento',
      descripcion,
      categoria,
      unidad,
      cantidadDisponible: Number(cantidad) || 0,
      kilos: Number(kilosTexto) || 0,
      fechaCaducidad: fechaCad || fechaEnDias(1),
      foto: foto || fotoPorCategoria(categoria),
    },
  }
  const final = precioFinal(vistaPrevia)

  const alElegirFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (archivo) setFoto(URL.createObjectURL(archivo))
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const nuevos: Record<string, string> = {}

    if (nombre.trim().length < 3) nuevos.nombre = 'Escribe el nombre del alimento (mínimo 3 letras).'
    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 1) nuevos.cantidad = 'Indica una cantidad entera mayor a 0.'
    if (!(Number(kilosTexto) > 0)) nuevos.kilos = 'Indica los kilos (mayor a 0).'
    if (modalidad !== 'donacion' && !(base > 0)) nuevos.precio = 'Indica un precio base mayor a 0.'
    if (!fechaCad) nuevos.fechaCad = 'Selecciona la fecha de caducidad.'
    else if (fechaCad < hoy) nuevos.fechaCad = 'La fecha de caducidad no puede ser anterior a hoy.'
    if (!fechaRec || fechaRec < hoy) nuevos.fechaRec = 'Selecciona hoy o una fecha futura.'
    if (!desde || !hasta || desde >= hasta) nuevos.horario = 'La hora de inicio debe ser anterior a la de fin.'

    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    publicar(
      {
        nombre,
        descripcion,
        categoria,
        unidad,
        cantidad: Number(cantidad),
        kilos: Number(kilosTexto),
        precioBase: base,
        fechaCaducidad: fechaCad,
        horario: { fecha: fechaRec, desde, hasta },
        modalidad,
        estrategia,
        porcentaje,
        foto,
      },
      usuario,
    )
    navegar('/app/publicaciones')
  }

  return (
    <Pagina
      titulo="Publicar alimento"
      subtitulo="Comparte los alimentos que no vendiste hoy. Elige cómo quieres ofrecerlos y mira la vista previa en vivo."
    >
      <form className="publicar-rejilla" onSubmit={enviar} noValidate>
        <div className="publicar-formulario">
          {/* 1. Modalidad */}
          <section className="tarjeta-panel">
            <h2 className="titulo-seccion">1. ¿Cómo quieres ofrecerlo?</h2>
            <div className="modalidad-opciones" role="radiogroup" aria-label="Modalidad de publicación">
              {opciones.map((o) => {
                const Icono = o.icono
                return (
                  <button
                    type="button"
                    key={o.valor}
                    role="radio"
                    aria-checked={modalidad === o.valor}
                    className={`modalidad-opcion ${modalidad === o.valor ? 'seleccionada' : ''}`}
                    onClick={() => setModalidad(o.valor)}
                  >
                    <Icono size={26} />
                    <strong>{o.titulo}</strong>
                    <span>{o.texto}</span>
                  </button>
                )
              })}
            </div>
            <NotaDiseno patron="Factory Method">
              Al elegir esta modalidad, el creador <strong>{opcionActual.creador}</strong> generaría una{' '}
              <strong>{opcionActual.publicacion}</strong>. Es solo una referencia visual del diagrama.
            </NotaDiseno>
          </section>

          {/* 2. Datos del alimento */}
          <section className="tarjeta-panel">
            <h2 className="titulo-seccion">2. Datos del alimento</h2>

            <div className="campo-form">
              <label htmlFor="nombre">Nombre del alimento</label>
              <input
                id="nombre"
                className={`control ${errores.nombre ? 'con-error' : ''}`}
                placeholder="Ej. Pan artesanal surtido"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errores.nombre && <small className="error-texto">{errores.nombre}</small>}
            </div>

            <div className="campo-form">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                className="control"
                rows={3}
                placeholder="Cuenta qué incluye, cómo se preparó y cualquier detalle útil."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="campo-form">
              <label htmlFor="categoria">Tipo de alimento</label>
              <select
                id="categoria"
                className="control"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaAlimento)}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-form">
              <label>Fotografía</label>
              <div className="subir-foto">
                {foto ? (
                  <div className="foto-elegida">
                    <img src={foto} alt="Vista previa de la fotografía" />
                    <button type="button" className="btn btn-borde btn-chico" onClick={() => setFoto('')}>
                      <Trash2 size={16} /> Quitar foto
                    </button>
                  </div>
                ) : (
                  <label className="zona-subida" htmlFor="foto">
                    <Camera size={26} />
                    <strong>Haz clic para elegir una foto</strong>
                    <span>Si no subes ninguna, se usará una imagen de ejemplo del tipo de alimento.</span>
                  </label>
                )}
                <input id="foto" type="file" accept="image/*" onChange={alElegirFoto} hidden />
              </div>
            </div>

            <div className="rejilla-tres">
              <div className="campo-form">
                <label htmlFor="cantidad">Cantidad disponible</label>
                <input
                  id="cantidad"
                  type="number"
                  min={1}
                  className={`control ${errores.cantidad ? 'con-error' : ''}`}
                  placeholder="12"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
                {errores.cantidad && <small className="error-texto">{errores.cantidad}</small>}
              </div>
              <div className="campo-form">
                <label htmlFor="unidad">Unidad</label>
                <select
                  id="unidad"
                  className="control"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value as UnidadAlimento)}
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="campo-form">
                <label htmlFor="kilos">Kilos (total)</label>
                <input
                  id="kilos"
                  type="number"
                  min={0}
                  step="0.1"
                  className={`control ${errores.kilos ? 'con-error' : ''}`}
                  placeholder="3.5"
                  value={kilosTexto}
                  onChange={(e) => setKilosTexto(e.target.value)}
                />
                {errores.kilos && <small className="error-texto">{errores.kilos}</small>}
              </div>
            </div>

            <div className="campo-form">
              <label htmlFor="fechaCad">Fecha de caducidad</label>
              <input
                id="fechaCad"
                type="date"
                min={hoy}
                className={`control ${errores.fechaCad ? 'con-error' : ''}`}
                value={fechaCad}
                onChange={(e) => setFechaCad(e.target.value)}
              />
              {errores.fechaCad && <small className="error-texto">{errores.fechaCad}</small>}
            </div>
          </section>

          {/* 3. Precio según la modalidad */}
          <section className="tarjeta-panel">
            <h2 className="titulo-seccion">3. Precio</h2>

            {modalidad === 'donacion' ? (
              <div className="precio-donacion">
                <Gift size={28} />
                <div>
                  <small>Precio de la publicación</small>
                  <strong>Gratis</strong>
                  <span>Las donaciones no tienen costo para quien las recibe.</span>
                </div>
              </div>
            ) : (
              <>
                <div className="campo-form">
                  <label htmlFor="precio">Precio base del lote completo (MXN)</label>
                  <input
                    id="precio"
                    type="number"
                    min={0}
                    className={`control ${errores.precio ? 'con-error' : ''}`}
                    placeholder="150"
                    value={precioBase}
                    onChange={(e) => setPrecioBase(e.target.value)}
                  />
                  {errores.precio && <small className="error-texto">{errores.precio}</small>}
                </div>

                {modalidad === 'descuento' && (
                  <>
                    <div className="campo-form">
                      <label htmlFor="estrategia">Tipo de descuento</label>
                      <select
                        id="estrategia"
                        className="control"
                        value={estrategia}
                        onChange={(e) => setEstrategia(e.target.value as EstrategiaDescuento)}
                      >
                        {(Object.keys(ETIQUETA_ESTRATEGIA) as EstrategiaDescuento[]).map((k) => (
                          <option key={k} value={k}>
                            {ETIQUETA_ESTRATEGIA[k]}
                          </option>
                        ))}
                      </select>
                      <small className="ayuda">{textoEstrategia[estrategia]}</small>
                    </div>

                    <div className="campo-form">
                      <label htmlFor="porcentaje">
                        Porcentaje de descuento: <strong>{porcentaje}%</strong>
                      </label>
                      <input
                        id="porcentaje"
                        type="range"
                        min={5}
                        max={90}
                        step={5}
                        value={porcentaje}
                        onChange={(e) => setPorcentaje(Number(e.target.value))}
                      />
                    </div>

                    <NotaDiseno patron="Strategy">
                      Este tipo de descuento corresponde a la estrategia{' '}
                      <strong>{estrategia === 'caducidad' ? 'DescuentoPorCaducidad' : 'DescuentoPorDisponibilidad'}</strong>.
                      Aquí el porcentaje lo eliges tú como ejemplo; el cálculo real lo definirá el Back-End.
                    </NotaDiseno>
                  </>
                )}

                <div className="resumen-precio">
                  <div>
                    <small>Precio base</small>
                    <strong>{moneda(base)}</strong>
                  </div>
                  {modalidad === 'descuento' && (
                    <div>
                      <small>Descuento</small>
                      <strong className="texto-naranja">-{porcentaje}%</strong>
                    </div>
                  )}
                  <div>
                    <small>Precio final</small>
                    <strong className="texto-verde">{moneda(final)}</strong>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* 4. Recolección */}
          <section className="tarjeta-panel">
            <h2 className="titulo-seccion">4. Horario de recolección</h2>
            <div className="rejilla-tres">
              <div className="campo-form">
                <label htmlFor="fechaRec">Día</label>
                <input
                  id="fechaRec"
                  type="date"
                  min={hoy}
                  className={`control ${errores.fechaRec ? 'con-error' : ''}`}
                  value={fechaRec}
                  onChange={(e) => setFechaRec(e.target.value)}
                />
                {errores.fechaRec && <small className="error-texto">{errores.fechaRec}</small>}
              </div>
              <div className="campo-form">
                <label htmlFor="desde">Desde</label>
                <input id="desde" type="time" className="control" value={desde} onChange={(e) => setDesde(e.target.value)} />
              </div>
              <div className="campo-form">
                <label htmlFor="hasta">Hasta</label>
                <input id="hasta" type="time" className="control" value={hasta} onChange={(e) => setHasta(e.target.value)} />
              </div>
            </div>
            {errores.horario && <small className="error-texto">{errores.horario}</small>}

            <NotaDiseno patron="Observer">
              Al publicar, <strong>GestorNotificaciones</strong> avisaría a las <strong>UsuarioOrganizacion</strong>{' '}
              suscritas. En esta demostración solo se genera una notificación de ejemplo.
            </NotaDiseno>

            <button type="submit" className="btn btn-primario btn-completo btn-grande">
              <Send size={18} /> Publicar alimento
            </button>
          </section>
        </div>

        <aside className="publicar-vista">
          <h2 className="titulo-seccion">Vista previa</h2>
          <TarjetaAlimento pub={vistaPrevia} vistaPrevia />
          <p className="ayuda">Así verán tu publicación las personas y organizaciones en el catálogo.</p>
        </aside>
      </form>
    </Pagina>
  )
}
