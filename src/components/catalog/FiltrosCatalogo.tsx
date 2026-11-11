import { Search } from 'lucide-react'
import {
  CATEGORIAS,
  ESTADOS,
  ETIQUETA_ESTADO,
  ETIQUETA_MODALIDAD,
  MODALIDADES,
  ZONAS,
} from '../../types/alimento'
import { FILTROS_INICIALES, PRECIO_MAXIMO, type Filtros } from '../../types/filtros'
import { moneda } from '../../utils/formato'

interface Props {
  filtros: Filtros
  onCambiar: (nuevos: Filtros) => void
  total: number
}

export default function FiltrosCatalogo({ filtros, onCambiar, total }: Props) {
  // Actualiza solo el filtro que cambió y conserva los demás.
  const cambiar = <K extends keyof Filtros>(clave: K, valor: Filtros[K]) =>
    onCambiar({ ...filtros, [clave]: valor })

  return (
    <section className="filtros-caja" aria-label="Filtros del catálogo">
      <div className="buscador">
        <Search size={18} />
        <input
          type="search"
          placeholder="Busca por alimento, establecimiento o tipo..."
          value={filtros.busqueda}
          onChange={(e) => cambiar('busqueda', e.target.value)}
        />
      </div>

      <div className="filtros-rejilla">
        <label className="etiqueta-filtro">
          Tipo de alimento
          <select
            className="control"
            value={filtros.categoria}
            onChange={(e) => cambiar('categoria', e.target.value as Filtros['categoria'])}
          >
            <option value="todas">Todos</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="etiqueta-filtro">
          Modalidad
          <select
            className="control"
            value={filtros.modalidad}
            onChange={(e) => cambiar('modalidad', e.target.value as Filtros['modalidad'])}
          >
            <option value="todas">Todas</option>
            {MODALIDADES.map((m) => (
              <option key={m} value={m}>
                {ETIQUETA_MODALIDAD[m]}
              </option>
            ))}
          </select>
        </label>

        <label className="etiqueta-filtro">
          Ubicación (zona)
          <select
            className="control"
            value={filtros.zona}
            onChange={(e) => cambiar('zona', e.target.value)}
          >
            <option value="todas">Todas las zonas</option>
            {ZONAS.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>

        <label className="etiqueta-filtro">
          Disponibilidad
          <select
            className="control"
            value={filtros.disponibilidad}
            onChange={(e) => cambiar('disponibilidad', e.target.value as Filtros['disponibilidad'])}
          >
            <option value="todas">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ETIQUETA_ESTADO[e]}
              </option>
            ))}
          </select>
        </label>

        <label className="etiqueta-filtro">
          Precio máximo:{' '}
          <strong>{filtros.precioMax >= PRECIO_MAXIMO ? 'Sin límite' : moneda(filtros.precioMax)}</strong>
          <input
            type="range"
            min={0}
            max={PRECIO_MAXIMO}
            step={10}
            value={filtros.precioMax}
            onChange={(e) => cambiar('precioMax', Number(e.target.value))}
          />
        </label>

        <label className="etiqueta-filtro">
          Ordenar por
          <select
            className="control"
            value={filtros.orden}
            onChange={(e) => cambiar('orden', e.target.value as Filtros['orden'])}
          >
            <option value="recientes">Más recientes</option>
            <option value="caducidad">Caducidad más próxima</option>
            <option value="precio">Precio más bajo</option>
          </select>
        </label>
      </div>

      <div className="filtros-pie">
        <span>
          <strong>{total}</strong> {total === 1 ? 'resultado' : 'resultados'}
        </span>
        <button className="btn btn-borde btn-chico" onClick={() => onCambiar(FILTROS_INICIALES)}>
          Limpiar filtros
        </button>
      </div>
    </section>
  )
}
