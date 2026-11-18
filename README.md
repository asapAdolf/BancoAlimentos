# Rescate Alimentario · versión Flask (solo interfaz)

Mismo diseño y pantallas que la versión React, servidos con **Flask + Jinja2**. Solo hay 4 tipos de usuario:
**cliente, empresa, transportista y administrador**.

> Alcance: únicamente Front-End. No hay base de datos, API real, Twilio ni Google Maps. Los datos son de ejemplo y viven en memoria
> (`app/store.py`); se reinician al apagar el servidor.

## Ejecutar (VS Code, terminal)
```bash
python -m venv venv
venv\Scripts\activate        # Windows   |   source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python run.py                # abre http://127.0.0.1:5000
```
Pruebas: `pip install pytest` y luego `python -m pytest`.

## Cuentas de demostración (cualquier contraseña)
| Rol | Correo |
|---|---|
| Cliente | cliente@demo.mx |
| Empresa | empresa@demo.mx |
| Transportista | transportista@demo.mx |
| Administrador | admin@demo.mx |

## Qué ve cada rol
| Pantalla | Público | Cliente | Empresa | Transportista | Admin |
|---|:-:|:-:|:-:|:-:|:-:|
| Inicio, catálogo, detalle, ubicación, estadísticas | ✔ | ✔ | ✔ | ✔ | ✔ |
| Registro / login | ✔ | | | | |
| Panel (resumen propio) y notificaciones | | ✔ | ✔ | ✔ | ✔ |
| Reservar y Mis reservaciones | | ✔ | | | |
| Publicar, Mis publicaciones, Editar, Reservaciones recibidas | | | ✔ | | |
| Entregas disponibles y Mis entregas | | | | ✔ | |
| Usuarios, Publicaciones, Reservaciones (todas) | | | | | ✔ |

## Estructura
```
run.py
app/
  __init__.py      create_app, sesión, menús, errores 403/404
  store.py         datos de ejemplo en memoria (sin BD)
  utils.py         filtros Jinja y menús por rol
  seguridad.py     decoradores login_requerido / rol_requerido
  blueprints/      publico, auth, panel, cliente, empresa, transportista, admin
  templates/       base_public, base_panel, macros y una carpeta por rol
  static/          css (mismo de React + flask.css) y js/app.js
tests/test_rutas.py
```

## Base de datos (PostgreSQL) y API

- Esquema: `Database/schema.sql` (generado a partir de `BaseDatosFinal.png`).
- Conexión: se configura en un archivo `.env` en la raíz (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`
  o `DATABASE_URL`). Lo lee `app/config.py`; el `.env` no se sube al repositorio.
- Código: `app/database.py` (SQLAlchemy), `app/models.py` (modelos) y `app/blueprints/api.py` (rutas `/api`).
- Rutas: `/api/salud`, `/api/roles`, `/api/categorias`, `/api/unidades`, `/api/usuarios`, `/api/publicaciones`
  y `POST /api/seed` (carga los catálogos iniciales).
- `arrancar_todo.bat` inicia PostgreSQL y el servidor Flask (`python run.py`) y abre el navegador.
