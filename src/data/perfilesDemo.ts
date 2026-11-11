import type { Usuario } from '../types/usuario'

// DATOS DE EJEMPLO para la interfaz. No hay verificación de contraseñas:
// esto solo permite ver cómo luce la plataforma con cada tipo de perfil.
export const perfilesDemo: Record<string, Usuario> = {
  'persona@demo.mx': {
    id: 'usr-001',
    nombre: 'Ana Torres',
    correo: 'persona@demo.mx',
    telefono: '2221234567',
    tipo: 'persona',
  },
  'organizacion@demo.mx': {
    id: 'usr-002',
    nombre: 'Fundación Manos Unidas',
    correo: 'organizacion@demo.mx',
    telefono: '2229876543',
    tipo: 'organizacion',
  },
  'panaderia@demo.mx': {
    id: 'usr-003',
    nombre: 'Luis Ramírez',
    correo: 'panaderia@demo.mx',
    telefono: '2225554433',
    tipo: 'panaderia',
    nombreEstablecimiento: 'Panadería La Espiga',
  },
}
