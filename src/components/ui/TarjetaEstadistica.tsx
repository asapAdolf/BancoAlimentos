import type { ReactNode } from 'react'

interface Props {
  icono: ReactNode
  valor: string | number
  etiqueta: string
  tono?: 'verde' | 'naranja' | 'azul' | 'rosa'
  nota?: string
}

export default function TarjetaEstadistica({ icono, valor, etiqueta, tono = 'verde', nota }: Props) {
  return (
    <article className="stat">
      <div className={`stat-icono tono-${tono}`}>{icono}</div>
      <div>
        <strong>{valor}</strong>
        <span>{etiqueta}</span>
        {nota && <small>{nota}</small>}
      </div>
    </article>
  )
}
