import type { ReactNode } from 'react'
import { useBase } from '../../hooks/useBase'

interface Props {
  titulo: string
  subtitulo?: string
  acciones?: ReactNode
  children: ReactNode
}

// Estructura común de cada pantalla: título arriba y contenido abajo.
// Dentro del panel usa el espacio del panel; en el sitio público usa un contenedor centrado.
export default function Pagina({ titulo, subtitulo, acciones, children }: Props) {
  const { enPanel } = useBase()

  return (
    <div className={enPanel ? 'pagina' : 'contenedor pagina-publica'}>
      <div className="pagina-cabecera">
        <div>
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
        {acciones && <div className="pagina-acciones">{acciones}</div>}
      </div>
      {children}
    </div>
  )
}
