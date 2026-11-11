interface Dato {
  etiqueta: string
  valor: number
}

interface Props {
  datos: Dato[]
  horizontal?: boolean
  alto?: number
  formato?: (n: number) => string
}

const formatoPorDefecto = (n: number) => Math.round(n).toLocaleString('es-MX')

// Gráfica de barras hecha solo con HTML y CSS (sin librerías externas).
export default function GraficaBarras({ datos, horizontal = false, alto = 220, formato = formatoPorDefecto }: Props) {
  const maximo = Math.max(...datos.map((d) => d.valor), 1)

  if (horizontal) {
    return (
      <div className="barras-h">
        {datos.map((d) => (
          <div className="barra-fila" key={d.etiqueta}>
            <span className="barra-fila-etiqueta">{d.etiqueta}</span>
            <div className="barra-pista">
              <div className="barra-relleno" style={{ width: `${(d.valor / maximo) * 100}%` }} />
            </div>
            <span className="barra-fila-valor">{formato(d.valor)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="barras-v" style={{ height: alto }}>
      {datos.map((d) => (
        <div className="barra-col" key={d.etiqueta}>
          <div className="barra-zona">
            <div className="barra" style={{ height: `${(d.valor / maximo) * 100}%` }}>
              <span className="barra-valor">{formato(d.valor)}</span>
            </div>
          </div>
          <span className="barra-etiqueta">{d.etiqueta}</span>
        </div>
      ))}
    </div>
  )
}
