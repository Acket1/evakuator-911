(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- первый экран ---------- */
  var hero = document.querySelector('.hero');
  function revealHero() {
    hero.classList.add('is-in');
    document.querySelectorAll('.nav.rise, .hero .rise').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* 2. интро: фото на весь экран сжимается в карточку, потом появляется текст */
  var truckEl = document.querySelector('.truck');
  var canIntro = !reduce && window.scrollY < 10 && !location.hash && 'animate' in Element.prototype;
  if (canIntro) runIntro();
  else requestAnimationFrame(function () { requestAnimationFrame(revealHero); });

  function runIntro() {
    var root = document.documentElement;
    hero.classList.add('hero--intro');
    root.classList.add('is-intro');
    truckEl.style.visibility = 'hidden';

    var src = truckEl.querySelector('img');
    var ov = document.createElement('div');
    ov.className = 'intro';
    ov.setAttribute('aria-hidden', 'true');
    var im = new Image();
    im.alt = '';
    im.src = src.currentSrc || src.src;
    var brand = document.createElement('p');
    brand.className = 'intro__brand';
    brand.innerHTML = 'Эвакуатор&nbsp;911<span>Ставрополь, круглосуточно</span>';
    ov.appendChild(im);
    ov.appendChild(brand);
    document.body.appendChild(ov);

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      truckEl.style.visibility = '';
      ov.remove();
      root.classList.remove('is-intro');
      revealHero();
    }
    setTimeout(finish, 5000); // на всякий случай, если что-то пошло не так

    var ready = im.decode ? im.decode() : Promise.resolve();
    ready.catch(function () {}).then(function () {
      setTimeout(function () {
        var r = truckEl.getBoundingClientRect();
        ov.classList.add('is-leaving');
        var anim = ov.animate([
          { top: '0px', left: '0px', width: window.innerWidth + 'px', height: window.innerHeight + 'px', borderRadius: '0px' },
          { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: '32px' }
        ], { duration: 1200, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards' });
        anim.onfinish = finish;
      }, 900);
    });
  }

  /* плашки двигаются за мышкой */
  var floats = document.querySelectorAll('.float');
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = null, mx = 0, my = 0;
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5;
      my = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(function () {
        floats.forEach(function (f) {
          var d = +f.dataset.depth;
          f.style.translate = (mx * d * 2).toFixed(1) + 'px ' + (my * d * 2).toFixed(1) + 'px';
        });
        raf = null;
      });
    });
    hero.addEventListener('mouseleave', function () { floats.forEach(function (f) { f.style.translate = '0 0'; }); });
  }

  /* ---------- появление при прокрутке ---------- */
  var watch = document.querySelectorAll('.rise:not(.hero .rise):not(.nav)');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
        var num = e.target.querySelector('b[data-to]');
        if (num) countUp(num);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    watch.forEach(function (el) { io.observe(el); });

    var heroCta = document.querySelector('.hero .cta');
    var bar = document.querySelector('.callbar');
    new IntersectionObserver(function (en) { bar.classList.toggle('is-on', !en[0].isIntersecting); }).observe(heroCta);
  } else {
    watch.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* счётчик цифр машины */
  function countUp(el) {
    if (reduce) return;
    var to = parseFloat(el.dataset.to), unit = el.dataset.unit, t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * e).toFixed(1).replace('.', ',') + ' ' + unit;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- ситуации ---------- */
  var cases = [
    { t: 'Заберём и отвезём в сервис', p: 'Машина едет целиком на платформе. Можем отвезти на нашу СТО: там сразу сделают диагностику.', price: 'от 2 000 ₽', note: 'джипы и фургоны от 3 000 ₽', time: 'от 15 мин', img: 'img/bmw.jpg' },
    { t: 'Аккуратно погрузим после аварии', p: 'Заберём даже без колеса или с заблокированным рулём. Отвезём на стоянку, в сервис или домой.', price: 'от 2 000 ₽', note: 'джипы и фургоны от 3 000 ₽', time: 'от 15 мин', img: 'img/audi.jpg' },
    { t: 'Вытянем лебёдкой и погрузим', p: 'Грязь, снег, кювет, обочина. Выезжаем и на бездорожье: лебёдка затянет машину на платформу.', price: 'от 2 000 ₽', note: 'цена зависит от сложности', time: 'от 15 мин', img: 'img/bmwx2.jpg' },
    { t: 'Погрузим, даже если колёса стоят', p: 'Заблокированные колёса, ручник, сломанная коробка. Затянем машину на платформу лебёдкой.', price: 'от 2 000 ₽', note: 'джипы и фургоны от 3 000 ₽', time: 'от 15 мин', img: 'img/x5.jpg' },
    { t: 'Отвезём в другой город', p: 'По краю и в соседние регионы. Сумму считаем по километрам и называем заранее.', price: '50 ₽/км', note: 'межгород', time: 'заранее', img: 'img/highlander.jpg' },
    { t: 'Перевезём технику до 3,5 т', p: 'Микроавтобусы, трактора, мини-экскаваторы. Главное, чтобы помещалось на платформу 5,9 × 2,2 м.', price: 'от 3 700 ₽', note: 'спецтехника', time: 'от 15 мин', img: 'img/excavator.jpg' },
    { t: 'Перегоним купленную машину', p: 'Купили машину в другом городе или без документов на ход? Заберём у продавца и привезём к вам.', price: '50 ₽/км', note: 'по городу от 2 000 ₽', time: 'заранее', img: 'img/highlander.jpg' },
    { t: 'Отвезём в шиномонтаж или на ТО', p: 'Спустило колесо, нет запаски или машина не на ходу перед техосмотром. Доставим и, если нужно, заберём обратно.', price: 'от 2 000 ₽', note: 'легковые', time: 'от 15 мин', img: 'img/audi.jpg' },
    { t: 'Перевезём мотоцикл', p: 'Мотоциклы, скутеры, квадроциклы. Надёжно закрепим на платформе, без царапин.', price: 'от 2 000 ₽', note: 'мото и квадро', time: 'от 15 мин', img: 'img/bmwx2.jpg' }
  ];
  var nb = function (s) { return s.replace(/ (\S{1,2}) /g, ' $1 ').replace(/(\d) /g, '$1 '); };
  var box = document.querySelector('.order__phone');
  var el = {
    t: document.getElementById('caseTitle'), p: document.getElementById('caseText'),
    price: document.getElementById('casePrice'), time: document.getElementById('caseTime'), note: document.getElementById('caseNote'),
    img: document.getElementById('casePhoto')
  };
  cases.forEach(function (c) { var i = new Image(); i.src = c.img; });

  var tabs = document.querySelectorAll('.order__list button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-selected') === 'true') return;
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      var c = cases[+b.dataset.s];
      box.classList.add('is-swapping');
      el.img.classList.remove('wipe');
      setTimeout(function () {
        el.t.textContent = nb(c.t); el.p.textContent = nb(c.p);
        el.price.textContent = nb(c.price); el.time.textContent = nb(c.time); el.note.textContent = nb(c.note);
        document.getElementById('caseWa').href = 'https://wa.me/79624411911?text=' + encodeURIComponent('Здравствуйте! ' + b.querySelector('span').textContent.trim() + '. Нужен эвакуатор.');
        el.img.src = c.img;
        void el.img.offsetWidth;
        el.img.classList.add('wipe');
        box.classList.remove('is-swapping');
      }, 280);
    });
  });
})();

/* ===== Улучшения: шапка и геолокация ===== */
(function () {
  var nav = document.querySelector('.nav');

  /* 2. шапка прячется при прокрутке вниз и возвращается при прокрутке вверх */
  var lastY = window.scrollY, ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (y > lastY + 6 && y > 240) nav.classList.add('nav--hidden');
      else if (y < lastY - 6 || y < 240) nav.classList.remove('nav--hidden');
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
  nav.addEventListener('focusin', function () { nav.classList.remove('nav--hidden'); });

  /* 3. подсветка раздела, который сейчас на экране */
  var links = document.querySelectorAll('.nav__links a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }

  /* 5. «Отправить, где я»: геолокация -> WhatsApp с готовой ссылкой на карту */
  var btn = document.getElementById('geoBtn');
  var label = document.getElementById('geoLabel');
  var note = document.getElementById('geoNote');
  var WA = 'https://wa.me/79624411911?text=';
  var labelText = label.textContent;
  var noteText = note.textContent;

  function openWA(text) { window.location.href = WA + encodeURIComponent(text); }
  function reset() { btn.classList.remove('is-loading'); label.textContent = labelText; }

  btn.addEventListener('click', function () {
    if (!navigator.geolocation) { openWA('Здравствуйте! Нужен эвакуатор. Адрес: '); return; }
    btn.classList.add('is-loading');
    label.textContent = 'Определяем место…';
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude.toFixed(6), lon = pos.coords.longitude.toFixed(6);
      var map = 'https://yandex.ru/maps/?pt=' + lon + ',' + lat + '&z=17&l=map';
      reset();
      openWA('Здравствуйте! Нужен эвакуатор. Я здесь: ' + map);
    }, function () {
      reset();
      note.textContent = 'Не получилось определить место. Открываем WhatsApp, напишите адрес.';
      note.classList.add('is-warn');
      setTimeout(function () {
        note.textContent = noteText; note.classList.remove('is-warn');
        openWA('Здравствуйте! Нужен эвакуатор. Адрес: ');
      }, 1600);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  });
})();

/* ===== Дизайн v2: ночь, 3D-наклон, отзывы ===== */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 14. фото наклоняется за мышкой */
  var zone = document.getElementById('tiltZone'), tilt = document.getElementById('tilt');
  if (zone && tilt && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = null;
    zone.addEventListener('mousemove', function (e) {
      var r = zone.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        tilt.style.transform = 'rotateY(' + (x * 14).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
        raf = null;
      });
    });
    zone.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  /* 12. полоски «что хвалят» */
  document.querySelectorAll('.praise__row').forEach(function (row) {
    row.style.setProperty('--w', Math.round(+row.dataset.n / 23 * 100) + '%');
  });

  /* живой виджет отзывов — только по кнопке */
  var revBtn = document.getElementById('revBtn'), revBox = document.getElementById('revWidget'), revLabel = document.getElementById('revLabel');
  revBtn.addEventListener('click', function () {
    var open = revBox.hidden;
    if (open) {
      var f = revBox.querySelector('iframe');
      if (!f.src) f.src = f.dataset.src;
    }
    revBox.hidden = !open;
    revBtn.setAttribute('aria-expanded', String(open));
    revLabel.textContent = open ? 'Свернуть отзывы' : 'Читать все отзывы';
  });
})();

/* Max. Ссылки по номеру у мессенджера нет: если в href стоит профиль max.ru/u/..., кнопка просто открывает чат.
   Иначе копируем номер, открываем Max и подсказываем вставить номер в поиск. */
(function () {
  var b = document.getElementById('maxBtn');
  if (!b) return;
  if (/^https:\/\/max\.ru\/.+/.test(b.getAttribute('href') || '')) return;
  var num = b.dataset.num;
  var note = document.getElementById('maxNote');
  var label = b.querySelector('.btn__label');
  var mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  b.href = mobile ? 'https://max.ru/' : 'https://web.max.ru/';
  b.addEventListener('click', function () {
    try { navigator.clipboard && navigator.clipboard.writeText(num); } catch (e) {}
    label.textContent = 'Номер скопирован';
    if (note) note.innerHTML = 'Номер скопирован. В&nbsp;Max откройте поиск и&nbsp;вставьте его: +7&nbsp;962&nbsp;441-19-11';
    setTimeout(function () { label.textContent = 'Max'; }, 4000);
  });
})();
