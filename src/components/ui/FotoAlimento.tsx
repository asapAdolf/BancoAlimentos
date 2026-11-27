import { useState } from 'react'
import { Utensils } from 'lucide-react'

interface Props {
  src: string
  alt: string
  className?: string
}

export default function FotoAlimento({ src, alt, className = '' }: Props) {
  const [falloSrc, setFalloSrc] = useState<string | null>(null)

  if (!src || falloSrc === src) {
    return (
      <div className={`foto-vacia ${className}`} role="img" aria-label={alt}>
        <Utensils size={36} />
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFalloSrc(src)}
    />
  )
}
