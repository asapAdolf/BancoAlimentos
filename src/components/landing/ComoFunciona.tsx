import { Store, Tag, CalendarCheck, PackageCheck } from 'lucide-react'

const pasos = [
  {
    icono: <Store size={28} />,
    titulo: 'Publica',
    texto: 'El establecimiento registra los alimentos sobrantes: en venta, con descuento o como donación.',
  },
  {
    icono: <Tag size={28} />,
    titulo: 'Descubre',
    texto: 'Personas y organizaciones exploran el catálogo y filtran por tipo, precio y ubicación.',
  },
  {
    icono: <CalendarCheck size={28} />,
    titulo: 'Reserva',
    texto: 'Reservas la cantidad que necesitas y consultas el horario y lugar de recolección.',
  },
  {
    icono: <PackageCheck size={28} />,
    titulo: 'Recoge',
    texto: 'Se confirma la entrega y se suma al registro de desperdicio evitado.',
  },
]

export default function ComoFunciona() {
  return (
    <section className="seccion" id="como-funciona">
      <div className="contenedor">
        <div className="seccion-titulo">
          <h2>¿Cómo funciona?</h2>
          <p>Cuatro pasos sencillos para rescatar alimentos.</p>
        </div>
        <div className="pasos">
          {pasos.map((paso, indice) => (
            <article className="paso" key={paso.titulo}>
              <span className="paso-numero">{indice + 1}</span>
              <div className="icono-circulo">{paso.icono}</div>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
