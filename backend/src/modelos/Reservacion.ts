export interface Reservacion {
  id: string
  publicacionId: string
  usuarioId: string
  usuarioNombre: string
  cantidad: number
  precioTotal: number
  fecha: string // AAAA-MM-DD
  codigo: string
}
