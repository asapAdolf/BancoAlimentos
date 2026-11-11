import { impactoDemo } from '../../data/impactoDemo'

export default function Impacto() {
  const estadisticas = [
    { valor: impactoDemo.totalKilosEvitados.toLocaleString('es-MX'), etiqueta: 'kg de alimento rescatado' },
    { valor: impactoDemo.totalAlimentosRecuperados.toLocaleString('es-MX'), etiqueta: 'alimentos recuperados' },
    { valor: impactoDemo.establecimientosParticipantes, etiqueta: 'establecimientos' },
    { valor: impactoDemo.organizacionesBeneficiadas, etiqueta: 'organizaciones beneficiadas' },
  ]

  return (
    <section className="seccion impacto" id="impacto">
      <div className="contenedor">
        <div className="seccion-titulo">
          <h2>Nuestro impacto</h2>
          <p>Cada reservación suma al registro de desperdicio evitado.</p>
        </div>
        <div className="estadisticas">
          {estadisticas.map((e) => (
            <div className="estadistica" key={e.etiqueta}>
              <strong>{e.valor}</strong>
              <span>{e.etiqueta}</span>
            </div>
          ))}
        </div>
        <p className="aviso-demo">* Datos de demostración.</p>
      </div>
    </section>
  )
}
