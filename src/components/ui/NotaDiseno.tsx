import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

// Recuadro discreto que relaciona la pantalla con el diagrama de clases.
// Es solo una referencia visual: no significa que el patrón ya esté implementado.
// Si no lo quieres en la presentación, bórralo de las páginas que lo usan.
export default function NotaDiseno({ patron, children }: { patron: string; children: ReactNode }) {
  return (
    <aside className="nota-diseno">
      <Info size={18} />
      <div>
        <strong>Referencia del diagrama · {patron}</strong>
        <p>{children}</p>
      </div>
    </aside>
  )
}
