// Validaciones básicas. Cada función devuelve un mensaje de error o '' si todo está bien.

export function validarNombre(valor: string): string {
  if (valor.trim().length < 3) return 'Escribe al menos 3 caracteres.'
  return ''
}

export function validarCorreo(valor: string): string {
  if (!valor.trim()) return 'El correo es obligatorio.'
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formato.test(valor.trim())) return 'Escribe un correo válido, por ejemplo nombre@correo.com.'
  return ''
}

export function validarContrasenaLogin(valor: string): string {
  if (!valor) return 'La contraseña es obligatoria.'
  return ''
}

export function validarContrasenaRegistro(valor: string): string {
  if (valor.length < 8) return 'Debe tener al menos 8 caracteres.'
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) return 'Debe incluir letras y números.'
  return ''
}

export function validarTelefono(valor: string): string {
  if (!/^\d{10}$/.test(valor.replace(/\s/g, ''))) return 'Escribe un teléfono de 10 dígitos.'
  return ''
}
