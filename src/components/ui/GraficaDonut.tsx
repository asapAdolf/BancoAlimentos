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
  let acumulado = 0

  return (
    <div className="donut-caja">
      <div className="donut">
        <svg viewBox="0 0 42 42" role="img" aria-label="Distribución por modalidad">
          <circle className="donut-fondo" cx="21" cy="21" r="15.9155" fill="none" strokeWidth="6" />
          {datos.map((d) => {
            const porcentaje = (d.valor / total) * 100
            const segmento = (
              <circle
                key={d.etiqueta}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                stroke={d.color}
                strokeWidth="6"
                strokeDasharray={`${porcentaje} ${100 - porcentaje}`}
                strokeDashoffset={25 - acumulado}
              />
            )
            acumulado += porcentaje
            return segmento
          })}
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
