"""Pantallas compartidas: inicio, catálogo, detalle, ubicación e impacto.
Se ven con el menú público si no hay sesión y con el panel lateral si la hay."""
from flask import Blueprint, abort, g, render_template, request

from .. import store

bp = Blueprint('publico', __name__)

META_KILOS = 30000
META_ENTREGAS = 3000

@bp.route('/')
def inicio():
    return render_template('inicio.html', registro=store.S.REGISTRO)

def _filtros():
    a = request.args
    try:
        precio_max = int(a.get('precio_max', store.PRECIO_MAXIMO))
    except ValueError:
        precio_max = store.PRECIO_MAXIMO
    return {
        'q': a.get('q', '').strip(), 'categoria': a.get('categoria', 'todas'), 'modalidad': a.get('modalidad', 'todas'),
        'zona': a.get('zona', 'todas'), 'estado': a.get('estado', 'todas'), 'precio_max': precio_max,
        'orden': a.get('orden', 'recientes'),
    }

@bp.route('/catalogo')
def catalogo():
    f = _filtros()
    texto = f['q'].lower()
    resultados = []
    for p in store.S.PUBLICACIONES:
        a = p['alimento']
        if texto and not (texto in a['nombre'].lower() or texto in p['est']['nombre'].lower() or texto in a['categoria'].lower()):
            continue
        if f['categoria'] != 'todas' and a['categoria'] != f['categoria']:
            continue
        if f['modalidad'] != 'todas' and p['modalidad'] != f['modalidad']:
            continue
        if f['zona'] != 'todas' and p['est']['zona'] != f['zona']:
            continue
        if f['estado'] != 'todas' and p['estado'] != f['estado']:
            continue
        if f['precio_max'] < store.PRECIO_MAXIMO and store.precio_final(p) > f['precio_max']:
            continue
        resultados.append(p)

    if f['orden'] == 'caducidad':
        resultados.sort(key=lambda p: p['alimento']['caducidad'])
    elif f['orden'] == 'precio':
        resultados.sort(key=store.precio_final)
    return render_template('catalogo.html', pubs=resultados, f=f)

@bp.route('/catalogo/<pub_id>')
def detalle(pub_id):
    pub = store.get_pub(pub_id)
    if pub is None:
        abort(404)
    return render_template('detalle.html', pub=pub, reserva=store.reserva_de_pub(pub_id))

def _ruta_ejemplo(pub_id):
    """Distancia y tiempo de EJEMPLO (siempre los mismos para la misma publicación)."""
    semilla = sum(ord(c) for c in pub_id)
    distancia = 0.8 + (semilla % 35) / 10
    return {'km': f'{distancia:.1f}', 'min': round(distancia * 4 + 3)}

@bp.route('/ubicacion')
def ubicacion():
    user = g.user
    pubs = [p for p in store.S.PUBLICACIONES if p['estado'] != 'entregado']
    mias = set()
    if user and user['rol'] == 'cliente':
        mias = {r['pub_id'] for r in store.S.RESERVACIONES if r['cliente_email'] == user['email']}
    elif user and user['rol'] == 'transportista':
        mias = {r['pub_id'] for r in store.S.RESERVACIONES if r['transportista_email'] == user['email']}
    elif user and user['rol'] == 'empresa':
        mias = {p['id'] for p in store.pubs_de_empresa(user)}
    pubs.sort(key=lambda p: p['id'] not in mias)

    sel = store.get_pub(request.args.get('pub', '')) or (pubs[0] if pubs else None)
    reserva = store.reserva_de_pub(sel['id']) if sel else None

    ver_destino = bool(user and reserva and reserva['modo'] == 'envio' and (
        user['rol'] == 'administrador' or user['email'] in (reserva['cliente_email'], reserva['transportista_email'], sel['est'].get('email'))
        or user['rol'] == 'transportista'))
    return render_template('ubicacion.html', pubs=pubs, mias=mias, sel=sel, reserva=reserva, ver_destino=ver_destino,
                           ruta=_ruta_ejemplo(sel['id']) if sel else None)

@bp.route('/estadisticas')
def estadisticas():
    reg = store.S.REGISTRO
    return render_template(
        'estadisticas.html', registro=reg, comidas=reg['kilos_total'] / 0.4, co2=reg['kilos_total'] * 2.5,
        meta_kilos=META_KILOS, meta_entregas=META_ENTREGAS,
        prog_kilos=min(100, reg['kilos_total'] / META_KILOS * 100), prog_entregas=min(100, reg['entregas'] / META_ENTREGAS * 100))
