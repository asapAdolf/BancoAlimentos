"""Pantallas del rol ADMINISTRADOR: usuarios, publicaciones y reservaciones de toda la plataforma."""
from flask import Blueprint, flash, g, redirect, render_template, request, url_for

from .. import store
from ..seguridad import rol_requerido

bp = Blueprint('admin', __name__, url_prefix='/admin')


@bp.route('/usuarios')
@rol_requerido('administrador')
def usuarios():
    filtro = request.args.get('rol', 'todos')
    todos = list(store.S.USUARIOS.values())
    visibles = todos if filtro == 'todos' else [u for u in todos if u['rol'] == filtro]
    cuentas = {r: sum(1 for u in todos if u['rol'] == r) for r in store.ROLES}
    return render_template('admin/usuarios.html', usuarios=visibles, filtro=filtro, total=len(todos), cuentas=cuentas)


@bp.route('/usuarios/<email>/alternar', methods=['POST'])
@rol_requerido('administrador')
def alternar(email):
    try:
        u = store.alternar_usuario(email, g.user)
        flash(f'{u["nombre"]} ahora está {"activo" if u["activo"] else "suspendido"}.', 'exito' if u['activo'] else 'info')
    except ValueError as e:
        flash(str(e), 'error')
    return redirect(url_for('admin.usuarios', rol=request.form.get('rol', 'todos')))


@bp.route('/publicaciones')
@rol_requerido('administrador')
def publicaciones():
    filtro = request.args.get('estado', 'todas')
    todas = store.S.PUBLICACIONES
    visibles = todas if filtro == 'todas' else [p for p in todas if p['estado'] == filtro]
    cuentas = {e: sum(1 for p in todas if p['estado'] == e) for e in store.ESTADOS}
    return render_template('admin/publicaciones.html', pubs=visibles, filtro=filtro, total=len(todas), cuentas=cuentas)


@bp.route('/publicaciones/<pub_id>/retirar', methods=['POST'])
@rol_requerido('administrador')
def retirar(pub_id):
    try:
        pub = store.cancelar_publicacion(pub_id, g.user)
        flash(f'Publicación "{pub["alimento"]["nombre"]}" retirada del catálogo.', 'info')
    except ValueError as e:
        flash(str(e), 'error')
    return redirect(url_for('admin.publicaciones'))


@bp.route('/reservaciones')
@rol_requerido('administrador')
def reservaciones():
    return render_template('admin/reservaciones.html', items=store.reservas_con_pub())
