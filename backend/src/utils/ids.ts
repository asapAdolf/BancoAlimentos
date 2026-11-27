let contador = 0

export function generarId(prefijo: string): string {
  contador++
  return `${prefijo}-${Date.now()}-${contador}`
}

export function generarCodigoReservacion(): string {
  return `RA-${Math.floor(1000 + Math.random() * 9000)}`
}
