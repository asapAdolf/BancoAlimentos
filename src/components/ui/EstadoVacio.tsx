import type { ReactNode } from 'react'

interface Props {
  icono: ReactNode
  titulo: string
  texto: string
  children?: ReactNode
}

// Mensaje que se muestra cuando una lista no tiene elementos.
export default function EstadoVacio({ icono, titulo, texto, children }: Props) {
  return (
    <div className="vacio">
      <div className="vacio-icono">{icono}</div>
      <h3>{titulo}</h3>
      <p>{texto}</p>
      {children}
    </div>
  )
}
