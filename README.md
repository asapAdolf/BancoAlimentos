# Rescate Alimentario (Front-End)

Interfaz de la plataforma para reducir el desperdicio de alimentos. Proyecto universitario de
Patrones Orientados a Objetos. **Solo Front-End**: no hay Back-End, base de datos, APIs ni
integraciones reales; todo funciona con datos de ejemplo.

Tecnologías: React, TypeScript, Vite, HTML y CSS (más `react-router-dom` y `lucide-react`).

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Para comprobar que compila: `npm run build`.

## Cuentas de demostración

Con cualquier contraseña (el correo debe tener formato válido):

| Correo                  | Perfil                         | Qué permite ver                                  |
| ----------------------- | ------------------------------ | ------------------------------------------------ |
| `panaderia@demo.mx`     | Establecimiento (La Espiga)    | Publicar, Mis publicaciones, reservaciones recibidas |
| `persona@demo.mx`       | Persona (Ana Torres)           | Catálogo, reservar, Mis reservaciones            |
| `organizacion@demo.mx`  | Organización social            | Igual que persona, con donaciones reservadas     |

También puedes registrar una cuenta nueva desde `/registro`.

## Pantallas y rutas

| Pantalla                    | Ruta (sitio)         | Ruta (panel)            |
| --------------------------- | -------------------- | ----------------------- |
| 1. Inicio                   | `/`                  |                         |
| 2. Inicio de sesión         | `/login`             |                         |
| 3. Registro                 | `/registro`          |                         |
| 4. Dashboard                |                      | `/app`                  |
| 5. Catálogo                 | `/catalogo`          | `/app/catalogo`         |
| 6. Detalle del alimento     | `/catalogo/:id`      | `/app/catalogo/:id`     |
| 7. Publicar alimento        |                      | `/app/publicar`         |
| 8. Mis publicaciones        |                      | `/app/publicaciones`    |
| 9. Reservaciones            |                      | `/app/reservaciones`    |
| 10. Notificaciones          |                      | `/app/notificaciones`   |
| 11. Ubicación y recolección | `/ubicacion`         | `/app/ubicacion`        |
| 12. Estadísticas e impacto  | `/estadisticas`      | `/app/estadisticas`     |

## Estructura de carpetas

```
src/
├── components/
│   ├── layout/     Navbar, Footer, PanelLayout (menú lateral)
│   ├── landing/    Secciones de la página de inicio
│   ├── catalog/    TarjetaAlimento, FiltrosCatalogo
│   └── ui/         Piezas reutilizables (Modal, Insignias, gráficas, mapa de demostración...)
├── pages/          Una por pantalla
├── context/        AuthContext (sesión simulada) y PlataformaContext (datos y acciones simuladas)
├── data/           DATOS DE EJEMPLO (se reemplazarán por la API)
├── types/          Tipos de TypeScript para la vista
├── services/       Validaciones de formularios
├── utils/          Formato de dinero y fechas, precios mostrados
├── hooks/          useBase
└── styles/         CSS por área
```

## Qué es simulado

- Los datos viven en memoria: **al recargar la página vuelven a los datos de ejemplo**
  (solo se conserva la sesión de demostración).
- Cuando exista el Back-End, el punto de conexión es `src/context/PlataformaContext.tsx`
  (las acciones publicar, reservar, confirmarEntrega...) y los archivos de `src/data/`.
- El mapa es una **vista de demostración** dibujada con SVG; no usa Google Maps.
- El aviso por WhatsApp aparece como "Próximamente"; no hay conexión con Twilio.
- Los recuadros "Referencia del diagrama" (componente `NotaDiseno`) relacionan cada pantalla con los
  patrones del diagrama de clases. Son solo notas visuales: si no los quieres, bórralos de las páginas.
- Las fotografías vienen de Unsplash. Si alguna no carga, se muestra una imagen de respaldo;
  puedes cambiarlas en `src/data/fotos.ts`.
