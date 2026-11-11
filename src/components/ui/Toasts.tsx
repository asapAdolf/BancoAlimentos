import { CheckCircle2, Info, AlertCircle } from 'lucide-react'
import { usePlataforma } from '../../context/PlataformaContext'

// Mensajes emergentes en la esquina de la pantalla.
export default function Toasts() {
  const { mensajes } = usePlataforma()

  return (
    <div className="toasts" aria-live="polite">
      {mensajes.map((m) => (
        <div key={m.id} className={`toast toast-${m.tipo}`}>
          {m.tipo === 'exito' ? <CheckCircle2 size={20} /> : m.tipo === 'info' ? <Info size={20} /> : <AlertCircle size={20} />}
          <span>{m.texto}</span>
        </div>
      ))}
    </div>
  )
}
