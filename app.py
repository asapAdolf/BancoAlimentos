import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import text
from config import Config
from database import db
from models import Rol, CategoriaAlimento, UnidadMedida, Usuario, Establecimiento, Alimento, HorarioRecoleccion, Publicacion

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)

    # -------------------------------------------------------------
    # 1. Ruta de prueba y salud de la Base de Datos
    # -------------------------------------------------------------
    @app.route("/api/salud", methods=["GET"])
    def salud():
        try:
            # Query de verificación a PostgreSQL
            db.session.execute(text("SELECT 1"))
            
            # Conteo de tablas existentes en el esquema public
            resultado = db.session.execute(
                text("SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
            ).scalar()

            return jsonify({
                "status": "ok",
                "mensaje": "Conexión a PostgreSQL (BancoAlimentos) establecida exitosamente",
                "base_de_datos": app.config.get("DB_NAME", "BancoAlimentos"),
                "host": app.config.get("DB_HOST", "localhost"),
                "tablas_detectadas": resultado
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "mensaje": f"Error al conectar con PostgreSQL: {str(e)}"
            }), 500

    # -------------------------------------------------------------
    # 2. Rutas de Catálogos (Roles, Categorías, Unidades)
    # -------------------------------------------------------------
    @app.route("/api/roles", methods=["GET"])
    def obtener_roles():
        try:
            roles = Rol.query.all()
            return jsonify([r.to_dict() for r in roles]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/categorias", methods=["GET"])
    def obtener_categorias():
        try:
            categorias = CategoriaAlimento.query.all()
            return jsonify([c.to_dict() for c in categorias]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/api/unidades", methods=["GET"])
    def obtener_unidades():
        try:
            unidades = UnidadMedida.query.all()
            return jsonify([u.to_dict() for u in unidades]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # -------------------------------------------------------------
    # 3. Usuarios
    # -------------------------------------------------------------
    @app.route("/api/usuarios", methods=["GET"])
    def obtener_usuarios():
        try:
            usuarios = Usuario.query.all()
            return jsonify([u.to_dict() for u in usuarios]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # -------------------------------------------------------------
    # 4. Publicaciones
    # -------------------------------------------------------------
    @app.route("/api/publicaciones", methods=["GET"])
    def obtener_publicaciones():
        try:
            publicaciones = Publicacion.query.all()
            return jsonify([p.to_dict() for p in publicaciones]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # -------------------------------------------------------------
    # 5. Semilla inicial de datos (para poblar catálogos si están vacíos)
    # -------------------------------------------------------------
    @app.route("/api/seed", methods=["POST"])
    def seed_data():
        try:
            creados = []
            
            # Roles iniciales
            if Rol.query.count() == 0:
                roles = [
                    Rol(nombre="Administrador", descripcion="Control total del sistema"),
                    Rol(nombre="Establecimiento", descripcion="Donante o vendedor de alimentos"),
                    Rol(nombre="Beneficiario", descripcion="Persona u organización receptora"),
                    Rol(nombre="Transportista", descripcion="Encargado de la logística de recolección")
                ]
                db.session.add_all(roles)
                creados.append("Roles")

            # Categorías iniciales
            if CategoriaAlimento.query.count() == 0:
                cats = [
                    CategoriaAlimento(nombre="Pan y Repostería", descripcion="Panadería, bollería y galletas"),
                    CategoriaAlimento(nombre="Frutas y Verduras", descripcion="Productos frescos del campo"),
                    CategoriaAlimento(nombre="Lácteos", descripcion="Leches, quesos, yogures"),
                    CategoriaAlimento(nombre="Comida Preparada", descripcion="Platillos preparados del día"),
                    CategoriaAlimento(nombre="Abarrotes", descripcion="Granos, pastas, enlatados")
                ]
                db.session.add_all(cats)
                creados.append("Categorías")

            # Unidades de medida
            if UnidadMedida.query.count() == 0:
                unidades = [
                    UnidadMedida(nombre="Kilogramos", abreviatura="kg"),
                    UnidadMedida(nombre="Piezas", abreviatura="pz"),
                    UnidadMedida(nombre="Litros", abreviatura="L"),
                    UnidadMedida(nombre="Cajas", abreviatura="cj"),
                    UnidadMedida(nombre="Porciones", abreviatura="porc")
                ]
                db.session.add_all(unidades)
                creados.append("Unidades de Medida")

            db.session.commit()
            return jsonify({
                "status": "ok",
                "mensaje": "Datos iniciales procesados correctamente",
                "elementos_agregados": creados
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "mensaje": str(e)}), 500

    return app

app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)
