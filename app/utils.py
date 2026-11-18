"""Filtros y funciones de ayuda para las plantillas (formato de dinero, fechas, etiquetas)."""
from datetime import date, datetime

from . import store

MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']


def moneda(v):
    v = float(v)
    return f'${v:,.0f}' if v == int(v) else f'${v:,.2f}'


def kilos(v):
    return f'{float(v):,.1f}'.rstrip('0').rstrip('.') + ' kg'


def numero(v):
    return f'{round(float(v)):,}'


def fecha_corta(iso):
    d = date.fromisoformat(iso[:10])
    return f'{d.day} {MESES[d.month - 1]} {d.year}'


def dias_para_caducar(iso):
    """Equivale a getDiasParaCaducar() de la clase Alimento (solo para mostrarlo)."""
    return (date.fromisoformat(iso[:10]) - date.today()).days


def texto_dias(d):
    if d < 0:
        return 'Caducado'
    if d == 0:
        return 'Caduca hoy'
    if d == 1:
        return 'Caduca mañana'
    return f'Caduca en {d} días'


def texto_horario(h):
    d = (date.fromisoformat(h['fecha']) - date.today()).days
    dia = {0: 'Hoy', 1: 'Mañana', -1: 'Ayer'}.get(d) or fecha_corta(h['fecha'])
    return f'{dia}, {h["desde"]} – {h["hasta"]}'


def hace(iso):
    minutos = round((datetime.now() - datetime.fromisoformat(iso)).total_seconds() / 60)
    if minutos < 1:
        return 'Ahora mismo'
    if minutos < 60:
        return f'Hace {minutos} min'
    horas = round(minutos / 60)
    if horas < 24:
        return f'Hace {horas} h'
    dias = round(horas / 24)
    return 'Ayer' if dias == 1 else f'Hace {dias} días'


def inicial(nombre):
    return (nombre or '?').strip()[:1].upper()


def primer_nombre(nombre):
    return (nombre or '').split(' ')[0]


# ------------------------------------------------------------------- menús
# Cada rol ve un menú distinto: (endpoint, texto, icono, endpoints que lo marcan como activo)
MENUS = {
    'cliente': [
        ('panel.resumen', 'Resumen', 'layout-dashboard', ()),
        ('publico.catalogo', 'Catálogo', 'store', ('publico.detalle',)),
        ('cliente.reservaciones', 'Mis reservaciones', 'calendar-check', ()),
        ('panel.notificaciones', 'Notificaciones', 'bell', ()),
        ('publico.ubicacion', 'Ubicación y recolección', 'map-pin', ()),
        ('publico.estadisticas', 'Impacto', 'bar-chart-3', ()),
    ],
    'empresa': [
        ('panel.resumen', 'Resumen', 'layout-dashboard', ()),
        ('publico.catalogo', 'Catálogo', 'store', ('publico.detalle',)),
        ('empresa.publicar', 'Publicar alimento', 'plus-circle', ()),
        ('empresa.publicaciones', 'Mis publicaciones', 'clipboard-list', ('empresa.editar',)),
        ('empresa.reservaciones', 'Reservaciones recibidas', 'calendar-check', ()),
        ('panel.notificaciones', 'Notificaciones', 'bell', ()),
        ('publico.ubicacion', 'Ubicación y recolección', 'map-pin', ()),
        ('publico.estadisticas', 'Impacto', 'bar-chart-3', ()),
    ],
    'transportista': [
        ('panel.resumen', 'Resumen', 'layout-dashboard', ()),
        ('transportista.disponibles', 'Entregas disponibles', 'package-search', ()),
        ('transportista.mis_entregas', 'Mis entregas', 'truck', ()),
        ('panel.notificaciones', 'Notificaciones', 'bell', ()),
        ('publico.ubicacion', 'Ubicación y rutas', 'map-pin', ()),
        ('publico.estadisticas', 'Impacto', 'bar-chart-3', ()),
    ],
    'administrador': [
        ('panel.resumen', 'Resumen', 'layout-dashboard', ()),
        ('admin.usuarios', 'Usuarios', 'users', ()),
        ('admin.publicaciones', 'Publicaciones', 'clipboard-list', ()),
        ('admin.reservaciones', 'Reservaciones', 'calendar-check', ()),
        ('panel.notificaciones', 'Notificaciones', 'bell', ()),
        ('publico.estadisticas', 'Impacto', 'bar-chart-3', ()),
    ],
}


def registrar(app):
    for f in (moneda, kilos, numero, fecha_corta, dias_para_caducar, texto_dias, texto_horario, hace, inicial, primer_nombre):
        app.jinja_env.filters[f.__name__] = f
    app.jinja_env.globals.update(
        precio_final=store.precio_final, descuento_aplicado=store.descuento_aplicado,
        ETIQUETA_ROL=store.ETIQUETA_ROL, ETIQUETA_MODALIDAD=store.ETIQUETA_MODALIDAD, ETIQUETA_ESTADO=store.ETIQUETA_ESTADO,
        ETIQUETA_ESTRATEGIA=store.ETIQUETA_ESTRATEGIA, ETIQUETA_TRANSPORTE=store.ETIQUETA_TRANSPORTE,
        CATEGORIAS=store.CATEGORIAS, UNIDADES=store.UNIDADES, ZONAS=store.ZONAS, GIROS=store.GIROS,
        MODALIDADES=store.MODALIDADES, ESTADOS=store.ESTADOS, PRECIO_MAXIMO=store.PRECIO_MAXIMO,
        hoy=lambda n=0: store._dia(n),
        usuarios_por_correo=lambda correo: store.get_usuario(correo) or {'nombre': 'Sin asignar'},
    )
