// Equivalente al String.equalsIgnoreCase() de Java.
// Además ignora acentos, para que "donación" y "donacion" sean iguales.
export function equalsIgnoreCase(a: string, b: string): boolean {
  return normalizar(a) === normalizar(b)
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}
