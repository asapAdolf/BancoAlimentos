from datetime import datetime, timezone
from .database import db


def _ahora_utc():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Rol(db.Model):
    __tablename__ = 'roles'

    rolid = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    descripcion = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.rolid,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }


class Zona(db.Model):
    __tablename__ = 'zonas'

    zonaid = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    ciudad = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.zonaid,
            "nombre": self.nombre,
            "ciudad": self.ciudad
        }


class UnidadMedida(db.Model):
    __tablename__ = 'unidades_medida'

    unidadid = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    abreviatura = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {
            "id": self.unidadid,
            "nombre": self.nombre,
            "abreviatura": self.abreviatura
        }


class CategoriaAlimento(db.Model):
    __tablename__ = 'categorias_alimento'

    categoriaid = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.categoriaid,
            "nombre": self.nombre,
            "descripcion": self.descripcion
        }


class Usuario(db.Model):
    __tablename__ = 'usuarios'

    usuarioid = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    telefono = db.Column(db.String(20))
    passwordhash = db.Column(db.String(255), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)
    fecharegistro = db.Column(db.DateTime, default=_ahora_utc, nullable=False)

    def to_dict(self):
        return {
            "id": self.usuarioid,
            "nombre": self.nombre,
            "email": self.email,
            "telefono": self.telefono,
            "activo": self.activo,
            "fechaRegistro": self.fecharegistro.isoformat() if self.fecharegistro else None
        }


class Establecimiento(db.Model):
    __tablename__ = 'establecimientos'

    establecimientoid = db.Column(db.Integer, primary_key=True)
    zonaid = db.Column(db.Integer, db.ForeignKey('zonas.zonaid'), nullable=False)
    nombre = db.Column(db.String(150), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    telefono = db.Column(db.String(20))
    latitud = db.Column(db.Numeric(9, 6))
    longitud = db.Column(db.Numeric(9, 6))
    activo = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self):
        return {
            "id": self.establecimientoid,
            "nombre": self.nombre,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "latitud": float(self.latitud) if self.latitud else None,
            "longitud": float(self.longitud) if self.longitud else None,
            "activo": self.activo
        }


class HorarioRecoleccion(db.Model):
    __tablename__ = 'horarios_recoleccion'

    horarioid = db.Column(db.Integer, primary_key=True)
    fecharecoleccion = db.Column(db.Date, nullable=False)
    horainicio = db.Column(db.Time, nullable=False)
    horafin = db.Column(db.Time, nullable=False)

    def to_dict(self):
        return {
            "id": self.horarioid,
            "fecha": self.fecharecoleccion.isoformat() if self.fecharecoleccion else None,
            "desde": self.horainicio.strftime("%H:%M") if self.horainicio else None,
            "hasta": self.horafin.strftime("%H:%M") if self.horafin else None
        }


class Alimento(db.Model):
    __tablename__ = 'alimentos'

    alimentoid = db.Column(db.Integer, primary_key=True)
    categoriaid = db.Column(db.Integer, db.ForeignKey('categorias_alimento.categoriaid'), nullable=False)
    unidadid = db.Column(db.Integer, db.ForeignKey('unidades_medida.unidadid'), nullable=False)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text)
    cantidad = db.Column(db.Numeric(10, 2), nullable=False)
    fechacaducidad = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            "id": self.alimentoid,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "cantidad": float(self.cantidad) if self.cantidad else 0,
            "fechaCaducidad": self.fechacaducidad.isoformat() if self.fechacaducidad else None
        }


class Publicacion(db.Model):
    __tablename__ = 'publicaciones'

    publicacionid = db.Column(db.Integer, primary_key=True)
    establecimientoid = db.Column(db.Integer, db.ForeignKey('establecimientos.establecimientoid'), nullable=False)
    alimentoid = db.Column(db.Integer, db.ForeignKey('alimentos.alimentoid'), nullable=False)
    horarioid = db.Column(db.Integer, db.ForeignKey('horarios_recoleccion.horarioid'), nullable=False)
    tipopublicacion = db.Column(db.String(30), nullable=False)
    preciobase = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    porcentajedescuento = db.Column(db.Numeric(5, 2), nullable=False, default=0)
    estadoactual = db.Column(db.String(30), nullable=False)
    fechapublicacion = db.Column(db.DateTime, default=_ahora_utc, nullable=False)

    def to_dict(self):
        precio_final = float(self.preciobase) * (1 - (float(self.porcentajedescuento) / 100))
        return {
            "id": self.publicacionid,
            "establecimientoId": self.establecimientoid,
            "alimentoId": self.alimentoid,
            "modalidad": self.tipopublicacion,
            "precioBase": float(self.preciobase),
            "descuento": float(self.porcentajedescuento),
            "precioFinal": round(precio_final, 2),
            "estado": self.estadoactual,
            "fechaPublicacion": self.fechapublicacion.isoformat() if self.fechapublicacion else None
        }
