// Fecha AAAA-MM-DD desplazada "dias" a partir de hoy (0 = hoy, 1 = mañana, -1 = ayer).
export function fechaEnDias(dias: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// Fecha y hora ISO de hace "minutos" minutos.
export function haceMinutos(minutos: number): string {
  return new Date(Date.now() - minutos * 60_000).toISOString()
}

// Nombre corto del mes actual, por ejemplo "Nov".
export function mesActual(): string {
  return nombreMes(new Date())
}

// Nombres de los últimos "cantidad" meses; el último es el mes actual.
export function mesesRecientes(cantidad: number): string[] {
  const salida: string[] = []
  const ahora = new Date()
  for (let i = cantidad - 1; i >= 0; i--) {
    salida.push(nombreMes(new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)))
  }
  return salida
}

function nombreMes(fecha: Date): string {
  const mes = fecha.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '')
  return mes.charAt(0).toUpperCase() + mes.slice(1)
}
