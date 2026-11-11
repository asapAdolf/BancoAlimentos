import { Check } from 'lucide-react'
import { ESTADOS, ETIQUETA_ESTADO, type EstadoPublicacion } from '../../types/alimento'

// Muestra visualmente el ciclo de una publicación: Disponible → Reservado → Entregado.
export default function LineaEstados({ estado }: { estado: EstadoPublicacion }) {
  const indiceActual = ESTADOS.indexOf(estado)

  return (
    <ol className="linea-estados" aria-label="Ciclo de la publicación">
      {ESTADOS.map((e, i) => {
        const clase = i < indiceActual ? 'hecho' : i === indiceActual ? 'actual' : ''
        return (
          <li key={e} className={clase}>
            <span className="linea-punto">{i < indiceActual ? <Check size={14} /> : i + 1}</span>
            <span className="linea-texto">{ETIQUETA_ESTADO[e]}</span>
          </li>
        )
      })}
    </ol>
  )
}
