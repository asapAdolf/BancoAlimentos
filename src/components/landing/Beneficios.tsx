import { Wallet, HeartHandshake, Globe2, Bell, MapPin, BarChart3 } from 'lucide-react'

const beneficios = [
  {
    icono: <Wallet size={26} />,
    titulo: 'Ahorra dinero',
    texto: 'Alimentos de calidad con descuentos que aumentan conforme se acerca su caducidad.',
  },
  {
    icono: <HeartHandshake size={26} />,
    titulo: 'Ayuda a quien lo necesita',
    texto: 'Las donaciones llegan a organizaciones sociales y personas de la comunidad.',
  },
  {
    icono: <Globe2 size={26} />,
    titulo: 'Cuida el planeta',
    texto: 'Cada kilo rescatado reduce residuos y el impacto ambiental de producir de nuevo.',
  },
  {
    icono: <Bell size={26} />,
    titulo: 'Entérate al instante',
    texto: 'Recibe avisos cuando se publique un alimento nuevo o un descuento.',
  },
  {
    icono: <MapPin size={26} />,
    titulo: 'Recolección clara',
    texto: 'Consulta dirección, horario y ruta para recoger tu reservación.',
  },
  {
    icono: <BarChart3 size={26} />,
    titulo: 'Impacto medible',
    texto: 'Visualiza cuántos kilos se han evitado gracias a la comunidad.',
  },
]

export default function Beneficios() {
  return (
    <section className="seccion beneficios-fondo" id="beneficios">
      <div className="contenedor">
        <div className="seccion-titulo">
          <h2>Beneficios para todos</h2>
          <p>Una plataforma donde todos ganan: negocios, comunidad y medio ambiente.</p>
        </div>
        <div className="beneficios">
          {beneficios.map((b) => (
            <article className="beneficio" key={b.titulo}>
              <div className="icono-circulo">{b.icono}</div>
              <h3>{b.titulo}</h3>
              <p>{b.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
