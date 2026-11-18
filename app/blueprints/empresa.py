"""Pantallas del rol EMPRESA: publicar alimentos, administrar publicaciones y confirmar entregas."""
from datetime import date

from flask import Blueprint, abort, flash, g, redirect, render_template, request, url_for

from .. import store
from ..seguridad import rol_requerido

bp = Blueprint('empresa', __name__, url_prefix='/empresa')


def _numero(texto):
    try:
        return float(str(texto).replace(',', '.'))
    except ValueError:
        return None


def _fecha_valida(texto):
    try:
        return date.fromisoformat(texto)
    except ValueError:
        return None


def _formulario_inicial():
    return {'modalidad': 'venta', 'nombre': '', 'descripcion': '', 'categoria': store.CATEGORIAS[0], 'cantidad': '',
            'unidad': 'piezas', 'kilos': '', 'precio_base': '', 'estrategia': 'caducidad', 'pct': '30', 'caducidad': '',
            'fecha_rec': store._dia(0), 'desde': '18:00', 'hasta': '20:00'}


def _vista_previa(f, est):
    """Publicación de ejemplo con lo que lleva escrito el formulario (para la tarjeta de vista previa)."""
    def num(texto, tipo=float):
        n = _numero(texto)
        return tipo(n) if n is not None else 0
    modalidad = f['modalidad']
    return {
        'id': 'vista-previa', 'modalidad': modalidad, 'estado': 'disponible',
        'estrategia': f['estrategia'] if modalidad == 'descuento' else None,
        'precio_base': 0 if modalidad == 'donacion' else num(f['precio_base']),
        'pct': num(f['pct'], int) if modalidad == 'descuento' else 0, 'est': est,
        'alimento': {'nombre': f['nombre'] or 'Nombre del alimento', 'descripcion': f['descripcion'],
                     'categoria': f['categoria'], 'unidad': f['unidad'], 'cantidad': num(f['cantidad'], int),
                     'kilos': num(f['kilos']), 'caducidad': f['caducidad'] or store._dia(1),
                     'foto': store.FOTO_POR_CATEGORIA.get(f['categoria'], store.FOTOS['pan'])},
    }


@bp.route('/publicar', methods=['GET', 'POST'])
@rol_requerido('empresa')
def publicar():
    f, errores = _formulario_inicial(), {}
    if request.method == 'POST':
        for campo in f:
            f[campo] = request.form.get(campo, f[campo]).strip()
        if f['modalidad'] not in store.MODALIDADES:
            f['modalidad'] = 'venta'
        hoy = date.today()
        cantidad, kilos, precio = _numero(f['cantidad']), _numero(f['kilos']), _numero(f['precio_base'])
        cad, rec, pct = _fecha_valida(f['caducidad']), _fecha_valida(f['fecha_rec']), _numero(f['pct'])

        if len(f['nombre']) < 3:
            errores['nombre'] = 'Escribe el nombre del alimento (mínimo 3 letras).'
        if f['categoria'] not in store.CATEGORIAS:
            errores['categoria'] = 'Elige un tipo de alimento.'
        if f['unidad'] not in store.UNIDADES:
            errores['unidad'] = 'Elige una unidad.'
        if cantidad is None or cantidad < 1 or cantidad != int(cantidad):
            errores['cantidad'] = 'Indica una cantidad entera mayor a 0.'
        if kilos is None or kilos <= 0:
            errores['kilos'] = 'Indica los kilos (mayor a 0).'
        if f['modalidad'] != 'donacion' and (precio is None or precio <= 0):
            errores['precio_base'] = 'Indica un precio base mayor a 0.'
        if f['modalidad'] == 'descuento':
            if f['estrategia'] not in store.ETIQUETA_ESTRATEGIA:
                errores['estrategia'] = 'Elige el tipo de descuento.'
            if pct is None or not 5 <= pct <= 90:
                errores['pct'] = 'El descuento debe estar entre 5% y 90%.'
        if cad is None:
            errores['caducidad'] = 'Selecciona la fecha de caducidad.'
        elif cad < hoy:
            errores['caducidad'] = 'La fecha de caducidad no puede ser anterior a hoy.'
        if rec is None or rec < hoy:
            errores['fecha_rec'] = 'Selecciona hoy o una fecha futura.'
        if not f['desde'] or not f['hasta'] or f['desde'] >= f['hasta']:
            errores['horario'] = 'La hora de inicio debe ser anterior a la de fin.'

        if not errores:
            store.publicar({
                'modalidad': f['modalidad'], 'nombre': f['nombre'], 'descripcion': f['descripcion'], 'categoria': f['categoria'],
                'unidad': f['unidad'], 'cantidad': int(cantidad), 'kilos': kilos, 'precio_base': precio or 0,
                'estrategia': f['estrategia'], 'pct': int(pct or 0), 'caducidad': f['caducidad'], 'fecha_rec': f['fecha_rec'],
                'desde': f['desde'], 'hasta': f['hasta']}, g.user)
            flash('¡Alimento publicado! Se generó un aviso para los clientes (demostración).', 'exito')
            return redirect(url_for('empresa.publicaciones'))
    est = next(e for e in store.S.ESTABLECIMIENTOS if e['id'] == g.user['est_id'])
    return render_template('empresa/publicar.html', f=f, errores=errores, est=est, previa=_vista_previa(f, est))


@bp.route('/publicaciones')
@rol_requerido('empresa')
def publicaciones():
    mias = store.pubs_de_empresa(g.user)
    filtro = request.args.get('estado', 'todas')
    visibles = mias if filtro == 'todas' else [p for p in mias if p['estado'] == filtro]
    cuentas = {e: sum(1 for p in mias if p['estado'] == e) for e in store.ESTADOS}
    return render_template('empresa/publicaciones.html', pubs=visibles, filtro=filtro, total=len(mias), cuentas=cuentas)


@bp.route('/publicaciones/<pub_id>/editar', methods=['GET', 'POST'])
@rol_requerido('empresa')
def editar(pub_id):
    pub = store.get_pub(pub_id)
    if pub is None or pub['est']['id'] != g.user['est_id']:
        abort(404)
    if pub['estado'] != 'disponible':
        flash('Solo se pueden editar publicaciones disponibles.', 'error')
        return redirect(url_for('empresa.publicaciones'))
    a = pub['alimento']
    f = {'nombre': a['nombre'], 'descripcion': a['descripcion'], 'cantidad': str(a['cantidad']),
         'precio_base': f'{pub["precio_base"]:g}', 'pct': str(pub['pct'])}
    errores = {}
    if request.method == 'POST':
        for campo in f:
            f[campo] = request.form.get(campo, f[campo]).strip()
        cantidad, precio, pct = _numero(f['cantidad']), _numero(f['precio_base']), _numero(f['pct'])
        if len(f['nombre']) < 3:
            errores['nombre'] = 'El nombre debe tener al menos 3 letras.'
        if cantidad is None or cantidad < 1 or cantidad != int(cantidad):
            errores['cantidad'] = 'La cantidad debe ser un número entero mayor a 0.'
        if pub['modalidad'] != 'donacion' and (precio is None or precio <= 0):
            errores['precio_base'] = 'El precio base debe ser mayor a 0.'
        if pub['modalidad'] == 'descuento' and (pct is None or not 5 <= pct <= 90):
            errores['pct'] = 'El descuento debe estar entre 5% y 90%.'
        if not errores:
            store.editar_publicacion(pub_id, g.user, {'nombre': f['nombre'], 'descripcion': f['descripcion'], 'cantidad': int(cantidad),
                                                      'precio_base': precio or 0, 'pct': int(pct or 0)})
            flash('Publicación actualizada.', 'exito')
            return redirect(url_for('empresa.publicaciones'))
    return render_template('empresa/editar.html', pub=pub, f=f, errores=errores)


@bp.route('/publicaciones/<pub_id>/cancelar', methods=['POST'])
@rol_requerido('empresa')
def cancelar(pub_id):
    try:
        pub = store.cancelar_publicacion(pub_id, g.user)
        flash(f'Publicación "{pub["alimento"]["nombre"]}" cancelada.', 'info')
    except ValueError as e:
        flash(str(e), 'error')
    return redirect(url_for('empresa.publicaciones'))


@bp.route('/reservaciones')
@rol_requerido('empresa')
def reservaciones():
    mias = [x for x in store.reservas_con_pub() if x['pub']['est']['id'] == g.user['est_id']]
    filtro = request.args.get('estado', 'todas')
    visibles = mias if filtro == 'todas' else [x for x in mias if x['pub']['estado'] == filtro]
    return render_template('empresa/reservaciones.html', items=visibles, filtro=filtro, total=len(mias),
                           por_entregar=sum(1 for x in mias if x['pub']['estado'] == 'reservado'),
                           entregadas=sum(1 for x in mias if x['pub']['estado'] == 'entregado'))


@bp.route('/reservaciones/<reserva_id>/confirmar', methods=['POST'])
@rol_requerido('empresa')
def confirmar(reserva_id):
    try:
        store.confirmar_entrega_empresa(reserva_id, g.user)
        flash('Entrega confirmada. El impacto se actualizó en Estadísticas.', 'exito')
    except ValueError as e:
        flash(str(e), 'error')
    return redirect(url_for('empresa.reservaciones'))
