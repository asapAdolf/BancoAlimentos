import { Link } from 'react-router-dom'
import { Sprout, Search, PlusCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero">
      <div className="contenedor hero-interior">
        <div>
          <span className="hero-etiqueta">
            <Sprout size={16} /> Menos desperdicio, más comunidad
          </span>
          <h1>
            Dale una segunda oportunidad a los <span>alimentos</span>
          </h1>
          <p>
            Restaurantes, cafeterías, panaderías y supermercados publican los
            alimentos que no vendieron en el día. Tú los compras con descuento
            o los recibes gratis, y juntos evitamos el desperdicio.
          </p>
          <div className="hero-botones">
            <Link to="/catalogo" className="btn btn-primario">
              <Search size={18} /> Explorar alimentos
            </Link>
            <Link to="/app/publicar" className="btn btn-secundario">
              <PlusCircle size={18} /> Publicar alimentos
            </Link>
          </div>
        </div>

        <div className="hero-imagen">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
            alt="Frutas y verduras frescas"
          />
          <div className="hero-tarjeta">
            <span className="icono-circulo" style={{ margin: 0, width: 44, height: 44 }}>
              <Sprout size={22} />
            </span>
            <div>
              <strong>+12,000 kg</strong>
              <small>de alimentos rescatados</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
