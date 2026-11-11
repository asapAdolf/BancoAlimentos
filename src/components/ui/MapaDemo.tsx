import { MapPin } from 'lucide-react'

// MAPA DE DEMOSTRACIÓN dibujado con SVG. No usa Google Maps ni ninguna API.
// Cuando el Back-End tenga el servicio de mapas, este componente se reemplazará por el mapa real.
export default function MapaDemo({ ruta, nombre }: { ruta: boolean; nombre: string }) {
  return (
    <div className="mapa-demo">
      <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa de demostración">
        <rect width="600" height="360" fill="#e9efe3" />
        {/* parque y río */}
        <rect x="380" y="40" width="150" height="90" rx="22" fill="#cfe3c4" />
        <path d="M0 270 C120 230 220 330 340 290 S520 250 600 280 L600 330 C520 300 420 340 340 340 S120 290 0 320 Z" fill="#cfe0ee" />
        {/* calles */}
        <g stroke="#ffffff" strokeWidth="14" strokeLinecap="round">
          <line x1="0" y1="90" x2="600" y2="90" />
          <line x1="0" y1="200" x2="600" y2="200" />
          <line x1="120" y1="0" x2="120" y2="360" />
          <line x1="300" y1="0" x2="300" y2="360" />
          <line x1="470" y1="0" x2="470" y2="360" />
        </g>
        <g stroke="#f6f1e3" strokeWidth="6">
          <line x1="0" y1="145" x2="600" y2="145" />
          <line x1="210" y1="0" x2="210" y2="360" />
          <line x1="385" y1="0" x2="385" y2="360" />
        </g>
        {/* manzanas */}
        <g fill="#dfe6d6">
          <rect x="140" y="105" width="50" height="30" rx="6" />
          <rect x="230" y="105" width="55" height="30" rx="6" />
          <rect x="315" y="155" width="55" height="30" rx="6" />
          <rect x="140" y="215" width="50" height="35" rx="6" />
          <rect x="400" y="215" width="55" height="35" rx="6" />
        </g>
        {ruta && (
          <>
            <path
              className="mapa-ruta"
              d="M120 200 L300 200 L300 90 L470 90"
              fill="none"
              stroke="#f08a24"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12 10"
            />
            <circle cx="120" cy="200" r="11" fill="#2f7d4f" stroke="#fff" strokeWidth="4" />
          </>
        )}
      </svg>

      <div className="mapa-pin" style={{ left: `${(470 / 600) * 100}%`, top: `${(90 / 360) * 100}%` }}>
        <MapPin size={38} fill="#f08a24" color="#ffffff" />
        <span>{nombre}</span>
      </div>
      {ruta && (
        <div className="mapa-origen" style={{ left: `${(120 / 600) * 100}%`, top: `${(200 / 360) * 100}%` }}>
          Tu ubicación (ejemplo)
        </div>
      )}
      <span className="mapa-sello">VISTA DE DEMOSTRACIÓN · sin Google Maps</span>
    </div>
  )
}
