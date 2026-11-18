"""Pantallas del rol TRANSPORTISTA: tomar entregas, llevarlas y marcarlas como entregadas."""
from flask import Blueprint, flash, g, redirect, render_template, url_for

from .. import store
from ..seguridad import rol_requerido

bp = Blueprint('transportista', __name__, url_prefix='/transportista')


@bp.route('/entregas-disponibles')
@rol_requerido('transportista')
def disponibles():
    items = [x for x in store.reservas_con_pub() if x['r']['transporte'] == 'pendiente']
    return render_template('transportista/disponibles.html', items=items)


@bp.route('/mis-entregas')
@rol_requerido('transportista')
def mis_entregas():
    mias = [x for x in store.reservas_con_pub() if x['r']['transportista_email'] == g.user['email']]
    activas = [x for x in mias if x['r']['transporte'] in ('asignado', 'en_camino')]
    historial = [x for x in mias if x['r']['transporte'] == 'entregado']
    return render_template('transportista/mis_entregas.html', activas=activas, historial=historial)


@bp.route('/entregas/<reserva_id>/aceptar', methods=['POST'])
@rol_requerido('transportista')
def aceptar(reserva_id):
    try:
        store.aceptar_entrega(reserva_id, g.user)
        flash('Entrega aceptada. La encuentras en "Mis entregas".', 'exito')
        return redirect(url_for('transportista.mis_entregas'))
    except ValueError as e:
        flash(str(e), 'error')
        return redirect(url_for('transportista.disponibles'))


@bp.route('/entregas/<reserva_id>/avanzar', methods=['POST'])
@rol_requerido('transportista')
def avanzar(reserva_id):
    try:
        r = store.avanzar_entrega(reserva_id, g.user)
        flash('Entrega completada. ¡Gracias por rescatar alimentos!' if r['transporte'] == 'entregado'
              else 'Marcaste el pedido como recogido y en camino.', 'exito')
    except ValueError as e:
        flash(str(e), 'error')
    return redirect(url_for('transportista.mis_entregas'))
