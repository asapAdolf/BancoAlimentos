import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { usePlataforma } from '../context/PlataformaContext'
import { FILTROS_INICIALES, PRECIO_MAXIMO, type Filtros } from '../types/filtros'
import { precioFinal } from '../utils/precios'
import { diasParaCaducar } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import EstadoVacio from '../components/ui/EstadoVacio'
import FiltrosCatalogo from '../components/catalog/FiltrosCatalogo'
import TarjetaAlimento from '../components/catalog/TarjetaAlimento'

// PANTALLA 5: Catálogo de alimentos con buscador y filtros.
export default function PaginaCatalogo() {
  const { publicaciones } = usePlataforma()
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES)

  const resultados = useMemo(() => {
    const texto = filtros.busqueda.trim().toLowerCase()

    const filtradas = publicaciones.filter((p) => {
      if (texto) {
        const coincide =
          p.alimento.nombre.toLowerCase().includes(texto) ||
          p.establecimiento.nombre.toLowerCase().includes(texto) ||
          p.alimento.categoria.toLowerCase().includes(texto)
        if (!coincide) return false
      }
      if (filtros.categoria !== 'todas' && p.alimento.categoria !== filtros.categoria) return false
      if (filtros.modalidad !== 'todas' && p.modalidad !== filtros.modalidad) return false
      if (filtros.zona !== 'todas' && p.establecimiento.zona !== filtros.zona) return false
      if (filtros.disponibilidad !== 'todas' && p.estadoActual !== filtros.disponibilidad) return false
      if (filtros.precioMax < PRECIO_MAXIMO && precioFinal(p) > filtros.precioMax) return false
      return true
    })

    // El orden "recientes" respeta el orden original (lo más nuevo primero).
    if (filtros.orden === 'caducidad') {
      return [...filtradas].sort(
        (a, b) => diasParaCaducar(a.alimento.fechaCaducidad) - diasParaCaducar(b.alimento.fechaCaducidad),
      )
    }
    if (filtros.orden === 'precio') {
      return [...filtradas].sort((a, b) => precioFinal(a) - precioFinal(b))
    }
    return filtradas
  }, [publicaciones, filtros])

  return (
    <Pagina
      titulo="Catálogo de alimentos"
      subtitulo="Alimentos aptos para el consumo que no se vendieron hoy. Reserva el que necesites y recógelo en el horario indicado."
    >
      <FiltrosCatalogo filtros={filtros} onCambiar={setFiltros} total={resultados.length} />

      {resultados.length > 0 ? (
        <div className="cuadricula-alimentos">
          {resultados.map((pub) => (
            <TarjetaAlimento key={pub.id} pub={pub} />
          ))}
        </div>
      ) : (
        <EstadoVacio
          icono={<SearchX size={34} />}
          titulo="No encontramos alimentos con esos filtros"
          texto="Prueba con otra búsqueda o limpia los filtros para ver todo el catálogo."
        >
          <button className="btn btn-primario" onClick={() => setFiltros(FILTROS_INICIALES)}>
            Limpiar filtros
          </button>
        </EstadoVacio>
      )}
    </Pagina>
  )
}
