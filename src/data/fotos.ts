import type { CategoriaAlimento } from '../types/alimento'

// Fotografías de Unsplash. Si alguna deja de cargar, la interfaz muestra una imagen de respaldo.
// Para cambiar una foto, reemplaza el identificador (la parte "photo-...") por otro de unsplash.com.
const u = (id: string, ancho = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${ancho}&q=70`

export const FOTOS = {
  pan: u('photo-1509440159596-0249088772ff'),
  croissant: u('photo-1555507036-ab1f4038808a'),
  pastel: u('photo-1578985545062-69928b1d9587'),
  verduras: u('photo-1542838132-92c53300491e'),
  verdurasMercado: u('photo-1498837167922-ddd27525d352'),
  frutas: u('photo-1610832958506-aa56368176cf'),
  ensalada: u('photo-1512621776951-a57141f2eefd'),
  pizza: u('photo-1565299624946-b28f40a0ae38'),
  pasta: u('photo-1473093295043-cdd812d0e601'),
  hamburguesa: u('photo-1551782450-a2132b4ba21d'),
  desayuno: u('photo-1482049016688-2d3e1b311543'),
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
