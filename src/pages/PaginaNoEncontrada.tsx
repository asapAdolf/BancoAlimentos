import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import EstadoVacio from '../components/ui/EstadoVacio'

export default function PaginaNoEncontrada() {
  return (
    <section className="provisional">
      <EstadoVacio
        icono={<Compass size={34} />}
        titulo="Página no encontrada"
        texto="La dirección que escribiste no existe en la plataforma."
      >
        <Link to="/" className="btn btn-primario">
          Volver al inicio
        </Link>
      </EstadoVacio>
    </section>
  )
}
