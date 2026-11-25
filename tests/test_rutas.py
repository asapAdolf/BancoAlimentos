"""Pruebas de rutas y flujos sobre estado inicial limpio (sin datos de demostración)."""
import pytest
from app import create_app, store


@pytest.fixture()
def app():
    a = create_app()
    a.config['TESTING'] = True
    store.reset()
    return a


@pytest.fixture()
def cuentas_prueba(app):
    store.registrar_usuario('cliente@prueba.mx', 'Cliente Prueba', 'cliente', '2221112233', password='Password1')
    store.registrar_usuario('cliente2@prueba.mx', 'Cliente Dos', 'cliente', '2221112244', password='Password1')
    store.registrar_usuario('empresa@prueba.mx', 'Empresa Prueba', 'empresa', '2223334455',
                            establecimiento='Panadería Central', giro='Panadería', password='Password1')
    store.registrar_usuario('transportista@prueba.mx', 'Transportista Prueba', 'transportista', '2225556677',
                            vehiculo='Camioneta NP300', password='Password1')
    return app


def entrar(app, correo, clave='Password1'):
    c = app.test_client()
    r = c.post('/login', data={'email': correo, 'password': clave}, follow_redirects=False)
    assert r.status_code in (302, 303), r.data[:200]
    return c


def test_inicio_limpio_sin_datos_demo(app):
    assert store.S.PUBLICACIONES == []
    assert store.S.RESERVACIONES == []
    assert store.S.NOTIFICACIONES == []
    assert store.S.ESTABLECIMIENTOS == []
    assert store.S.REGISTRO['kilos_total'] == 0
    assert list(store.S.USUARIOS.keys()) == ['admin@bancoalimentos.mx']


def test_publicas(app):
    c = app.test_client()
    for url in ['/', '/catalogo', '/ubicacion', '/estadisticas', '/login', '/registro']:
        assert c.get(url).status_code == 200, url
    assert c.get('/catalogo?categoria=Panadería&orden=precio&modalidad=venta').status_code == 200
    assert c.get('/panel').status_code == 302
    assert c.get('/no-existe').status_code == 404


@pytest.mark.parametrize('correo,clave,urls', [
    ('cliente@prueba.mx', 'Password1', ['/panel', '/notificaciones', '/cliente/reservaciones', '/cliente/reservaciones?estado=entregado', '/ubicacion', '/estadisticas']),
    ('empresa@prueba.mx', 'Password1', ['/panel', '/notificaciones', '/empresa/publicar', '/empresa/publicaciones', '/empresa/reservaciones', '/ubicacion']),
    ('transportista@prueba.mx', 'Password1', ['/panel', '/transportista/entregas-disponibles', '/transportista/mis-entregas', '/ubicacion']),
    ('admin@bancoalimentos.mx', 'admin1234', ['/panel', '/admin/usuarios', '/admin/usuarios?rol=empresa', '/admin/publicaciones', '/admin/reservaciones', '/notificaciones?ver=sin_leer']),
])
def test_cada_rol(cuentas_prueba, correo, clave, urls):
    c = entrar(cuentas_prueba, correo, clave)
    for u in urls:
        assert c.get(u).status_code == 200, u


def test_403_rol_equivocado(cuentas_prueba):
    c = entrar(cuentas_prueba, 'cliente@prueba.mx')
    for u in ['/empresa/publicar', '/admin/usuarios', '/transportista/mis-entregas']:
        assert c.get(u).status_code == 403, u
    assert entrar(cuentas_prueba, 'admin@bancoalimentos.mx', 'admin1234').get('/cliente/reservaciones').status_code == 403


def test_flujo_completo_envio(cuentas_prueba):
    emp = entrar(cuentas_prueba, 'empresa@prueba.mx')
    cli = entrar(cuentas_prueba, 'cliente@prueba.mx')
    tra = entrar(cuentas_prueba, 'transportista@prueba.mx')
    r = emp.post('/empresa/publicar', data={
        'modalidad': 'descuento', 'nombre': 'Pan del día', 'descripcion': '', 'categoria': store.CATEGORIAS[0], 'cantidad': '10',
        'unidad': 'piezas', 'kilos': '2', 'precio_base': '100', 'estrategia': 'caducidad', 'pct': '30',
        'caducidad': store._dia(2), 'fecha_rec': store._dia(0), 'desde': '10:00', 'hasta': '12:00'})
    assert r.status_code == 302
    pub = store.S.PUBLICACIONES[0]
    assert pub['alimento']['nombre'] == 'Pan del día'
    assert cli.post(f'/cliente/reservar/{pub["id"]}', data={'modo': 'envio', 'direccion': 'Calle Uno 123, Centro'}).status_code == 302
    assert pub['estado'] == 'reservado'
    res = store.reserva_de_pub(pub['id'])
    assert res['transporte'] == 'pendiente'
    assert tra.post(f'/transportista/entregas/{res["id"]}/aceptar').status_code == 302
    kilos = store.S.REGISTRO['kilos_total']
    tra.post(f'/transportista/entregas/{res["id"]}/avanzar')
    tra.post(f'/transportista/entregas/{res["id"]}/avanzar')
    assert pub['estado'] == 'entregado' and store.S.REGISTRO['kilos_total'] == kilos + 2


def test_validacion_y_admin(cuentas_prueba):
    emp = entrar(cuentas_prueba, 'empresa@prueba.mx')
    assert b'nombre del alimento' in emp.post('/empresa/publicar', data={'nombre': ''}).data.lower()
    pub = store.publicar({
        'modalidad': 'venta', 'nombre': 'Lote pan', 'descripcion': '', 'categoria': store.CATEGORIAS[0],
        'unidad': 'piezas', 'cantidad': 5, 'kilos': 1.5, 'precio_base': 80, 'estrategia': 'caducidad',
        'pct': 0, 'caducidad': store._dia(2), 'fecha_rec': store._dia(0), 'desde': '10:00', 'hasta': '12:00',
    }, store.get_usuario('empresa@prueba.mx'))
    adm = entrar(cuentas_prueba, 'admin@bancoalimentos.mx', 'admin1234')
    assert adm.post('/admin/usuarios/cliente2@prueba.mx/alternar').status_code == 302
    assert not store.get_usuario('cliente2@prueba.mx')['activo']
    assert cuentas_prueba.test_client().post('/login', data={'email': 'cliente2@prueba.mx', 'password': 'Password1'}).status_code == 200
    assert adm.post(f'/admin/publicaciones/{pub["id"]}/retirar').status_code == 302
