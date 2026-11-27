"""Panel principal (resumen según el rol) y centro de notificaciones."""
from flask import Blueprint, flash, g, redirect, render_template, request, url_for

from .. import store
from ..seguridad import login_requerido

bp = Blueprint('panel', __name__)

@bp.route('/panel')
@login_requerido
def resumen():
    u, S = g.user, store.S
    rol = u['rol']
    datos = {'recientes': S.PUBLICACIONES[:4], 'avisos': store.notifs_de(u)[:4], 'registro': S.REGISTRO}
    todas = store.reservas_con_pub()

    if rol == 'cliente':
        mis = [x for x in todas if x['r']['cliente_email'] == u['email']]
        hechas = [x for x in mis if x['pub']['estado'] == 'entregado']
        datos.update(
            por_recoger=[x for x in mis if x['pub']['estado'] == 'reservado'],
            n_disponibles=sum(1 for p in S.PUBLICACIONES if p['estado'] == 'disponible'),
            n_hechas=len(hechas), kilos_mios=sum(x['pub']['alimento']['kilos'] for x in hechas), n_mis=len(mis))
    elif rol == 'empresa':
        mias = store.pubs_de_empresa(u)
        cuenta = lambda e: sum(1 for p in mias if p['estado'] == e)
        datos.update(
            recientes=mias[:4], n_disponibles=cuenta('disponible'), n_reservadas=cuenta('reservado'), n_entregadas=cuenta('entregado'),
            kilos_mios=sum(p['alimento']['kilos'] for p in mias if p['estado'] == 'entregado'),
            pendientes=[x for x in todas if x['pub']['est']['id'] == u['est_id'] and x['pub']['estado'] == 'reservado'])
    elif rol == 'transportista':
        mias = [x for x in todas if x['r']['transportista_email'] == u['email']]
        datos.update(
            disponibles=[x for x in todas if x['r']['transporte'] == 'pendiente'],
            activas=[x for x in mias if x['r']['transporte'] in ('asignado', 'en_camino')],
            n_hechas=sum(1 for x in mias if x['r']['transporte'] == 'entregado'),
            kilos_mios=sum(x['pub']['alimento']['kilos'] for x in mias if x['r']['transporte'] == 'entregado'))
    else:
        por_rol = {r: sum(1 for x in S.USUARIOS.values() if x['rol'] == r) for r in store.ROLES}
        datos.update(
            por_rol=por_rol, n_usuarios=len(S.USUARIOS), n_activas=sum(1 for p in S.PUBLICACIONES if p['estado'] != 'entregado'),
            n_reservas=len(S.RESERVACIONES), ultimos=list(S.USUARIOS.values())[-5:][::-1],
            n_suspendidos=sum(1 for x in S.USUARIOS.values() if not x['activo']))
    return render_template('panel/resumen.html', **datos)

@bp.route('/notificaciones')
@login_requerido
def notificaciones():
    todas = store.notifs_de(g.user)
    solo_sin_leer = request.args.get('ver') == 'sin_leer'
    visibles = [n for n in todas if not n['leida']] if solo_sin_leer else todas
    return render_template('panel/notificaciones.html', notifs=visibles, total=len(todas), sin_leer=sum(1 for n in todas if not n['leida']),
                           solo_sin_leer=solo_sin_leer, existentes={p['id'] for p in store.S.PUBLICACIONES})

@bp.route('/notificaciones/leer/<notif_id>', methods=['POST'])
@login_requerido
def leer(notif_id):
    store.marcar_leida(g.user, notif_id)
    destino = request.form.get('ir')
    return redirect(destino if destino and destino.startswith('/') and not destino.startswith('//') else url_for('panel.notificaciones'))

@bp.route('/notificaciones/leer-todas', methods=['POST'])
@login_requerido
def leer_todas():
    store.marcar_todas_leidas(g.user)
    flash('Marcaste todas las notificaciones como leídas.', 'exito')
    return redirect(url_for('panel.notificaciones'))
