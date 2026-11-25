import { usePlataforma } from '../../context/PlataformaContext'

export default function Impacto() {
  const { registro, publicaciones } = usePlataforma()
  const establecimientosActivos = new Set(publicaciones.map((p) => p.establecimiento.id)).size

  const estadisticas = [
    { valor: registro.totalKilosEvitados.toLocaleString('es-MX'), etiqueta: 'kg de alimento rescatado' },
    { valor: registro.totalAlimentosRecuperados.toLocaleString('es-MX'), etiqueta: 'alimentos recuperados' },
    { valor: establecimientosActivos.toLocaleString('es-MX'), etiqueta: 'establecimientos activos' },
    { valor: registro.entregasConfirmadas.toLocaleString('es-MX'), etiqueta: 'entregas confirmadas' },
  ]

  return (
    <section className="seccion impacto" id="impacto">
      <div className="contenedor">
        <div className="seccion-titulo">
          <h2>Nuestro impacto</h2>
          <p>Cada reservación entregada suma al registro real de desperdicio evitado.</p>
        </div>
        <div className="estadisticas">
          {estadisticas.map((e) => (
            <div className="estadistica" key={e.etiqueta}>
              <strong>{e.valor}</strong>
              <span>{e.etiqueta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
