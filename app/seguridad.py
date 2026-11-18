"""Control de acceso por rol (SOLO de interfaz: decide qué pantallas puede abrir cada tipo de usuario)."""
from functools import wraps

from flask import abort, flash, g, redirect, request, url_for


def login_requerido(vista):
    @wraps(vista)
    def envoltura(*args, **kwargs):
        if g.user is None:
            flash('Inicia sesión para continuar.', 'info')
            return redirect(url_for('auth.login', next=request.full_path.rstrip('?')))
        return vista(*args, **kwargs)
    return envoltura


def rol_requerido(*roles):
    def decorador(vista):
        @wraps(vista)
        @login_requerido
        def envoltura(*args, **kwargs):
            if g.user['rol'] not in roles:
                abort(403)
            return vista(*args, **kwargs)
        return envoltura
    return decorador
