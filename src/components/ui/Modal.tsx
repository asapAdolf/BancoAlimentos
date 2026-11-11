import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  titulo: string
  onCerrar: () => void
  children: ReactNode
  pie?: ReactNode
  ancho?: 'normal' | 'ancho'
}

// Ventana emergente. Se cierra con la X, con la tecla Esc o haciendo clic afuera.
export default function Modal({ titulo, onCerrar, children, pie, ancho = 'normal' }: Props) {
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [onCerrar])

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className={`modal ${ancho === 'ancho' ? 'modal-ancho' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-cabecera">
          <h2>{titulo}</h2>
          <button className="btn-cerrar" aria-label="Cerrar" onClick={onCerrar}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-cuerpo">{children}</div>
        {pie && <div className="modal-pie">{pie}</div>}
      </div>
    </div>
  )
}
