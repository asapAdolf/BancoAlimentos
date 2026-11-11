import type { HorarioRecoleccion } from '../types/alimento'

// Funciones de ayuda para MOSTRAR datos (formato de dinero, fechas, etc.).

export function moneda(valor: number): string {
  return valor.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export function kilos(valor: number): string {
  return `${valor.toLocaleString('es-MX', { maximumFractionDigits: 1 })} kg`
}

export function numero(valor: number): string {
  return Math.round(valor).toLocaleString('es-MX')
}

function aFecha(iso: string): Date {
  const [anio, mes, dia] = iso.split('-').map(Number)
  return new Date(anio, mes - 1, dia)
}

export function fechaCorta(iso: string): string {
  return aFecha(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Devuelve la fecha de hoy + n días en formato AAAA-MM-DD.
export function fechaEnDias(n: number): string {
  const f = new Date()
  f.setDate(f.getDate() + n)
  const mes = String(f.getMonth() + 1).padStart(2, '0')
  const dia = String(f.getDate()).padStart(2, '0')
  return `${f.getFullYear()}-${mes}-${dia}`
}

// Equivale a getDiasParaCaducar() de la clase Alimento (solo para mostrarlo en pantalla).
export function diasParaCaducar(iso: string): number {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.round((aFecha(iso).getTime() - hoy.getTime()) / 86400000)
}

export function textoDias(dias: number): string {
  if (dias < 0) return 'Caducado'
  if (dias === 0) return 'Caduca hoy'
  if (dias === 1) return 'Caduca mañana'
  return `Caduca en ${dias} días`
}

export function textoHorario(h: HorarioRecoleccion): string {
  let dia = fechaCorta(h.fecha)
  if (h.fecha === fechaEnDias(0)) dia = 'Hoy'
  else if (h.fecha === fechaEnDias(1)) dia = 'Mañana'
  else if (h.fecha === fechaEnDias(-1)) dia = 'Ayer'
  return `${dia}, ${h.desde} – ${h.hasta}`
}

// Fecha y hora ISO de hace "minutos" minutos (para los datos de ejemplo).
export function haceMinutos(minutos: number): string {
  return new Date(Date.now() - minutos * 60000).toISOString()
}

export function hace(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'Ahora mismo'
  if (min < 60) return `Hace ${min} min`
  const horas = Math.round(min / 60)
  if (horas < 24) return `Hace ${horas} h`
  const dias = Math.round(horas / 24)
  return dias === 1 ? 'Ayer' : `Hace ${dias} días`
}
