"""Pruebas de humo: cada rol ve sus pantallas y recibe 403 en las ajenas."""
import pytest
from app import create_app, store


@pytest.fixture()
def app():
    a = create_app(); a.config['TESTING'] = True
    store.reset()
    return a


def entrar(app, correo):
    c = app.test_client()
    r = c.post('/login', data={'email': correo, 'password': 'x'}, follow_redirects=False)
    assert r.status_code in (302, 303), r.data[:200]
    return c


def test_publicas(app):
    c = app.test_client()
    for url in ['/', '/catalogo', '/catalogo/p-001', '/ubicacion', '/estadisticas', '/login', '/registro']:
        assert c.get(url).status_code == 200, url
    assert c.get('/catalogo?categoria=Panadería&orden=precio&modalidad=venta').status_code == 200
    assert c.get('/panel').status_code == 302
    assert c.get('/no-existe').status_code == 404


@pytest.mark.parametrize('correo,urls', [
    ('cliente@demo.mx', ['/panel', '/notificaciones', '/cliente/reservaciones', '/cliente/reservaciones?estado=entregado', '/ubicacion', '/estadisticas']),
    ('empresa@demo.mx', ['/panel', '/notificaciones', '/empresa/publicar', '/empresa/publicaciones', '/empresa/reservaciones', '/ubicacion']),
    ('transportista@demo.mx', ['/panel', '/transportista/entregas-disponibles', '/transportista/mis-entregas', '/ubicacion?pub=p-009']),
    ('admin@demo.mx', ['/panel', '/admin/usuarios', '/admin/usuarios?rol=empresa', '/admin/publicaciones', '/admin/reservaciones', '/notificaciones?ver=sin_leer']),
])
def test_cada_rol(app, correo, urls):
    c = entrar(app, correo)
    for u in urls:
        assert c.get(u).status_code == 200, u


def test_403_rol_equivocado(app):
    c = entrar(app, 'cliente@demo.mx')
    for u in ['/empresa/publicar', '/admin/usuarios', '/transportista/mis-entregas']:
        assert c.get(u).status_code == 403, u
    assert entrar(app, 'admin@demo.mx').get('/cliente/reservaciones').status_code == 403


def test_flujo_completo_envio(app):
    emp, cli, tra = entrar(app, 'empresa@demo.mx'), entrar(app, 'cliente@demo.mx'), entrar(app, 'transportista@demo.mx')
    r = emp.post('/empresa/publicar', data={
        'modalidad': 'descuento', 'nombre': 'Pan de prueba', 'descripcion': '', 'categoria': store.CATEGORIAS[0], 'cantidad': '10',
        'unidad': 'piezas', 'kilos': '2', 'precio_base': '100', 'estrategia': 'caducidad', 'pct': '30',
        'caducidad': store._dia(2), 'fecha_rec': store._dia(0), 'desde': '10:00', 'hasta': '12:00'})
    assert r.status_code == 302
    pub = store.S.PUBLICACIONES[0]
    assert pub['alimento']['nombre'] == 'Pan de prueba'
    assert cli.post(f'/cliente/reservar/{pub["id"]}', data={'modo': 'envio', 'direccion': 'Calle Uno 123, Centro'}).status_code == 302
    assert pub['estado'] == 'reservado'
    res = store.reserva_de_pub(pub['id'])
    assert res['transporte'] == 'pendiente'
    assert tra.post(f'/transportista/entregas/{res["id"]}/aceptar').status_code == 302
    kilos = store.S.REGISTRO['kilos_total']
    tra.post(f'/transportista/entregas/{res["id"]}/avanzar'); tra.post(f'/transportista/entregas/{res["id"]}/avanzar')
    assert pub['estado'] == 'entregado' and store.S.REGISTRO['kilos_total'] == kilos + 2


def test_validacion_y_admin(app):
    emp = entrar(app, 'empresa@demo.mx')
    assert b'nombre del alimento' in emp.post('/empresa/publicar', data={'nombre': ''}).data.lower()
    adm = entrar(app, 'admin@demo.mx')
    assert adm.post('/admin/usuarios/cliente2@demo.mx/alternar').status_code == 302
    assert not store.get_usuario('cliente2@demo.mx')['activo']
    assert app.test_client().post('/login', data={'email': 'cliente2@demo.mx', 'password': 'x'}).status_code == 200
    assert adm.post('/admin/publicaciones/p-001/retirar').status_code == 302
