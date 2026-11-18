"""DATOS DE EJEMPLO y acciones simuladas, guardados EN MEMORIA.

Esto NO es una base de datos ni un Back-End de negocio: es el material para que las
pantallas se puedan ver y probar. Al reiniciar el servidor todo vuelve a los datos de ejemplo.
Cuando exista el Back-End real, las funciones de este archivo son las que se reemplazan
por llamadas a la API / base de datos; las rutas y plantillas casi no cambian.
"""
import random
from datetime import date, datetime, timedelta
from types import SimpleNamespace

# ---------------------------------------------------------------- constantes
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

# Fotografías de Unsplash. Si alguna deja de cargar, la interfaz muestra una imagen de respaldo.
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

# Estado en memoria (se rellena en reset()).
S = SimpleNamespace()


def _dia(n):
    return (date.today() + timedelta(days=n)).isoformat()


def _hace(minutos):
    return (datetime.now() - timedelta(minutes=minutos)).isoformat(timespec='seconds')


def _meses_recientes():
    nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    hoy = date.today()
    salida = []
    for i in range(5, -1, -1):
        m = hoy.month - 1 - i
        salida.append(nombres[m % 12])
    return salida


# --------------------------------------------------------------------- datos
def reset():
    """Deja todo con los datos de ejemplo (se llama al crear la app y en las pruebas)."""
    S.ESTABLECIMIENTOS = [
        {'id': 'est-01', 'nombre': 'Panadería La Espiga', 'giro': 'Panadería', 'direccion': 'Av. Reforma 120, Col. Centro',
         'zona': 'Centro', 'punto': 'Mostrador lateral, puerta azul', 'telefono': '222 555 44 33'},
        {'id': 'est-02', 'nombre': 'Café Raíces', 'giro': 'Cafetería', 'direccion': 'Calle Hidalgo 45, Col. Jardines del Norte',
         'zona': 'Norte', 'punto': 'Barra de entrega para llevar', 'telefono': '222 555 12 90'},
        {'id': 'est-03', 'nombre': 'Restaurante El Fogón', 'giro': 'Restaurante', 'direccion': 'Blvd. Las Palmas 800, Col. Residencial Sur',
         'zona': 'Sur', 'punto': 'Entrada de servicio, junto al estacionamiento', 'telefono': '222 555 70 08'},
        {'id': 'est-04', 'nombre': 'Supermercado Fresco Mart', 'giro': 'Supermercado', 'direccion': 'Av. Universidad 2200, Col. Oriente',
         'zona': 'Oriente', 'punto': 'Módulo de atención a clientes', 'telefono': '222 555 31 31'},
        {'id': 'est-05', 'nombre': 'Cafetería Aroma', 'giro': 'Cafetería', 'direccion': 'Calle 5 de Mayo 310, Col. Poniente',
         'zona': 'Poniente', 'punto': 'Caja principal', 'telefono': '222 555 66 20'},
        {'id': 'est-06', 'nombre': 'Restaurante Sabor Casero', 'giro': 'Restaurante', 'direccion': 'Calle Morelos 77, Col. Centro',
         'zona': 'Centro', 'punto': 'Puerta trasera de la cocina', 'telefono': '222 555 98 45'},
    ]
    est = {e['id']: e for e in S.ESTABLECIMIENTOS}

    def usuario(email, nombre, rol, tel, **extra):
        return {'email': email, 'nombre': nombre, 'rol': rol, 'telefono': tel, 'activo': True,
                'creado': _dia(-random.randint(10, 90)), **extra}

    S.USUARIOS = {u['email']: u for u in [
        usuario('admin@demo.mx', 'Admin Rescate', 'administrador', '2220000000'),
        usuario('empresa@demo.mx', 'Luis Ramírez', 'empresa', '2225554433', est_id='est-01'),
        usuario('cafe@demo.mx', 'Marta Núñez', 'empresa', '2225551290', est_id='est-02'),
        usuario('fogon@demo.mx', 'Jorge Salas', 'empresa', '2225557008', est_id='est-03'),
        usuario('fresco@demo.mx', 'Rosa Vega', 'empresa', '2225553131', est_id='est-04'),
        usuario('aroma@demo.mx', 'Pablo Ruiz', 'empresa', '2225556620', est_id='est-05'),
        usuario('sabor@demo.mx', 'Elena Cruz', 'empresa', '2225559845', est_id='est-06'),
        usuario('cliente@demo.mx', 'Ana Torres', 'cliente', '2221234567'),
        usuario('cliente2@demo.mx', 'Fundación Manos Unidas', 'cliente', '2229876543'),
        usuario('transportista@demo.mx', 'Carlos Mendoza', 'transportista', '2227778899', vehiculo='Camioneta Nissan NP300'),
        usuario('transportista2@demo.mx', 'Sofía Lara', 'transportista', '2226665544', vehiculo='Motocicleta Italika 150'),
    ]}
    for u in S.USUARIOS.values():
        if u['rol'] == 'empresa':
            est[u['est_id']]['email'] = u['email']

    def pub(id_, modalidad, est_id, minutos, horario, alimento, precio=0, pct=0, estado='disponible', estrategia=None):
        return {
            'id': id_, 'modalidad': modalidad, 'estado': estado, 'estrategia': estrategia,
            'precio_base': precio, 'pct': pct, 'est': est[est_id], 'fecha_pub': _hace(minutos),
            'horario': dict(zip(('fecha', 'desde', 'hasta'), horario)), 'alimento': alimento,
        }

    def ali(nombre, desc, cat, unidad, cant, kilos, dias, foto):
        return {'nombre': nombre, 'descripcion': desc, 'categoria': cat, 'unidad': unidad,
                'cantidad': cant, 'kilos': kilos, 'caducidad': _dia(dias), 'foto': foto}

    hoy, ayer, manana = _dia(0), _dia(-1), _dia(1)
    S.PUBLICACIONES = [
        pub('p-012', 'descuento', 'est-03', 12, (hoy, '21:00', '22:00'), precio=780, pct=45, estrategia='caducidad',
            alimento=ali('Combos de hamburguesa con papas', 'Seis combos preparados hoy: hamburguesa de res, papas a la francesa y aderezo. Se recomienda consumirlos el mismo día.',
                         'Comida preparada', 'paquetes', 6, 6, 0, FOTOS['hamburguesa'])),
        pub('p-002', 'descuento', 'est-01', 40, (hoy, '19:00', '20:30'), precio=120, pct=40, estrategia='caducidad',
            alimento=ali('Croissants de mantequilla', 'Croissants horneados esta mañana, crujientes por fuera y suaves por dentro. Perfectos para el desayuno de mañana.',
                         'Pan y repostería', 'piezas', 8, 1.2, 1, FOTOS['croissant'])),
        pub('p-001', 'venta', 'est-01', 75, (hoy, '19:00', '20:30'), precio=90,
            alimento=ali('Pan artesanal surtido', 'Charola con bolillos, conchas y piezas de pan dulce del día. Sin conservadores, listo para llevar.',
                         'Pan y repostería', 'piezas', 12, 3.5, 1, FOTOS['pan'])),
        pub('p-005', 'donacion', 'est-03', 130, (hoy, '20:30', '21:30'),
            alimento=ali('Ensaladas preparadas', 'Ensaladas frescas con lechuga, jitomate, pepino y aderezo aparte. Se donan para quien las necesite.',
                         'Comida preparada', 'porciones', 15, 6, 1, FOTOS['ensalada'])),
        pub('p-006', 'descuento', 'est-06', 190, (hoy, '21:30', '22:30'), precio=180, pct=35, estrategia='disponibilidad',
            alimento=ali('Pizzas familiares del día', 'Cuatro pizzas familiares de pepperoni y hawaiana que no se vendieron durante el servicio.',
                         'Comida preparada', 'piezas', 4, 4, 0, FOTOS['pizza'])),
        pub('p-004', 'descuento', 'est-04', 260, (manana, '10:00', '13:00'), precio=250, pct=50, estrategia='caducidad',
            alimento=ali('Cajas de frutas y verduras de temporada', 'Cajas surtidas con fruta y verdura de aspecto imperfecto pero totalmente aptas para el consumo.',
                         'Frutas y verduras', 'cajas', 5, 12, 3, FOTOS['frutas'])),
        pub('p-009', 'venta', 'est-02', 330, (hoy, '18:00', '19:30'), precio=350, estado='reservado',
            alimento=ali('Sándwiches de desayuno', 'Diez sándwiches de huevo, jamón y queso, empacados individualmente.',
                         'Comida preparada', 'piezas', 10, 2.5, 1, FOTOS['desayuno'])),
        pub('p-007', 'venta', 'est-04', 480, (manana, '09:00', '12:00'), precio=400,
            alimento=ali('Yogurt natural de 1 litro', 'Lote de yogurt natural cercano a su fecha de consumo preferente. Cadena de frío garantizada.',
                         'Lácteos', 'piezas', 20, 20, 5, FOTOS['leche'])),
        pub('p-013', 'descuento', 'est-04', 600, (manana, '10:00', '14:00'), precio=600, pct=20, estrategia='disponibilidad',
            alimento=ali('Abarrotes con empaque dañado', 'Latas y paquetes con empaque golpeado pero contenido en perfecto estado: frijoles, atún, pasta y galletas.',
                         'Abarrotes', 'paquetes', 40, 18, 20, FOTOS['abarrotes'])),
        pub('p-003', 'descuento', 'est-01', 720, (hoy, '19:00', '20:30'), precio=150, pct=30, estrategia='disponibilidad', estado='reservado',
            alimento=ali('Rebanadas de pastel de chocolate', 'Seis rebanadas de pastel de chocolate con betún, empacadas en caja individual.',
                         'Pan y repostería', 'porciones', 6, 2, 2, FOTOS['pastel'])),
        pub('p-008', 'donacion', 'est-06', 900, (hoy, '22:00', '23:00'), estado='reservado',
            alimento=ali('Pasta con salsa boloñesa', 'Veinte porciones de pasta con salsa boloñesa preparadas hoy, ideales para comedores comunitarios.',
                         'Comida preparada', 'porciones', 20, 8, 1, FOTOS['pasta'])),
        pub('p-010', 'descuento', 'est-02', 1700, (ayer, '17:00', '18:30'), precio=360, pct=25, estrategia='caducidad', estado='entregado',
            alimento=ali('Jugo natural de naranja', 'Doce botellas de jugo de naranja recién exprimido, en envase individual.',
                         'Bebidas', 'botellas', 12, 6, 2, FOTOS['jugo'])),
        pub('p-011', 'donacion', 'est-01', 1900, (ayer, '19:00', '20:00'), estado='entregado',
            alimento=ali('Pan de caja integral', 'Diez paquetes de pan de caja integral con fecha de consumo preferente cercana.',
                         'Pan y repostería', 'paquetes', 10, 5, 2, FOTOS['pan'])),
    ]

    def reserva(id_, pub_id, email, nombre, cant, total, dias, codigo, modo='recoger', direccion='', transporte=None, transportista=None):
        return {'id': id_, 'pub_id': pub_id, 'cliente_email': email, 'cliente_nombre': nombre, 'cantidad': cant,
                'total': total, 'fecha': _dia(dias), 'codigo': codigo, 'modo': modo, 'direccion_envio': direccion,
                'transporte': transporte, 'transportista_email': transportista}

    S.RESERVACIONES = [
        reserva('r-001', 'p-003', 'cliente@demo.mx', 'Ana Torres', 6, 105, 0, 'RA-4821'),
        reserva('r-002', 'p-008', 'cliente2@demo.mx', 'Fundación Manos Unidas', 20, 0, 0, 'RA-7345',
                'envio', 'Av. Las Torres 410, Col. Solidaridad', 'pendiente'),
        reserva('r-005', 'p-009', 'cliente2@demo.mx', 'Fundación Manos Unidas', 10, 350, 0, 'RA-3318',
                'envio', 'Av. Las Torres 410, Col. Solidaridad', 'asignado', 'transportista@demo.mx'),
        reserva('r-003', 'p-010', 'cliente@demo.mx', 'Ana Torres', 12, 270, -1, 'RA-1190'),
        reserva('r-004', 'p-011', 'cliente2@demo.mx', 'Fundación Manos Unidas', 10, 0, -1, 'RA-6032',
                'envio', 'Av. Las Torres 410, Col. Solidaridad', 'entregado', 'transportista@demo.mx'),
    ]

    def notif(id_, tipo, titulo, mensaje, minutos, para, pub_id=None):
        return {'id': id_, 'tipo': tipo, 'titulo': titulo, 'mensaje': mensaje, 'fecha': _hace(minutos), 'para': para, 'pub_id': pub_id}

    S.NOTIFICACIONES = [
        notif('n-001', 'nuevo', 'Nuevo alimento disponible', 'Restaurante El Fogón publicó "Combos de hamburguesa con papas".', 12, 'cliente', 'p-012'),
        notif('n-002', 'descuento', 'Nueva publicación con descuento', 'Panadería La Espiga publicó "Croissants de mantequilla" con 40% de descuento.', 40, 'cliente', 'p-002'),
        notif('n-003', 'reservado', 'Alimento reservado', 'Reservaste "Rebanadas de pastel de chocolate". Tu código es RA-4821.', 120, 'cliente@demo.mx', 'p-003'),
        notif('n-007', 'reservado', 'Alimento reservado', 'Ana Torres reservó "Rebanadas de pastel de chocolate". Confirma la entrega cuando lo recoja.', 120, 'empresa@demo.mx', 'p-003'),
        notif('n-004', 'transporte', 'Nueva entrega disponible', 'Entrega de "Pasta con salsa boloñesa": Restaurante Sabor Casero → Av. Las Torres 410.', 180, 'transportista', 'p-008'),
        notif('n-009', 'transporte', 'Entrega asignada', 'Tienes asignada la entrega de "Sándwiches de desayuno" desde Café Raíces.', 250, 'transportista@demo.mx', 'p-009'),
        notif('n-010', 'reservado', 'Alimento reservado', 'Reservaste "Sándwiches de desayuno" con envío. Tu código es RA-3318.', 260, 'cliente2@demo.mx', 'p-009'),
        notif('n-005', 'entrega', 'Entrega confirmada', 'Se confirmó la entrega de "Jugo natural de naranja". ¡Gracias por rescatar alimentos!', 1600, 'cliente@demo.mx', 'p-010'),
        notif('n-006', 'nuevo', 'Nuevo alimento disponible', 'Supermercado Fresco Mart publicó "Cajas de frutas y verduras de temporada".', 1700, 'cliente', 'p-004'),
        notif('n-008', 'usuario', 'Nuevo usuario registrado', 'Sofía Lara se registró como transportista.', 300, 'administrador'),
    ]
    S.LEIDAS = {'cliente@demo.mx': {'n-005', 'n-006'}}

    S.REGISTRO = {
        'kilos_total': 12480,
        'recuperados': 3860,
        'entregas': 1204,
        'mensual': list(zip(_meses_recientes(), [1480, 1720, 1960, 2210, 2480, 2630])),
        'por_modalidad': {'venta': 3740, 'descuento': 5990, 'donacion': 2750},
        'por_categoria': {'Pan y repostería': 3370, 'Frutas y verduras': 3120, 'Comida preparada': 2870,
                          'Lácteos': 1250, 'Bebidas': 870, 'Abarrotes': 1000},
    }


# ------------------------------------------------------------------ consultas
def get_usuario(email):
    return S.USUARIOS.get(email)


def get_pub(pub_id):
    return next((p for p in S.PUBLICACIONES if p['id'] == pub_id), None)


def get_reserva(reserva_id):
    return next((r for r in S.RESERVACIONES if r['id'] == reserva_id), None)


def reserva_de_pub(pub_id):
    return next((r for r in S.RESERVACIONES if r['pub_id'] == pub_id), None)


def reservas_con_pub():
    """Lista de {'r': reservación, 'pub': publicación} (la más reciente primero)."""
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
    """Notificaciones del usuario (las dirigidas a su correo o a su rol), con la marca 'leida'."""
    leidas = S.LEIDAS.get(user['email'], set())
    return [dict(n, leida=n['id'] in leidas) for n in S.NOTIFICACIONES if n['para'] in (user['email'], user['rol'])]


def no_leidas(user):
    return sum(1 for n in notifs_de(user) if not n['leida'])


# ------------------------------------------------------------------- acciones
def _avisar(tipo, titulo, mensaje, para, pub_id=None):
    S.NOTIFICACIONES.insert(0, {'id': f'n-{random.randint(10**6, 10**7)}', 'tipo': tipo, 'titulo': titulo, 'mensaje': mensaje,
                                'fecha': datetime.now().isoformat(timespec='seconds'), 'para': para, 'pub_id': pub_id})


def marcar_leida(user, notif_id):
    S.LEIDAS.setdefault(user['email'], set()).add(notif_id)


def marcar_todas_leidas(user):
    S.LEIDAS.setdefault(user['email'], set()).update(n['id'] for n in notifs_de(user))


def registrar_usuario(email, nombre, rol, telefono, establecimiento='', giro='', vehiculo=''):
    email = email.strip().lower()
    if email in S.USUARIOS:
        raise ValueError('Ya existe una cuenta con ese correo.')
    if rol not in ('cliente', 'empresa', 'transportista'):
        raise ValueError('Tipo de cuenta no válido.')
    u = {'email': email, 'nombre': nombre.strip(), 'rol': rol, 'telefono': telefono, 'activo': True, 'creado': _dia(0)}
    if rol == 'empresa':
        est_id = f'est-{len(S.ESTABLECIMIENTOS) + 1:02d}'
        S.ESTABLECIMIENTOS.append({'id': est_id, 'nombre': establecimiento.strip(), 'giro': giro, 'email': email,
                                   'direccion': 'Dirección del establecimiento (dato de ejemplo)', 'zona': 'Centro',
                                   'punto': 'Entrada principal', 'telefono': telefono})
        u['est_id'] = est_id
    if rol == 'transportista':
        u['vehiculo'] = vehiculo.strip()
    S.USUARIOS[email] = u
    # Un usuario nuevo no ve como "sin leer" los avisos anteriores a su registro.
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
    """Cierra el ciclo: publicación entregada y suma al registro de desperdicio evitado (solo demostración)."""
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
