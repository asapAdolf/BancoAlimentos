"""API REST conectada a PostgreSQL (BancoAlimentos). Todas las rutas cuelgan de /api."""
from flask import Blueprint, current_app, jsonify
from sqlalchemy import text

from ..database import db
from ..models import CategoriaAlimento, Publicacion, Rol, UnidadMedida, Usuario, UsuarioRol

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/salud', methods=['GET'])
def salud():
    try:
        db.session.execute(text('SELECT 1'))

        resultado = db.session.execute(
            text("SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
        ).scalar()

        nombre_bd = db.engine.url.database or current_app.config.get('DB_NAME', 'banco_alimentos')
        host_bd = db.engine.url.host or current_app.config.get('DB_HOST', 'localhost')

        return jsonify({
            'status': 'ok',
            'mensaje': f'Conexión a PostgreSQL ({nombre_bd}) establecida exitosamente',
            'base_de_datos': nombre_bd,
            'host': host_bd,
            'tablas_detectadas': resultado
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'mensaje': f'Error al conectar con PostgreSQL: {str(e)}'
        }), 500

@bp.route('/roles', methods=['GET'])
def obtener_roles():
    try:
        return jsonify([r.to_dict() for r in Rol.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/categorias', methods=['GET'])
def obtener_categorias():
    try:
        return jsonify([c.to_dict() for c in CategoriaAlimento.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/unidades', methods=['GET'])
def obtener_unidades():
    try:
        return jsonify([u.to_dict() for u in UnidadMedida.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        return jsonify([u.to_dict() for u in Usuario.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/publicaciones', methods=['GET'])
def obtener_publicaciones():
    try:
        return jsonify([p.to_dict() for p in Publicacion.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/seed', methods=['POST'])
def seed_data():
    try:
        creados = []

        if Rol.query.count() == 0:
            db.session.add_all([
                Rol(nombre='Administrador', descripcion='Control total del sistema'),
                Rol(nombre='Establecimiento', descripcion='Donante o vendedor de alimentos'),
                Rol(nombre='Beneficiario', descripcion='Persona u organización receptora'),
                Rol(nombre='Transportista', descripcion='Encargado de la logística de recolección'),
            ])
            creados.append('Roles')

        if CategoriaAlimento.query.count() == 0:
            db.session.add_all([
                CategoriaAlimento(nombre='Pan y Repostería', descripcion='Panadería, bollería y galletas'),
                CategoriaAlimento(nombre='Frutas y Verduras', descripcion='Productos frescos del campo'),
                CategoriaAlimento(nombre='Lácteos', descripcion='Leches, quesos, yogures'),
                CategoriaAlimento(nombre='Comida Preparada', descripcion='Platillos preparados del día'),
                CategoriaAlimento(nombre='Abarrotes', descripcion='Granos, pastas, enlatados'),
            ])
            creados.append('Categorías')

        if UnidadMedida.query.count() == 0:
            db.session.add_all([
                UnidadMedida(nombre='Kilogramos', abreviatura='kg'),
                UnidadMedida(nombre='Piezas', abreviatura='pz'),
                UnidadMedida(nombre='Litros', abreviatura='L'),
                UnidadMedida(nombre='Cajas', abreviatura='cj'),
                UnidadMedida(nombre='Porciones', abreviatura='porc'),
            ])
            creados.append('Unidades de Medida')

        # Cuentas demo iniciales con contraseña vacía
        cuentas_demo = [
            ('cliente@demo.mx', 'Cliente Demo', 'Beneficiario', '2221234567'),
            ('empresa@demo.mx', 'Empresa Demo', 'Establecimiento', '2225554433'),
            ('transportista@demo.mx', 'Transportista Demo', 'Transportista', '2227778899'),
            ('admin@demo.mx', 'Administrador Demo', 'Administrador', '2220000000'),
        ]
        roles_map = {r.nombre: r.rolid for r in Rol.query.all()}
        for email, nombre, rol_nom, tel in cuentas_demo:
            u = Usuario.query.filter_by(email=email).first()
            if not u:
                u = Usuario(nombre=nombre, email=email, telefono=tel, passwordhash='', activo=True)
                db.session.add(u)
                db.session.flush()
                rol_id = roles_map.get(rol_nom)
                if rol_id:
                    db.session.add(UsuarioRol(usuarioid=u.usuarioid, rolid=rol_id))
                creados.append(f'Usuario {email}')

        db.session.commit()
        return jsonify({
            'status': 'ok',
            'mensaje': 'Datos iniciales procesados correctamente',
            'elementos_agregados': creados
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'mensaje': str(e)}), 500
