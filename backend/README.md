# Rescate Alimentario: Back-End

API REST en **TypeScript** (Node + Express) para la plataforma de rescate de alimentos.
Implementa los patrones de diseño que piden los documentos `cambios.pdf` (Factory Method y Adapter) y
`cambios 2.pdf` (Strategy y Observer), siguiendo la lógica y la forma de nombrar del código muestra:

| Patrón                     | Para qué se usa                                                | Carpeta                                  |
| -------------------------- | -------------------------------------------------------------- | ---------------------------------------- |
| **Factory Method**         | Crear publicaciones en modalidad venta, descuento o donación   | `src/patrones/factory/`                  |
| **Adapter** (notificaciones) | Enviar avisos por SMS, WhatsApp o correo                     | `src/patrones/adapter/notificaciones/`   |
| **Adapter** (mapas)        | Obtener ubicaciones y rutas con Google Maps u OpenStreetMap    | `src/patrones/adapter/mapas/`            |
| **Strategy**               | Calcular descuentos según la caducidad o la disponibilidad     | `src/patrones/strategy/`                 |
| **Observer**               | Notificar cuando existan nuevos alimentos disponibles          | `src/patrones/observer/`                 |

## Equivalencias con el código muestra

### Factory Method

| Java (muestra)                         | TypeScript (proyecto)                                    |
| -------------------------------------- | -------------------------------------------------------- |
| `interface Personajes { atacar(); }`   | `interface PublicacionAlimento { mostrarPublicacion(); calcularPrecioFinal(); ... }` |
| `class Mago implements Personajes`     | `class PublicacionVenta implements PublicacionAlimento`  |
| `class Arquero implements Personajes`  | `class PublicacionDescuento implements PublicacionAlimento` |
| `class Guerrero implements Personajes` | `class PublicacionDonacion implements PublicacionAlimento` |
| `PersonajesFactory.crearPersonajes(tipo)` | `PublicacionFactory.crearPublicacion(tipo, datos)`    |
| `tipo.equalsIgnoreCase("mago")`        | `equalsIgnoreCase(tipo, 'venta')` (también ignora acentos) |
| `throw new IllegalArgumentException(...)` | `throw new IllegalArgumentException('Tipo de publicación no válido')` |
| `Main` con `p1.atacar()`               | `src/demo/MainFactory.ts` con `p1.mostrarPublicacion()`  |

### Adapter

| Java (muestra)                                   | TypeScript (proyecto)                               |
| ------------------------------------------------ | --------------------------------------------------- |
| `interface Notificacion { enviarMensaje(mensaje); }` | `interface Notificacion { enviarMensaje(mensaje: string): void }` |
| `class SMS`, `class Whatsapp`, `class Email`     | Iguales (`SMS.ts`, `Whatsapp.ts`, `Email.ts`)       |
| `class smsAdapter implements Notificacion { private SMS sms = new SMS(); }` | `class smsAdapter implements Notificacion { private sms: SMS = new SMS() }` |
| `whatsappAdapter`, `emailAdapter`                | Iguales                                             |
| `Main` con `Scanner`, `do/while` y `switch`      | `src/demo/MainAdapter.ts` (readline, `do/while` y `switch`) |

Para los mapas se usa la misma idea: interfaz `Mapa`, servicios externos `GoogleMaps` y
`OpenStreetMap` (con métodos y formatos distintos entre sí) y los adaptadores `googleMapsAdapter` y
`openStreetMapAdapter`, que los traducen a la interfaz común.

### Strategy

| Código muestra (`cambios 2.pdf`)                       | TypeScript (proyecto)                                          |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| `interface EnvioStrategy { calcularCosto(): void }`    | `interface DescuentoStrategy { calcularDescuento(alimento, porcentajeMaximo): number }` |
| `class EnvioEstandar implements EnvioStrategy`         | `class DescuentoPorCaducidad implements DescuentoStrategy`     |
| `class EnvioExpres implements EnvioStrategy`           | `class DescuentoPorDisponibilidad implements DescuentoStrategy` |
| `class Paqueteria` / `class Negocio` (contexto)        | `class PublicacionDescuento` (guarda `private estrategia: DescuentoStrategy`) |
| `cambiarEnvio(envio)` / `cambiarEstrategia(estrategia)` | `publicacion.cambiarEstrategia(estrategia)`                   |
| `aplicarEnvio()` / `aplicarEstrategia()`               | `publicacion.aplicarEstrategia()` (devuelve el % de descuento) |
| Programa principal                                     | `src/demo/MainStrategy.ts`                                     |

El `porcentaje` que envía el establecimiento al publicar es el **descuento máximo**. La estrategia
decide cuánto de ese máximo se aplica:

| Estrategia                   | 100% del máximo       | 75%          | 50%          | 25%                  |
| ---------------------------- | --------------------- | ------------ | ------------ | -------------------- |
| `DescuentoPorCaducidad`      | caduca hoy o ya caducó | caduca mañana | en 2 días   | en 3 días o más      |
| `DescuentoPorDisponibilidad` | 20 unidades o más     | 10 a 19      | 5 a 9        | menos de 5           |

El cálculo se hace al momento: si cambia la cantidad o se acerca la caducidad, el precio final se
actualiza solo. La respuesta incluye `porcentajeMaximo` (el tope) y `porcentajeDescuento` (el aplicado).

### Observer

| Código muestra (`cambios 2.pdf`)                  | TypeScript (proyecto)                                           |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `interface Observador { actualizar(mensaje) }`    | `interface Observador { actualizar(mensaje, publicacion) }`     |
| `class Usuario implements Observador` (`nomUsuario`) | `class UsuarioObservador implements Observador` (`nomUsuario`) |
| `class Influencer` (`observadores`, `nomInfluencer`) | `class CatalogoAlimentos` (`observadores`, `nomCatalogo`)    |
| `agregarObservador(obs)` / `eliminarObservador(obs)` | Iguales                                                      |
| `notificar(mensaje)`                              | `notificar(mensaje, publicacion)` y `nuevoAlimento(publicacion)` |
| Programa principal (`inf1`, `us1`, `us2`...)      | `src/demo/MainObserver.ts` (`cat1`, `us1`, `us2`)               |

Al publicar un alimento, `CatalogoAlimentos` avisa a todos sus observadores. Cada `UsuarioObservador`
guarda el aviso en sus notificaciones y lo envía por su canal preferido usando el **Adapter**
(SMS, WhatsApp o correo). Personas y organizaciones quedan suscritas automáticamente al iniciar el
servidor o al registrarse, y pueden darse de baja con `DELETE /api/suscripcion`.

> Los servicios externos son **simulaciones**: imprimen en consola y calculan coordenadas ficticias.
> No se conecta ninguna API real.

## Cómo ejecutarlo

```bash
cd backend
npm install
npm run dev            # servidor en http://localhost:3000/api (se reinicia al guardar)
```

Otros comandos:

```bash
npm run demo:factory   # demo de consola del Factory Method (como el Main de Java)
npm run demo:adapter   # demo de consola del Adapter (menú 1. SMS 2. WhatsApp 3. Email 4. Mapas 5. Salir)
npm run demo:strategy  # demo de consola del Strategy (cambiarEstrategia / aplicarEstrategia)
npm run demo:observer  # demo de consola del Observer (agregarObservador / notificar / eliminarObservador)
npm run typecheck      # revisar tipos
npm run build && npm start   # compilar a dist/ y ejecutar
```

Variables de entorno opcionales: `PUERTO` (3000), `PROVEEDOR_MAPAS` (`google` | `openstreetmap`),
`ORIGEN_FRONTEND` (`http://localhost:5173`).

## Usuarios de demostración

No hay contraseñas. `POST /api/auth/login` con `{ "correo": "..." }` devuelve el usuario, y su `id` se
envía en el encabezado **`x-usuario-id`** en las demás peticiones.

| Correo                 | id        | Tipo          | Canal de avisos |
| ---------------------- | --------- | ------------- | --------------- |
| `persona@demo.mx`      | `usr-001` | persona       | email           |
| `organizacion@demo.mx` | `usr-002` | organización  | whatsapp        |
| `panaderia@demo.mx`    | `usr-003` | panadería     | sms             |

## Endpoints

| Método | Ruta                                         | Descripción                                        |
| ------ | -------------------------------------------- | -------------------------------------------------- |
| POST   | `/api/auth/login`                            | Iniciar sesión (demo)                              |
| POST   | `/api/auth/registro`                         | Registrar usuario                                  |
| GET    | `/api/auth/yo`                               | Usuario actual                                     |
| GET    | `/api/publicaciones`                         | Catálogo. Filtros: `busqueda, categoria, modalidad, precioMax, zona, disponibilidad, orden` |
| GET    | `/api/publicaciones/mias`                    | Publicaciones del establecimiento                  |
| GET    | `/api/publicaciones/:id`                     | Detalle                                            |
| POST   | `/api/publicaciones`                         | Publicar (**Factory Method** según `modalidad`, **Strategy** según `estrategia`, avisa con **Observer**) |
| PATCH  | `/api/publicaciones/:id`                     | Editar (`nombre, descripcion, cantidad, precioBase, porcentaje, estrategia`); `estrategia` cambia el **Strategy** |
| DELETE | `/api/publicaciones/:id`                     | Cancelar (solo si está disponible)                 |
| POST   | `/api/publicaciones/:id/reservar`            | Reservar (persona u organización)                  |
| POST   | `/api/publicaciones/:id/confirmar-entrega`   | Confirmar entrega y sumar al registro de impacto   |
| GET    | `/api/reservaciones`                         | Reservaciones hechas o recibidas                   |
| GET    | `/api/notificaciones`                        | Avisos del usuario                                 |
| PATCH  | `/api/notificaciones/:id/leida`              | Marcar un aviso como leído                         |
| PATCH  | `/api/notificaciones/leidas`                 | Marcar todos como leídos                           |
| POST   | `/api/notificaciones/enviar`                 | Enviar `{ canal, destinatario, mensaje }` por el **Adapter** |
| GET    | `/api/notificaciones/enviados`               | Historial de mensajes enviados por los adaptadores |
| GET    | `/api/suscripcion`                           | ¿El usuario recibe avisos de nuevos alimentos? (**Observer**) |
| POST   | `/api/suscripcion`                           | Suscribirse (`agregarObservador`)                  |
| DELETE | `/api/suscripcion`                           | Darse de baja (`eliminarObservador`)               |
| GET    | `/api/ubicacion?direccion=`                  | Coordenadas de una dirección (**Adapter** de mapas) |
| GET    | `/api/ubicacion/establecimientos`            | Coordenadas de todos los establecimientos          |
| GET    | `/api/ubicacion/ruta?origen=&destino=`       | Distancia y tiempo estimado                        |
| GET    | `/api/ubicacion/publicacion/:id?origen=`     | Ruta al punto de recolección de una publicación    |
| GET    | `/api/impacto`                               | Registro de desperdicio evitado                    |
| GET    | `/api/impacto/reporte`                       | Reporte de impacto en texto                        |

En las rutas de ubicación se puede agregar `&proveedor=google` o `&proveedor=openstreetmap`.

Ejemplo de cuerpo para publicar (mismos campos que `NuevaPublicacion` del Front-End):

```json
{
  "nombre": "Croissants de mantequilla",
  "descripcion": "Horneados hoy",
  "categoria": "Pan y repostería",
  "unidad": "piezas",
  "cantidad": 8,
  "kilos": 1.2,
  "precioBase": 120,
  "fechaCaducidad": "2026-11-14",
  "horario": { "fecha": "2026-11-13", "desde": "19:00", "hasta": "20:30" },
  "modalidad": "descuento",
  "estrategia": "caducidad",
  "porcentaje": 40
}
```

(`porcentaje` es el descuento máximo; con `"estrategia": "caducidad"` y caducidad mañana se aplica 30%.)

Errores: se responde `{ "error": "IllegalArgumentException", "mensaje": "..." }` con código 400
(datos inválidos), 401 (sin usuario), 403 (sin permiso), 404 (no existe) o 409 (estado no permite la acción).

## Estructura

```
src/
├── patrones/
│   ├── factory/        PublicacionAlimento, PublicacionVenta, PublicacionDescuento,
│   │                   PublicacionDonacion, PublicacionFactory
│   ├── strategy/       DescuentoStrategy, DescuentoPorCaducidad, DescuentoPorDisponibilidad, crearEstrategia
│   ├── observer/       Observador, UsuarioObservador, CatalogoAlimentos
│   └── adapter/
│       ├── notificaciones/  Notificacion, SMS, Whatsapp, Email, smsAdapter, whatsappAdapter, emailAdapter
│       └── mapas/           Mapa, GoogleMaps, OpenStreetMap, googleMapsAdapter, openStreetMapAdapter
├── servicios/          PublicacionServicio, NotificacionServicio, UbicacionServicio, UsuarioServicio,
│                       SuscripcionServicio
├── registro/           RegistroDesperdicioEvitado
├── modelos/            Alimento, HorarioRecoleccion, Establecimiento, Usuario, Reservacion, ...
├── datos/              Base de datos en memoria con datos de ejemplo
├── validaciones/       Validación de los datos recibidos
├── rutas/              Endpoints de Express
├── errores/            IllegalArgumentException, IllegalStateException, ...
├── demo/               MainFactory, MainAdapter, MainStrategy y MainObserver (demos de consola)
├── app.ts              Configuración de Express
└── servidor.ts         Punto de entrada
```

Los datos viven **en memoria**: al reiniciar el servidor vuelven a los datos de ejemplo.
