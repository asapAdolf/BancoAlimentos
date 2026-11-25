"""Inicio de sesión, registro y cierre de sesión."""
import re

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for

from .. import store

bp = Blueprint('auth', __name__)

CORREO = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')

ROLES_REGISTRO = ('cliente', 'empresa', 'transportista')


def _destino_seguro(destino):
    """Solo se permite volver a rutas internas (evita redirecciones a otros sitios)."""
    if destino and destino.startswith('/') and not destino.startswith('//'):
        return destino
    return url_for('panel.resumen')


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if g.user:
        return redirect(url_for('panel.resumen'))
    errores, email = {}, ''
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        clave = request.form.get('password', '')
        if not email:
            errores['email'] = 'El correo es obligatorio.'
        elif not CORREO.match(email):
            errores['email'] = 'Escribe un correo válido, por ejemplo nombre@correo.com.'
        if not clave:
            errores['password'] = 'La contraseña es obligatoria.'
        if not errores:
            existente = store.get_usuario(email)
            if existente is None:
                errores['general'] = 'No existe una cuenta con ese correo. Regístrate para continuar.'
            elif not existente['activo']:
                errores['general'] = 'Esta cuenta está suspendida. Contacta a un administrador.'
            elif store.autenticar_usuario(email, clave) is None:
                errores['general'] = 'Correo o contraseña incorrectos.'
            else:
                session.clear()
                session['email'] = email
                flash(f'¡Bienvenido, {existente["nombre"].split(" ")[0]}!', 'exito')
                return redirect(_destino_seguro(request.args.get('next')))
    return render_template('auth/login.html', errores=errores, email=email)


@bp.route('/registro', methods=['GET', 'POST'])
def registro():
    if g.user:
        return redirect(url_for('panel.resumen'))
    f = {'rol': request.args.get('rol', 'cliente'), 'nombre': '', 'email': '', 'telefono': '', 'establecimiento': '',
         'giro': store.GIROS[0], 'vehiculo': ''}
    if f['rol'] not in ROLES_REGISTRO:
        f['rol'] = 'cliente'
    errores = {}
    if request.method == 'POST':
        for campo in f:
            f[campo] = request.form.get(campo, f[campo]).strip()
        clave = request.form.get('password', '')
        if f['rol'] not in ROLES_REGISTRO:
            f['rol'] = 'cliente'
        if len(f['nombre']) < 3:
            errores['nombre'] = 'Escribe al menos 3 caracteres.'
        if not CORREO.match(f['email']):
            errores['email'] = 'Escribe un correo válido, por ejemplo nombre@correo.com.'
        if len(clave) < 8:
            errores['password'] = 'Debe tener al menos 8 caracteres.'
        elif not re.search(r'[A-Za-z]', clave) or not re.search(r'\d', clave):
            errores['password'] = 'Debe incluir letras y números.'
        if not re.fullmatch(r'\d{10}', f['telefono'].replace(' ', '')):
            errores['telefono'] = 'Escribe un teléfono de 10 dígitos.'
        if f['rol'] == 'empresa':
            if len(f['establecimiento']) < 3:
                errores['establecimiento'] = 'Escribe el nombre de tu establecimiento.'
            if f['giro'] not in store.GIROS:
                f['giro'] = store.GIROS[0]
        if f['rol'] == 'transportista' and len(f['vehiculo']) < 3:
            errores['vehiculo'] = 'Indica tu vehículo (por ejemplo: Camioneta Nissan NP300).'
        if not errores:
            try:
                usuario = store.registrar_usuario(f['email'], f['nombre'], f['rol'], f['telefono'].replace(' ', ''),
                                                  f['establecimiento'], f['giro'], f['vehiculo'], password=clave)
            except ValueError as e:
                errores['email'] = str(e)
            else:
                session.clear()
                session['email'] = usuario['email']
                flash('¡Cuenta creada! Bienvenido a Rescate Alimentario.', 'exito')
                return redirect(url_for('panel.resumen'))
    return render_template('auth/registro.html', f=f, errores=errores)


@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    flash('Cerraste sesión.', 'info')
    return redirect(url_for('publico.inicio'))
