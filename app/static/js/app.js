/* Rescate Alimentario (Flask) · interacciones de la interfaz.
   JavaScript sencillo, sin frameworks. Todo se activa con atributos data-* en el HTML. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function iconos() { if (window.lucide) window.lucide.createIcons(); }

  /* ---------- Modales ---------- */
  function abrir(id) { var m = document.getElementById(id); if (m) { m.classList.remove('oculto'); document.body.style.overflow = 'hidden'; } }
  function cerrar(m) { m.classList.add('oculto'); document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-abrir]');
    if (a) { abrir(a.getAttribute('data-abrir')); return; }
    var c = e.target.closest('[data-cerrar]');
    if (c) { cerrar(c.closest('.modal-fondo')); return; }
    if (e.target.classList && e.target.classList.contains('modal-fondo')) cerrar(e.target);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $$('.modal-fondo:not(.oculto)').forEach(cerrar);
  });

  /* ---------- Confirmación antes de enviar un formulario (data-confirmar) ---------- */
  var formPendiente = null;
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f.hasAttribute || !f.hasAttribute('data-confirmar') || f.__confirmado) return;
    e.preventDefault();
    formPendiente = f;
    $('#confirmar-titulo').textContent = f.getAttribute('data-titulo') || 'Confirmar';
    $('#confirmar-texto').textContent = f.getAttribute('data-confirmar');
    var ok = $('#confirmar-ok');
    ok.textContent = f.getAttribute('data-boton') || 'Confirmar';
    ok.className = 'btn ' + (f.hasAttribute('data-peligro') ? 'btn-peligro' : 'btn-primario');
    abrir('modal-confirmar');
  });
  var ok = $('#confirmar-ok');
  if (ok) ok.addEventListener('click', function () {
    if (!formPendiente) return;
    var f = formPendiente; f.__confirmado = true; cerrar($('#modal-confirmar')); f.submit();
  });

  /* ---------- Mensajes emergentes: desaparecen solos ---------- */
  $$('.toast').forEach(function (t, i) {
    setTimeout(function () { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(function () { t.remove(); }, 400); }, 4500 + i * 400);
    t.addEventListener('click', function () { t.remove(); });
  });

  /* ---------- Menús móviles ---------- */
  var mp = $('[data-menu-panel]');
  if (mp) mp.addEventListener('click', function () { $('#panel-lateral').classList.toggle('abierto'); });
  var mu = $('[data-menu-publico]');
  if (mu) mu.addEventListener('click', function () { mu.closest('.navbar').classList.toggle('abierto'); });

  /* ---------- Mostrar / ocultar contraseña ---------- */
  $$('[data-ver-clave]').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = document.getElementById(b.getAttribute('data-ver-clave'));
      if (i) i.type = i.type === 'password' ? 'text' : 'password';
    });
  });

  /* ---------- Dimensiones y colores dinámicos de gráficas e indicadores ---------- */
  $$('[data-ancho]').forEach(function (el) { el.style.width = el.getAttribute('data-ancho'); });
  $$('[data-alto]').forEach(function (el) { el.style.height = el.getAttribute('data-alto'); });
  $$('[data-color]').forEach(function (el) { el.style.background = el.getAttribute('data-color'); });

  /* ---------- Filtros del catálogo: se envían solos ---------- */
  $$('form[data-autoenviar]').forEach(function (f) {
    $$('select', f).forEach(function (s) { s.addEventListener('change', function () { f.submit(); }); });
    var r = $('input[type=range]', f), et = $('[data-valor-rango]', f), t;
    if (r) {
      var max = +r.getAttribute('data-rango-precio');
      r.addEventListener('input', function () { et.textContent = +r.value >= max ? 'Sin límite' : '$' + r.value; });
      r.addEventListener('change', function () { f.submit(); });
    }
    var q = $('input[type=search], input[name=q]', f);
    if (q) q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { f.submit(); }, 600); });
  });

  /* ---------- Campos condicionales: data-si="campo:valor1|valor2" ---------- */
  $$('form[data-formulario-condicional]').forEach(function (f) {
    function actualizar() {
      $$('[data-si]', f).forEach(function (bloque) {
        var par = bloque.getAttribute('data-si').split(':');
        var campo = f.elements[par[0]], valor = '';
        if (campo) valor = campo.length !== undefined && campo.tagName !== 'SELECT'
          ? ($$('input[name="' + par[0] + '"]', f).filter(function (x) { return x.checked; })[0] || {}).value || ''
          : campo.value;
        bloque.style.display = par[1].split('|').indexOf(valor) >= 0 ? '' : 'none';
      });
    }
    f.addEventListener('change', actualizar); actualizar();
  });

  /* ---------- Vista previa en vivo al publicar (data-pv) ---------- */
  var formPub = $('.publicar-rejilla form');
  if (formPub && $('#vista-previa')) {
    var pv = function (k) { return $('[data-pv="' + k + '"]', $('#vista-previa')); };
    var moneda = function (n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('es-MX', { maximumFractionDigits: 2 }); };
    var etiquetas = { venta: 'Venta', descuento: 'Con descuento', donacion: 'Donación' };
    var val = function (n) { var e = formPub.elements[n]; return e ? e.value : ''; };
    var refrescar = function () {
      var m = (formPub.querySelector('input[name=modalidad]:checked') || {}).value || 'venta';
      pv('nombre').textContent = val('nombre') || 'Nombre del alimento';
      var b = pv('badge').firstElementChild; if (b) b.textContent = etiquetas[m];
      var base = parseFloat(val('precio_base').replace(',', '.')) || 0, pct = m === 'descuento' ? (parseInt(val('pct'), 10) || 0) : 0;
      var fin = base * (1 - pct / 100), cinta = pv('cinta');
      cinta.textContent = '-' + pct + '%'; cinta.hidden = pct <= 0;
      pv('precio').innerHTML = m === 'donacion' ? '<strong class="precio-gratis">Gratis</strong>'
        : (pct > 0 ? '<s>' + moneda(base) + '</s>' : '') + '<strong>' + moneda(fin) + '</strong><small>lote completo</small>';
      pv('cant').textContent = (val('cantidad') || 0) + ' ' + val('unidad');
      pv('kilos').textContent = (val('kilos') || 0) + ' kg';
      if (val('caducidad')) pv('cad').textContent = val('caducidad');
    };
    formPub.addEventListener('input', refrescar); formPub.addEventListener('change', refrescar);
    var nota = $('.vista-previa .aviso-chico'); if (nota) nota.textContent = 'Se actualiza mientras escribes.';
    refrescar();
  }

  /* ---------- Mapa de demostración: mostrar / ocultar ruta ---------- */
  var tr = $('[data-ruta-toggle]');
  if (tr) tr.addEventListener('click', function () {
    var visible = false;
    $$('[data-ruta]').forEach(function (e) { e.classList.toggle('oculto'); visible = !e.classList.contains('oculto'); });
    $('span', tr).textContent = tr.getAttribute(visible ? 'data-texto-ocultar' : 'data-texto-mostrar');
  });

  /* ---------- Si una foto falla, se muestra un fondo neutro ---------- */
  $$('img[data-foto]').forEach(function (img) {
    img.addEventListener('error', function () { img.style.visibility = 'hidden'; img.parentNode.style.background = 'var(--verde-claro, #e6f2ea)'; });
  });

  iconos();
})();
