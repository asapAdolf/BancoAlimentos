import { Link } from 'react-router-dom'
import { Clock, Package, Scale, Store } from 'lucide-react'
import type { PublicacionAlimento } from '../../types/alimento'
import { ETIQUETA_ESTRATEGIA } from '../../types/alimento'
import { useBase } from '../../hooks/useBase'
import { descuentoAplicado, precioFinal } from '../../utils/precios'
import { diasParaCaducar, fechaCorta, kilos, moneda, textoDias } from '../../utils/formato'
import FotoAlimento from '../ui/FotoAlimento'
import { InsigniaEstado, InsigniaModalidad } from '../ui/Insignias'

interface Props {
  pub: PublicacionAlimento
  vistaPrevia?: boolean
}

export default function TarjetaAlimento({ pub, vistaPrevia = false }: Props) {
  const { base } = useBase()
  const { alimento, establecimiento } = pub
  const final = precioFinal(pub)
  const descuento = descuentoAplicado(pub)
  const dias = diasParaCaducar(alimento.fechaCaducidad)

  return (
    <article className="tarjeta-alimento">
      <div className="tarjeta-foto">
        <FotoAlimento src={alimento.foto} alt={alimento.nombre} />
        <div className="tarjeta-sup-izq">
          <InsigniaModalidad modalidad={pub.modalidad} />
        </div>
        <div className="tarjeta-sup-der">
          <InsigniaEstado estado={pub.estadoActual} />
        </div>
        {descuento > 0 && <span className="cinta-descuento">-{descuento}%</span>}
      </div>

      <div className="tarjeta-cuerpo">
        <h3>{alimento.nombre}</h3>
        <p className="tarjeta-est">
          <Store size={14} /> {establecimiento.nombre} · {establecimiento.zona}
        </p>

        <div className="precio-bloque">
          {pub.modalidad === 'donacion' ? (
            <strong className="precio-gratis">Gratis</strong>
          ) : (
            <>
              {descuento > 0 && <s>{moneda(pub.precioBase)}</s>}
              <strong>{moneda(final)}</strong>
              <small>lote completo</small>
            </>
          )}
        </div>
        {pub.modalidad === 'descuento' && pub.estrategiaDescuento && (
          <small className="estrategia">{ETIQUETA_ESTRATEGIA[pub.estrategiaDescuento]}</small>
        )}

        <ul className="datos-mini">
          <li>
            <Package size={15} /> {alimento.cantidadDisponible} {alimento.unidad}
          </li>
          <li>
            <Scale size={15} /> {kilos(alimento.kilos)}
          </li>
          <li className={dias <= 1 ? 'urgente' : ''}>
            <Clock size={15} /> {textoDias(dias)} · {fechaCorta(alimento.fechaCaducidad)}
          </li>
        </ul>

        {vistaPrevia ? (
          <span className="btn btn-primario btn-completo btn-falso">Ver detalles</span>
        ) : (
          <Link to={`${base}/catalogo/${pub.id}`} className="btn btn-primario btn-completo">
            Ver detalles
          </Link>
        )}
      </div>
    </article>
  )
}
