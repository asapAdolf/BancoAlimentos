from flask import Flask, g, render_template, request, session
from flask_cors import CORS

from . import store, utils
from .config import Config
from .database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    store.reset()
    utils.registrar(app)

    from .blueprints import admin, api, auth, cliente, empresa, panel, publico, transportista
    for modulo in (publico, auth, panel, cliente, empresa, transportista, admin, api):
        app.register_blueprint(modulo.bp)

    @app.before_request
    def cargar_usuario():
        """Carga al usuario de la sesión. Si fue suspendido o ya no existe, se cierra su sesión."""
        email = session.get('email')
        g.user = store.get_usuario(email) if email else None
        if email and (g.user is None or not g.user['activo']):
            session.clear()
            g.user = None

    @app.context_processor
    def contexto():
        """Variables disponibles en TODAS las plantillas."""
        user = g.get('user')
        menu = []
        if user:
            menu = [{'endpoint': e, 'texto': t, 'icono': i, 'activo': request.endpoint in (e, *extra)}
                    for e, t, i, extra in utils.MENUS[user['rol']]]
        return {
            'usuario': user,
            'layout': 'base_panel.html' if user else 'base_public.html',
            'menu': menu,
            'no_leidas': store.no_leidas(user) if user else 0,
        }

    @app.errorhandler(403)
    def prohibido(_):
        return render_template('errores/403.html'), 403

    @app.errorhandler(404)
    def no_encontrado(_):
        return render_template('errores/404.html'), 404

    return app
