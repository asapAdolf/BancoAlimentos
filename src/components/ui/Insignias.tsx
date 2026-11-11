import { Gift, Percent, ShoppingBag } from 'lucide-react'
import {
  ETIQUETA_ESTADO,
  ETIQUETA_MODALIDAD,
  type EstadoPublicacion,
  type Modalidad,
} from '../../types/alimento'

export function InsigniaEstado({ estado }: { estado: EstadoPublicacion }) {
  return <span className={`insignia estado-${estado}`}>{ETIQUETA_ESTADO[estado]}</span>
}

export function InsigniaModalidad({ modalidad }: { modalidad: Modalidad }) {
  const Icono = modalidad === 'venta' ? ShoppingBag : modalidad === 'descuento' ? Percent : Gift
  return (
    <span className={`insignia modalidad-${modalidad}`}>
      <Icono size={13} /> {ETIQUETA_MODALIDAD[modalidad]}
    </span>
  )
}
