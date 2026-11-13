let contador = 0

// Genera identificadores únicos con un prefijo, por ejemplo "p-1731540000000-1".
export function generarId(prefijo: string): string {
  contador++
  return `${prefijo}-${Date.now()}-${contador}`
}

// Código corto que el usuario muestra al recoger su pedido, por ejemplo "RA-4821".
export function generarCodigoReservacion(): string {
  return `RA-${Math.floor(1000 + Math.random() * 9000)}`
}
