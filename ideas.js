(function () {
  // палитры
  document.querySelectorAll('.pals button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.body.dataset.pal = b.dataset.p;
      document.querySelectorAll('.pals button').forEach(function (x) { x.classList.toggle('on', x === b); });
    });
  });

  // 2.2 влезет ли машина
  var sel = document.getElementById('carSel'), bar = document.getElementById('carBar'), res = document.getElementById('carRes');
  function car() {
    var len = parseFloat(sel.value), ok = len <= 5.9;
    bar.style.width = Math.min(len / 5.9, 1.08) * 100 + '%';
    res.textContent = len.toFixed(2).replace('.', ',') + ' м, ' + (ok ? 'влезет' : 'не влезет, нужен другой эвакуатор');
  }
  sel.addEventListener('change', car); car();

  // 3.1 ситуации
  var notes = {
    'Не заводится': 'заберём и отвезём в сервис',
    'После ДТП': 'погрузим даже без колеса',
    'Застрял в грязи': 'вытянем лебёдкой и погрузим',
    'Колёса заблокированы': 'погрузим на тележках',
    'Нужно в другой город': 'цена зависит от километров'
  };
  var chipRes = document.getElementById('chipRes');
  document.querySelectorAll('#chips button').forEach(function (c) {
    c.addEventListener('click', function () {
      document.querySelectorAll('#chips button').forEach(function (x) { x.classList.toggle('on', x === c); });
      chipRes.textContent = notes[c.textContent];
    });
  });

  // 4.4 миниатюры
  var big = document.getElementById('bigImg');
  document.querySelectorAll('#thumbs img').forEach(function (t) {
    t.addEventListener('click', function () {
      big.src = t.src;
      document.querySelectorAll('#thumbs img').forEach(function (x) { x.classList.toggle('on', x === t); });
    });
  });

  // 6.2 ваше село
  var towns = {
    'ставрополь': 'около 20 минут', 'михайловск': 'примерно 30 минут', 'надежда': 'примерно 30 минут',
    'татарка': 'примерно 35 минут', 'демино': 'примерно 35 минут', 'грачёвка': 'около часа', 'грачевка': 'около часа',
    'невинномысск': 'около часа', 'пятигорск': 'межгород, цену скажем по телефону', 'краснодар': 'межгород, цену скажем по телефону'
  };
  var tin = document.getElementById('townIn'), tres = document.getElementById('townRes');
  tin.addEventListener('input', function () {
    var v = tin.value.trim(), t = towns[v.toLowerCase()];
    tres.innerHTML = !v ? '&nbsp;' : t ? '<b>Да, приедем.</b> ' + v + ', ' + t + '.' : '<b>Скорее всего, да.</b> Уточните у диспетчера.';
  });

  // 8.2 QR
  if (window.QRCode) new QRCode(document.getElementById('qr'), { text: 'tel:+79624411911', width: 256, height: 256, colorDark: '#111111', colorLight: '#ffffff' });
})();
