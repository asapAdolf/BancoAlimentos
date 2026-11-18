"""Pantallas del rol CLIENTE: reservar alimentos y consultar sus reservaciones."""
from flask import Blueprint, flash, g, redirect, render_template, request, url_for

from .. import store
from ..seguridad import rol_requerido

bp = Blueprint('cliente', __name__, url_prefix='/cliente')


@bp.route('/reservaciones')
@rol_requerido('cliente')
def reservaciones():
    mis = [x for x in store.reservas_con_pub() if x['r']['cliente_email'] == g.user['email']]
    filtro = request.args.get('estado', 'todas')
    visibles = mis if filtro == 'todas' else [x for x in mis if x['pub']['estado'] == filtro]
    return render_template('cliente/reservaciones.html', items=visibles, filtro=filtro, total=len(mis),
                           por_recoger=sum(1 for x in mis if x['pub']['estado'] == 'reservado'),
                           entregadas=sum(1 for x in mis if x['pub']['estado'] == 'entregado'))


@bp.route('/reservar/<pub_id>', methods=['POST'])
@rol_requerido('cliente')
def reservar(pub_id):
    try:
        store.reservar(pub_id, g.user, request.form.get('modo', ''), request.form.get('direccion', ''))
    except ValueError as e:
        flash(str(e), 'error')
        return redirect(url_for('publico.detalle', pub_id=pub_id))
    flash('Reservación realizada. Aquí puedes consultar tu código y el horario de recolección.', 'exito')
    return redirect(url_for('cliente.reservaciones'))
