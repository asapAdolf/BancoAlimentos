"""Almacenamiento operativo en memoria y constantes esenciales de la plataforma."""
import os
import random
from datetime import date, datetime, timedelta
from types import SimpleNamespace
from werkzeug.security import check_password_hash, generate_password_hash

ROLES = ('cliente', 'empresa', 'transportista', 'administrador')

ETIQUETA_ROL = {
    'cliente': 'Cliente',
    'empresa': 'Empresa',
    'transportista': 'Transportista',
    'administrador': 'Administrador',
}
ETIQUETA_MODALIDAD = {'venta': 'Venta', 'descuento': 'Con descuento', 'donacion': 'Donación'}
ETIQUETA_ESTADO = {'disponible': 'Disponible', 'reservado': 'Reservado', 'entregado': 'Entregado'}
ETIQUETA_ESTRATEGIA = {
    'caducidad': 'Descuento por caducidad',
    'disponibilidad': 'Descuento por disponibilidad',
}
ETIQUETA_TRANSPORTE = {
    'pendiente': 'Esperando transportista',
    'asignado': 'Transportista asignado',
    'en_camino': 'En camino',
    'entregado': 'Entregado',
}
MODALIDADES = ('venta', 'descuento', 'donacion')
ESTADOS = ('disponible', 'reservado', 'entregado')
CATEGORIAS = ('Pan y repostería', 'Frutas y verduras', 'Comida preparada', 'Lácteos', 'Bebidas', 'Abarrotes')
UNIDADES = ('piezas', 'porciones', 'cajas', 'botellas', 'paquetes')
ZONAS = ('Centro', 'Norte', 'Sur', 'Oriente', 'Poniente')
GIROS = ('Panadería', 'Cafetería', 'Restaurante', 'Supermercado')
PRECIO_MAXIMO = 800

def _u(id_):
    return f'https://images.unsplash.com/{id_}?auto=format&fit=crop&w=800&q=70'

FOTOS = {
    'pan': _u('photo-1509440159596-0249088772ff'),
    'croissant': _u('photo-1555507036-ab1f4038808a'),
    'pastel': _u('photo-1578985545062-69928b1d9587'),
    'verduras': _u('photo-1542838132-92c53300491e'),
    'frutas': _u('photo-1610832958506-aa56368176cf'),
    'ensalada': _u('photo-1512621776951-a57141f2eefd'),
    'pizza': _u('photo-1565299624946-b28f40a0ae38'),
    'pasta': _u('photo-1473093295043-cdd812d0e601'),
    'hamburguesa': _u('photo-1551782450-a2132b4ba21d'),
    'desayuno': _u('photo-1482049016688-2d3e1b311543'),
    'leche': _u('photo-1550583724-b2692b85b150'),
    'jugo': _u('photo-1600271886742-f049cd451bba'),
    'abarrotes': _u('photo-1604719312566-8912e9227c6a'),
}
FOTO_POR_CATEGORIA = {
    'Pan y repostería': FOTOS['pan'],
    'Frutas y verduras': FOTOS['verduras'],
    'Comida preparada': FOTOS['pasta'],
    'Lácteos': FOTOS['leche'],
    'Bebidas': FOTOS['jugo'],
    'Abarrotes': FOTOS['abarrotes'],
}

S = SimpleNamespace()

def _dia(n):
    return (date.today() + timedelta(days=n)).isoformat()

def _meses_recientes():
    nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    hoy = date.today()
    salida = []
    for i in range(5, -1, -1):
        m = hoy.month - 1 - i
        salida.append(nombres[m % 12])
    return salida

def reset():
    """Inicializa el estado operativo limpio (solo cuenta administradora esencial y contadores en cero)."""
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@bancoalimentos.mx').strip().lower()
    admin_password = os.getenv('ADMIN_PASSWORD', 'admin1234')

    S.ESTABLECIMIENTOS = [
        {
            'id': 'est-01',
            'nombre': 'Empresa Demo',
            'giro': 'Panadería',
            'email': 'empresa@demo.mx',
            'direccion': 'Av. Principal 100, Col. Centro',
            'zona': 'Centro',
            'punto': 'Mostrador principal',
            'telefono': '2225554433',
        }
    ]
    S.USUARIOS = {
        'cliente@demo.mx': {
            'email': 'cliente@demo.mx',
            'nombre': 'Cliente Demo',
            'rol': 'cliente',
            'telefono': '2221234567',
            'activo': True,
            'creado': _dia(0),
            'password_hash': '',
        },
        'empresa@demo.mx': {
            'email': 'empresa@demo.mx',
            'nombre': 'Empresa Demo',
            'rol': 'empresa',
            'telefono': '2225554433',
            'activo': True,
            'creado': _dia(0),
            'est_id': 'est-01',
            'password_hash': '',
        },
        'transportista@demo.mx': {
            'email': 'transportista@demo.mx',
            'nombre': 'Transportista Demo',
            'rol': 'transportista',
            'telefono': '2227778899',
            'activo': True,
            'creado': _dia(0),
            'vehiculo': 'Camioneta de reparto',
            'password_hash': '',
        },
        'admin@demo.mx': {
            'email': 'admin@demo.mx',
            'nombre': 'Administrador Demo',
            'rol': 'administrador',
            'telefono': '2220000000',
            'activo': True,
            'creado': _dia(0),
            'password_hash': '',
        },
        admin_email: {
            'email': admin_email,
            'nombre': 'Administrador',
            'rol': 'administrador',
            'telefono': '',
            'activo': True,
            'creado': _dia(0),
            'password_hash': generate_password_hash(admin_password),
        },
    }
    S.PUBLICACIONES = []
    S.RESERVACIONES = []
    S.NOTIFICACIONES = []
    S.LEIDAS = {}
    S.REGISTRO = {
        'kilos_total': 0,
        'recuperados': 0,
        'entregas': 0,
        'mensual': [(mes, 0) for mes in _meses_recientes()],
        'por_modalidad': {'venta': 0, 'descuento': 0, 'donacion': 0},
        'por_categoria': {cat: 0 for cat in CATEGORIAS},
    }

def get_usuario(email):
    if not email:
        return None
    email_clean = email.strip().lower()
    u = S.USUARIOS.get(email_clean)
    if u:
        return u
    try:
        from .models import Usuario, Rol, UsuarioRol
        db_user = Usuario.query.filter_by(email=email_clean).first()
        if db_user:
            rol_nombre = 'cliente'
            ur = UsuarioRol.query.filter_by(usuarioid=db_user.usuarioid).first()
            if ur:
                r = Rol.query.get(ur.rolid)
                if r:
                    nom = r.nombre.lower()
                    if 'admin' in nom:
                        rol_nombre = 'administrador'
                    elif 'transp' in nom:
                        rol_nombre = 'transportista'
                    elif 'estab' in nom or 'empresa' in nom:
                        rol_nombre = 'empresa'
                    else:
                        rol_nombre = 'cliente'
            u = {
                'email': db_user.email,
                'nombre': db_user.nombre,
                'rol': rol_nombre,
                'telefono': db_user.telefono or '',
                'activo': db_user.activo,
                'creado': _dia(0),
                'password_hash': db_user.passwordhash,
            }
            if rol_nombre == 'empresa':
                if not S.ESTABLECIMIENTOS:
                    S.ESTABLECIMIENTOS.append({
                        'id': 'est-01',
                        'nombre': 'Establecimiento ' + db_user.nombre,
                        'giro': 'Comercio',
                        'email': db_user.email,
                        'direccion': 'Dirección registrada',
                        'zona': 'Centro',
                        'punto': 'Entrada principal',
                        'telefono': db_user.telefono or '',
                    })
                u['est_id'] = S.ESTABLECIMIENTOS[0]['id']
            elif rol_nombre == 'transportista':
                u['vehiculo'] = 'Vehículo de reparto'
            S.USUARIOS[email_clean] = u
            return u
    except Exception:
        pass
    return None

def autenticar_usuario(email, password):
    u = get_usuario(email)
    if not u:
        return None
    pw_hash = u.get('password_hash')
    if pw_hash and not check_password_hash(pw_hash, password):
        return None
    return u

def get_pub(pub_id):
    return next((p for p in S.PUBLICACIONES if p['id'] == pub_id), None)

def get_reserva(reserva_id):
    return next((r for r in S.RESERVACIONES if r['id'] == reserva_id), None)

def reserva_de_pub(pub_id):
    return next((r for r in S.RESERVACIONES if r['pub_id'] == pub_id), None)

def reservas_con_pub():
    salida = []
    for r in S.RESERVACIONES:
        p = get_pub(r['pub_id'])
        if p:
            salida.append({'r': r, 'pub': p})
    return salida

def pubs_de_empresa(user):
    return [p for p in S.PUBLICACIONES if p['est']['id'] == user.get('est_id')]

def precio_final(pub):
    if pub['modalidad'] == 'donacion':
        return 0
    if pub['modalidad'] == 'descuento':
        return round(pub['precio_base'] * (1 - pub['pct'] / 100), 2)
    return pub['precio_base']

def descuento_aplicado(pub):
    return pub['pct'] if pub['modalidad'] == 'descuento' else 0

def notifs_de(user):
    leidas = S.LEIDAS.get(user['email'], set())
    return [dict(n, leida=n['id'] in leidas) for n in S.NOTIFICACIONES if n['para'] in (user['email'], user['rol'])]

def no_leidas(user):
    return sum(1 for n in notifs_de(user) if not n['leida'])

def _avisar(tipo, titulo, mensaje, para, pub_id=None):
    S.NOTIFICACIONES.insert(0, {'id': f'n-{random.randint(10**6, 10**7)}', 'tipo': tipo, 'titulo': titulo, 'mensaje': mensaje,
                                'fecha': datetime.now().isoformat(timespec='seconds'), 'para': para, 'pub_id': pub_id})

def marcar_leida(user, notif_id):
    S.LEIDAS.setdefault(user['email'], set()).add(notif_id)

def marcar_todas_leidas(user):
    S.LEIDAS.setdefault(user['email'], set()).update(n['id'] for n in notifs_de(user))

def registrar_usuario(email, nombre, rol, telefono, establecimiento='', giro='', vehiculo='', password=''):
    email = email.strip().lower()
    if email in S.USUARIOS:
        raise ValueError('Ya existe una cuenta con ese correo.')
    if rol not in ('cliente', 'empresa', 'transportista'):
        raise ValueError('Tipo de cuenta no válido.')
    u = {
        'email': email,
        'nombre': nombre.strip(),
        'rol': rol,
        'telefono': telefono,
        'activo': True,
        'creado': _dia(0),
        'password_hash': generate_password_hash(password) if password else None,
    }
    if rol == 'empresa':
        est_id = f'est-{len(S.ESTABLECIMIENTOS) + 1:02d}'
        S.ESTABLECIMIENTOS.append({'id': est_id, 'nombre': establecimiento.strip(), 'giro': giro, 'email': email,
                                   'direccion': 'Dirección registrada en sucursal', 'zona': 'Centro',
                                   'punto': 'Entrada principal', 'telefono': telefono})
        u['est_id'] = est_id
    if rol == 'transportista':
        u['vehiculo'] = vehiculo.strip()
    S.USUARIOS[email] = u
    S.LEIDAS[email] = {n['id'] for n in S.NOTIFICACIONES}
    _avisar('usuario', 'Nuevo usuario registrado', f'{u["nombre"]} se registró como {ETIQUETA_ROL[rol].lower()}.', 'administrador')
    return u

def publicar(datos, user):
    est = next(e for e in S.ESTABLECIMIENTOS if e['id'] == user['est_id'])
    d = datos
    nueva = {
        'id': f'p-{random.randint(100000, 999999)}', 'modalidad': d['modalidad'], 'estado': 'disponible',
        'estrategia': d['estrategia'] if d['modalidad'] == 'descuento' else None,
        'precio_base': 0 if d['modalidad'] == 'donacion' else d['precio_base'],
        'pct': d['pct'] if d['modalidad'] == 'descuento' else 0,
        'est': est, 'fecha_pub': datetime.now().isoformat(timespec='seconds'),
        'horario': {'fecha': d['fecha_rec'], 'desde': d['desde'], 'hasta': d['hasta']},
        'alimento': {'nombre': d['nombre'], 'descripcion': d['descripcion'] or 'Sin descripción.', 'categoria': d['categoria'],
                     'unidad': d['unidad'], 'cantidad': d['cantidad'], 'kilos': d['kilos'], 'caducidad': d['caducidad'],
                     'foto': FOTO_POR_CATEGORIA[d['categoria']]},
    }
    S.PUBLICACIONES.insert(0, nueva)
    if nueva['modalidad'] == 'descuento':
        _avisar('descuento', 'Nueva publicación con descuento',
                f'{est["nombre"]} publicó "{d["nombre"]}" con {nueva["pct"]}% de descuento.', 'cliente', nueva['id'])
    else:
        _avisar('nuevo', 'Nuevo alimento disponible', f'{est["nombre"]} publicó "{d["nombre"]}".', 'cliente', nueva['id'])
    return nueva

def editar_publicacion(pub_id, user, cambios):
    pub = get_pub(pub_id)
    if not pub or pub['est']['id'] != user.get('est_id'):
        raise ValueError('No puedes editar esta publicación.')
    if pub['estado'] != 'disponible':
        raise ValueError('Solo se pueden editar publicaciones disponibles.')
    pub['alimento'].update(nombre=cambios['nombre'], descripcion=cambios['descripcion'], cantidad=cambios['cantidad'])
    if pub['modalidad'] != 'donacion':
        pub['precio_base'] = cambios['precio_base']
    if pub['modalidad'] == 'descuento':
        pub['pct'] = cambios['pct']
    return pub

def cancelar_publicacion(pub_id, user):
    pub = get_pub(pub_id)
    if not pub:
        raise ValueError('La publicación ya no existe.')
    es_dueno = user['rol'] == 'empresa' and pub['est']['id'] == user.get('est_id')
    if not (es_dueno or user['rol'] == 'administrador'):
        raise ValueError('No tienes permiso para cancelar esta publicación.')
    if pub['estado'] != 'disponible':
        raise ValueError('Solo se pueden cancelar publicaciones disponibles.')
    S.PUBLICACIONES.remove(pub)
    return pub

def reservar(pub_id, user, modo, direccion=''):
    pub = get_pub(pub_id)
    if not pub:
        raise ValueError('La publicación ya no existe.')
    if pub['estado'] != 'disponible':
        raise ValueError('Este alimento ya no está disponible.')
    if modo not in ('recoger', 'envio'):
        raise ValueError('Elige cómo recibirás tu pedido.')
    if modo == 'envio' and len(direccion.strip()) < 8:
        raise ValueError('Escribe la dirección de entrega (calle, número y colonia).')
    codigo = f'RA-{random.randint(1000, 9999)}'
    r = {'id': f'r-{random.randint(100000, 999999)}', 'pub_id': pub_id, 'cliente_email': user['email'], 'cliente_nombre': user['nombre'],
         'cantidad': pub['alimento']['cantidad'], 'total': precio_final(pub), 'fecha': _dia(0), 'codigo': codigo, 'modo': modo,
         'direccion_envio': direccion.strip() if modo == 'envio' else '', 'transporte': 'pendiente' if modo == 'envio' else None,
         'transportista_email': None}
    S.RESERVACIONES.insert(0, r)
    pub['estado'] = 'reservado'
    nombre = pub['alimento']['nombre']
    _avisar('reservado', 'Alimento reservado', f'Reservaste "{nombre}". Tu código es {codigo}.', user['email'], pub_id)
    _avisar('reservado', 'Alimento reservado', f'{user["nombre"]} reservó "{nombre}".', pub['est']['email'], pub_id)
    if modo == 'envio':
        _avisar('transporte', 'Nueva entrega disponible', f'Entrega de "{nombre}": {pub["est"]["nombre"]} → {r["direccion_envio"]}.', 'transportista', pub_id)
    else:
        _avisar('listo', 'Alimento listo para recoger', f'Pasa por "{nombre}" a {pub["est"]["nombre"]}.', user['email'], pub_id)
    return r

def aceptar_entrega(reserva_id, user):
    r = get_reserva(reserva_id)
    if not r or r['transporte'] != 'pendiente':
        raise ValueError('Esta entrega ya fue tomada por otro transportista.')
    r['transporte'], r['transportista_email'] = 'asignado', user['email']
    pub = get_pub(r['pub_id'])
    nombre = pub['alimento']['nombre']
    _avisar('transporte', 'Transportista asignado', f'{user["nombre"]} llevará tu pedido "{nombre}".', r['cliente_email'], pub['id'])
    _avisar('transporte', 'Transportista asignado', f'{user["nombre"]} recogerá "{nombre}" en tu establecimiento.', pub['est']['email'], pub['id'])
    return r

def avanzar_entrega(reserva_id, user):
    r = get_reserva(reserva_id)
    if not r or r['transportista_email'] != user['email']:
        raise ValueError('Esta entrega no está asignada a ti.')
    pub = get_pub(r['pub_id'])
    if r['transporte'] == 'asignado':
        r['transporte'] = 'en_camino'
        _avisar('transporte', 'Tu pedido va en camino', f'"{pub["alimento"]["nombre"]}" ya fue recogido y va hacia ti.', r['cliente_email'], pub['id'])
    elif r['transporte'] == 'en_camino':
        _entregar(pub, r)
    else:
        raise ValueError('Esta entrega ya fue completada.')
    return r

def confirmar_entrega_empresa(reserva_id, user):
    r = get_reserva(reserva_id)
    pub = get_pub(r['pub_id']) if r else None
    if not pub or pub['est']['id'] != user.get('est_id'):
        raise ValueError('No puedes confirmar esta entrega.')
    if r['modo'] != 'recoger':
        raise ValueError('Esta reservación se entrega con transportista.')
    if pub['estado'] != 'reservado':
        raise ValueError('Esta entrega ya fue confirmada.')
    _entregar(pub, r)
    return r

def _entregar(pub, r):
    """Cierra el ciclo: publicación entregada y suma al registro de desperdicio evitado."""
    pub['estado'] = 'entregado'
    if r['modo'] == 'envio':
        r['transporte'] = 'entregado'
    reg, k, cat = S.REGISTRO, pub['alimento']['kilos'], pub['alimento']['categoria']
    reg['kilos_total'] += k
    reg['recuperados'] += pub['alimento']['cantidad']
    reg['entregas'] += 1
    reg['mensual'][-1] = (reg['mensual'][-1][0], reg['mensual'][-1][1] + k)
    reg['por_modalidad'][pub['modalidad']] += k
    reg['por_categoria'][cat] += k
    nombre = pub['alimento']['nombre']
    _avisar('entrega', 'Entrega confirmada', f'Se confirmó la entrega de "{nombre}". ¡Gracias por rescatar alimentos!', r['cliente_email'], pub['id'])
    _avisar('entrega', 'Entrega confirmada', f'"{nombre}" fue entregado. Sumaste {k:g} kg rescatados.', pub['est']['email'], pub['id'])

def alternar_usuario(email, actor):
    u = S.USUARIOS.get(email)
    if not u:
        raise ValueError('El usuario no existe.')
    if u['rol'] == 'administrador':
        raise ValueError('No se puede suspender a un administrador.')
    u['activo'] = not u['activo']
    return u

reset()
