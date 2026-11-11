import { useState } from 'react'
import { FileText, Globe2, Leaf, PackageCheck, Printer, Salad, Scale, Soup } from 'lucide-react'
import { usePlataforma } from '../context/PlataformaContext'
import { CATEGORIAS } from '../types/alimento'
import { kilos, numero } from '../utils/formato'
import Pagina from '../components/ui/Pagina'
import TarjetaEstadistica from '../components/ui/TarjetaEstadistica'
import GraficaBarras from '../components/ui/GraficaBarras'
import GraficaDonut from '../components/ui/GraficaDonut'
import Modal from '../components/ui/Modal'
import NotaDiseno from '../components/ui/NotaDiseno'

const META_KILOS = 30000
const META_ENTREGAS = 3000

// PANTALLA 12: Estadísticas e impacto (datos de demostración).
export default function PaginaEstadisticas() {
  const { registro } = usePlataforma()
  const [reporte, setReporte] = useState(false)

  // Indicadores calculados con fórmulas simples y MARCADAS COMO ESTIMACIÓN de ejemplo.
  const comidas = registro.totalKilosEvitados / 0.4
  const co2 = registro.totalKilosEvitados * 2.5
  const progresoKilos = Math.min(100, (registro.totalKilosEvitados / META_KILOS) * 100)
  const progresoEntregas = Math.min(100, (registro.entregasConfirmadas / META_ENTREGAS) * 100)

  return (
    <Pagina
      titulo="Estadísticas e impacto"
      subtitulo="Lo que la comunidad ha logrado al rescatar alimentos en lugar de desperdiciarlos."
      acciones={
        <button className="btn btn-primario" onClick={() => setReporte(true)}>
          <FileText size={18} /> Generar reporte de impacto
        </button>
      }
    >
      <div className="banner-demo">Datos de demostración: las cifras se sustituirán por las del registro real.</div>

      <div className="rejilla-stats">
        <TarjetaEstadistica icono={<Leaf size={24} />} valor={kilos(registro.totalKilosEvitados)} etiqueta="Total de kilos evitados" tono="verde" />
        <TarjetaEstadistica icono={<Salad size={24} />} valor={numero(registro.totalAlimentosRecuperados)} etiqueta="Alimentos recuperados" tono="naranja" />
        <TarjetaEstadistica icono={<PackageCheck size={24} />} valor={numero(registro.entregasConfirmadas)} etiqueta="Entregas confirmadas" tono="azul" />
        <TarjetaEstadistica icono={<Soup size={24} />} valor={numero(comidas)} etiqueta="Comidas rescatadas" tono="rosa" nota="Estimación de ejemplo" />
      </div>

      <div className="rejilla-graficas">
        <section className="tarjeta-panel">
          <h2 className="titulo-seccion">Recuperación mensual (kg)</h2>
          <GraficaBarras
            datos={registro.historialMensual.map((m) => ({ etiqueta: m.mes, valor: m.kilos }))}
            formato={numero}
          />
        </section>
        <section className="tarjeta-panel">
          <h2 className="titulo-seccion">Alimentos por modalidad</h2>
          <GraficaDonut
            centroValor={numero(registro.totalKilosEvitados)}
            centroEtiqueta="kg"
            datos={[
              { etiqueta: 'Venta', valor: registro.porModalidad.venta, color: 'var(--verde)' },
              { etiqueta: 'Con descuento', valor: registro.porModalidad.descuento, color: 'var(--naranja)' },
              { etiqueta: 'Donación', valor: registro.porModalidad.donacion, color: '#0e8a8a' },
            ]}
          />
        </section>
      </div>

      <div className="rejilla-graficas">
        <section className="tarjeta-panel">
          <h2 className="titulo-seccion">Kilos recuperados por tipo de alimento</h2>
          <GraficaBarras
            horizontal
            datos={CATEGORIAS.map((c) => ({ etiqueta: c, valor: registro.porCategoria[c] }))}
            formato={(n) => kilos(n)}
          />
        </section>

        <section className="tarjeta-panel">
          <h2 className="titulo-seccion">Indicadores de impacto</h2>
          <div className="indicador">
            <div className="indicador-cabecera">
              <span>
                <Scale size={16} /> Meta anual de kilos
              </span>
              <strong>{Math.round(progresoKilos)}%</strong>
            </div>
            <div className="barra-pista">
              <div className="barra-relleno" style={{ width: `${progresoKilos}%` }} />
            </div>
            <small>
              {numero(registro.totalKilosEvitados)} de {numero(META_KILOS)} kg
            </small>
          </div>
          <div className="indicador">
            <div className="indicador-cabecera">
              <span>
                <PackageCheck size={16} /> Meta de entregas
              </span>
              <strong>{Math.round(progresoEntregas)}%</strong>
            </div>
            <div className="barra-pista">
              <div className="barra-relleno naranja" style={{ width: `${progresoEntregas}%` }} />
            </div>
            <small>
              {numero(registro.entregasConfirmadas)} de {numero(META_ENTREGAS)} entregas
            </small>
          </div>
          <div className="indicador-co2">
            <Globe2 size={26} />
            <div>
              <strong>≈ {numero(co2)} kg de CO₂</strong>
              <span>Emisiones evitadas (estimación de ejemplo)</span>
            </div>
          </div>
        </section>
      </div>

      <NotaDiseno patron="RegistroDesperdicioEvitado">
        Estas cifras representan <strong>totalKilosEvitados</strong> y <strong>totalAlimentosRecuperados</strong>. Al
        confirmar una entrega se simula <strong>registrarRecuperacion()</strong>, y el botón de reporte simula{' '}
        <strong>generarReporteImpacto()</strong>.
      </NotaDiseno>

      {reporte && (
        <Modal
          titulo="Reporte de impacto"
          ancho="ancho"
          onCerrar={() => setReporte(false)}
          pie={
            <>
              <button className="btn btn-borde" onClick={() => setReporte(false)}>
                Cerrar
              </button>
              <button className="btn btn-primario" onClick={() => window.print()}>
                <Printer size={18} /> Imprimir
              </button>
            </>
          }
        >
          <p className="aviso-chico">Reporte de demostración generado el {new Date().toLocaleDateString('es-MX')}.</p>
          <ul className="lista-datos reporte">
            <li>
              <span>Total de kilos evitados</span>
              <strong>{kilos(registro.totalKilosEvitados)}</strong>
            </li>
            <li>
              <span>Alimentos recuperados</span>
              <strong>{numero(registro.totalAlimentosRecuperados)}</strong>
            </li>
            <li>
              <span>Entregas confirmadas</span>
              <strong>{numero(registro.entregasConfirmadas)}</strong>
            </li>
            <li>
              <span>Kilos por venta</span>
              <strong>{kilos(registro.porModalidad.venta)}</strong>
            </li>
            <li>
              <span>Kilos con descuento</span>
              <strong>{kilos(registro.porModalidad.descuento)}</strong>
            </li>
            <li>
              <span>Kilos donados</span>
              <strong>{kilos(registro.porModalidad.donacion)}</strong>
            </li>
            <li>
              <span>Emisiones evitadas (estimación)</span>
              <strong>≈ {numero(co2)} kg de CO₂</strong>
            </li>
          </ul>
        </Modal>
      )}
    </Pagina>
  )
}
