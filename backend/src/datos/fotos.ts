import type { CategoriaAlimento } from '../modelos/tipos.js'

// Fotografías de Unsplash (las mismas que usa el Front-End en src/data/fotos.ts).
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`

export const FOTOS = {
  pan: u('photo-1509440159596-0249088772ff'),
  croissant: u('photo-1555507036-ab1f4038808a'),
  verduras: u('photo-1542838132-92c53300491e'),
  ensalada: u('photo-1512621776951-a57141f2eefd'),
  pizza: u('photo-1565299624946-b28f40a0ae38'),
  pasta: u('photo-1473093295043-cdd812d0e601'),
  hamburguesa: u('photo-1551782450-a2132b4ba21d'),
  leche: u('photo-1550583724-b2692b85b150'),
  jugo: u('photo-1600271886742-f049cd451bba'),
  abarrotes: u('photo-1604719312566-8912e9227c6a'),
}

const porCategoria: Record<CategoriaAlimento, string> = {
  'Pan y repostería': FOTOS.pan,
  'Frutas y verduras': FOTOS.verduras,
  'Comida preparada': FOTOS.pasta,
  Lácteos: FOTOS.leche,
  Bebidas: FOTOS.jugo,
  Abarrotes: FOTOS.abarrotes,
}

export function fotoPorCategoria(categoria: CategoriaAlimento): string {
  return porCategoria[categoria]
}
