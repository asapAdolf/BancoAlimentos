interface Segmento {
  etiqueta: string
  valor: number
  color: string
}

interface Props {
  datos: Segmento[]
  centroValor: string
  centroEtiqueta: string
}

// Gráfica circular (dona) hecha con SVG.
export default function GraficaDonut({ datos, centroValor, centroEtiqueta }: Props) {
  const total = datos.reduce((suma, d) => suma + d.valor, 0) || 1
  const trazos = datos.reduce<{ etiqueta: string; color: string; porcentaje: number; offset: number }[]>(
    (lista, d) => {
      const previo = lista.length > 0 ? 25 - lista[lista.length - 1].offset + lista[lista.length - 1].porcentaje : 0
      const porcentaje = (d.valor / total) * 100
      return [...lista, { etiqueta: d.etiqueta, color: d.color, porcentaje, offset: 25 - previo }]
    },
    [],
  )

  return (
    <div className="donut-caja">
      <div className="donut">
        <svg viewBox="0 0 42 42" role="img" aria-label="Distribución por modalidad">
          <circle className="donut-fondo" cx="21" cy="21" r="15.9155" fill="none" strokeWidth="6" />
          {trazos.map((t) => (
            <circle
              key={t.etiqueta}
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke={t.color}
              strokeWidth="6"
              strokeDasharray={`${t.porcentaje} ${100 - t.porcentaje}`}
              strokeDashoffset={t.offset}
            />
          ))}
        </svg>
        <div className="donut-centro">
          <strong>{centroValor}</strong>
          <span>{centroEtiqueta}</span>
        </div>
      </div>
      <ul className="donut-leyenda">
        {datos.map((d) => (
          <li key={d.etiqueta}>
            <span className="donut-color" style={{ background: d.color }} />
            <span>{d.etiqueta}</span>
            <strong>{Math.round((d.valor / total) * 100)}%</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
