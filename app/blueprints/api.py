"""API REST conectada a PostgreSQL (BancoAlimentos). Todas las rutas cuelgan de /api."""
from flask import Blueprint, current_app, jsonify
from sqlalchemy import text

from ..database import db
from ..models import CategoriaAlimento, Publicacion, Rol, UnidadMedida, Usuario

bp = Blueprint('api', __name__, url_prefix='/api')


# -------------------------------------------------------------
# 1. Ruta de prueba y salud de la Base de Datos
# -------------------------------------------------------------
@bp.route('/salud', methods=['GET'])
def salud():
    try:
        # Query de verificación a PostgreSQL
        db.session.execute(text('SELECT 1'))

        # Conteo de tablas existentes en el esquema public
        resultado = db.session.execute(
            text("SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
        ).scalar()

        return jsonify({
            'status': 'ok',
            'mensaje': 'Conexión a PostgreSQL (BancoAlimentos) establecida exitosamente',
            'base_de_datos': current_app.config.get('DB_NAME', 'BancoAlimentos'),
            'host': current_app.config.get('DB_HOST', 'localhost'),
            'tablas_detectadas': resultado
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'mensaje': f'Error al conectar con PostgreSQL: {str(e)}'
        }), 500


# -------------------------------------------------------------
# 2. Rutas de Catálogos (Roles, Categorías, Unidades)
# -------------------------------------------------------------
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


# -------------------------------------------------------------
# 3. Usuarios
# -------------------------------------------------------------
@bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        return jsonify([u.to_dict() for u in Usuario.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# -------------------------------------------------------------
# 4. Publicaciones
# -------------------------------------------------------------
@bp.route('/publicaciones', methods=['GET'])
def obtener_publicaciones():
    try:
        return jsonify([p.to_dict() for p in Publicacion.query.all()]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# -------------------------------------------------------------
# 5. Semilla inicial de datos (para poblar catálogos si están vacíos)
# -------------------------------------------------------------
@bp.route('/seed', methods=['POST'])
def seed_data():
    try:
        creados = []

        # Roles iniciales
        if Rol.query.count() == 0:
            db.session.add_all([
                Rol(nombre='Administrador', descripcion='Control total del sistema'),
                Rol(nombre='Establecimiento', descripcion='Donante o vendedor de alimentos'),
                Rol(nombre='Beneficiario', descripcion='Persona u organización receptora'),
                Rol(nombre='Transportista', descripcion='Encargado de la logística de recolección'),
            ])
            creados.append('Roles')

        # Categorías iniciales
        if CategoriaAlimento.query.count() == 0:
            db.session.add_all([
                CategoriaAlimento(nombre='Pan y Repostería', descripcion='Panadería, bollería y galletas'),
                CategoriaAlimento(nombre='Frutas y Verduras', descripcion='Productos frescos del campo'),
                CategoriaAlimento(nombre='Lácteos', descripcion='Leches, quesos, yogures'),
                CategoriaAlimento(nombre='Comida Preparada', descripcion='Platillos preparados del día'),
                CategoriaAlimento(nombre='Abarrotes', descripcion='Granos, pastas, enlatados'),
            ])
            creados.append('Categorías')

        # Unidades de medida
        if UnidadMedida.query.count() == 0:
            db.session.add_all([
                UnidadMedida(nombre='Kilogramos', abreviatura='kg'),
                UnidadMedida(nombre='Piezas', abreviatura='pz'),
                UnidadMedida(nombre='Litros', abreviatura='L'),
                UnidadMedida(nombre='Cajas', abreviatura='cj'),
                UnidadMedida(nombre='Porciones', abreviatura='porc'),
            ])
            creados.append('Unidades de Medida')

        db.session.commit()
        return jsonify({
            'status': 'ok',
            'mensaje': 'Datos iniciales procesados correctamente',
            'elementos_agregados': creados
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'mensaje': str(e)}), 500
