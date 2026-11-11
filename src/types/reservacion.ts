// El estado de la reservación (reservado / entregado) se toma de la publicación asociada.
export interface Reservacion {
  id: string
  publicacionId: string
  usuarioNombre: string
  cantidad: number
  precioTotal: number
  fecha: string // AAAA-MM-DD
  codigo: string
}
