(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('ready'); }); });

  /* появление: заголовок, текст, картинка — с шагом внутри секции */
  var rises = [].slice.call(document.querySelectorAll('.rise'));
  rises.forEach(function (el) {
    var sib = [].slice.call(el.parentNode.querySelectorAll(':scope > .rise, :scope .ledger__col > .rise'));
    el.style.setProperty('--d', (Math.max(0, sib.indexOf(el)) % 6) * 80 + 'ms');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    rises.forEach(function (el) { io.observe(el); });
  } else rises.forEach(function (el) { el.classList.add('is-in'); });

  /* что случилось */
  var cases = [
    { t: 'Заберём и отвезём в сервис', p: 'Машина едет целиком на платформе. Можем отвезти на нашу СТО: там сразу сделают диагностику.', price: 'от 2 000 ₽', note: 'джипы и фургоны от 3 000 ₽', time: 'подача от 15 мин', img: '../img/bmw.jpg' },
    { t: 'Аккуратно погрузим после аварии', p: 'Заберём даже без колеса или с заблокированным рулём. Отвезём на стоянку, в сервис или домой.', price: 'от 2 000 ₽', note: 'джипы и фургоны от 3 000 ₽', time: 'подача от 15 мин', img: '../img/audi.jpg' },
    { t: 'Вытянем лебёдкой и погрузим', p: 'Грязь, снег, кювет, обочина. Выезжаем и на бездорожье: лебёдка затянет машину на платформу.', price: 'от 2 000 ₽', note: 'цена зависит от сложности', time: 'подача от 15 мин', img: '../img/bmwx2.jpg' },
    { t: 'Погрузим, даже если колёса стоят', p: 'Заблокированные колёса, ручник, сломанная коробка. Затянем машину на платформу лебёдкой.', price: 'от 2 000 ₽', note: 'джипы и фургоны от 3 000 ₽', time: 'подача от 15 мин', img: '../img/x5.jpg' },
    { t: 'Отвезём в другой город', p: 'По краю и в соседние регионы. Сумму считаем по километрам и называем заранее.', price: '50 ₽/км', note: 'межгород', time: 'лучше заказать заранее', img: '../img/highlander.jpg' },
    { t: 'Перевезём технику до 3,5 т', p: 'Микроавтобусы, трактора, мини-экскаваторы. Главное, чтобы помещалось на платформу 5,9 × 2,2 м.', price: 'от 3 700 ₽', note: 'спецтехника', time: 'подача от 15 мин', img: '../img/excavator.jpg' },
    { t: 'Перегоним купленную машину', p: 'Купили машину в другом городе или без документов на ход? Заберём у продавца и привезём к вам.', price: '50 ₽/км', note: 'по городу от 2 000 ₽', time: 'лучше заказать заранее', img: '../img/highlander.jpg' },
    { t: 'Отвезём в шиномонтаж или на ТО', p: 'Спустило колесо, нет запаски или машина не на ходу перед техосмотром. Доставим и, если нужно, заберём обратно.', price: 'от 2 000 ₽', note: 'легковые', time: 'подача от 15 мин', img: '../img/audi.jpg' },
    { t: 'Перевезём мотоцикл', p: 'Мотоциклы, скутеры, квадроциклы. Надёжно закрепим на платформе, без царапин.', price: 'от 2 000 ₽', note: 'мото и квадро', time: 'подача от 15 мин', img: '../img/bmwx2.jpg' }
  ];
  var ticket = document.querySelector('.ticket');
  var $ = function (id) { return document.getElementById(id); };
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('is-on')) return;
      chips.forEach(function (c) { c.classList.remove('is-on'); c.setAttribute('aria-checked', 'false'); });
      b.classList.add('is-on'); b.setAttribute('aria-checked', 'true');
      var c = cases[+b.dataset.s];
      ticket.classList.add('is-swap');
      setTimeout(function () {
        $('pTitle').textContent = c.t; $('pText').textContent = c.p; $('pPrice').textContent = c.price;
        $('pTime').textContent = c.time; $('pNote').textContent = c.note; $('pPic').src = c.img;
        $('pWa').href = 'https://wa.me/79624411911?text=' + encodeURIComponent('Здравствуйте! ' + b.textContent.trim() + '. Нужен эвакуатор.');
        ticket.classList.remove('is-swap');
      }, reduce ? 0 : 300);
    });
  });
  $('pWa').href = 'https://wa.me/79624411911?text=' + encodeURIComponent('Здравствуйте! Не заводится. Нужен эвакуатор.');

  /* один кадр, три дистанции */
  var zoom = document.querySelector('.zoom'), cap = $('zCap');
  var caps = [
    'Газель Next с платформой и лебёдкой. Одна машина, один водитель.',
    'Платформа 5,9 × 2,2 м. Везём до 3,5 тонн: легковые, джипы, микроавтобусы.',
    'Иван за рулём больше 15 лет. Грузит аккуратно, так пишут в отзывах.'
  ];
  var stage = -1;
  function onZoom() {
    var r = zoom.getBoundingClientRect(), h = zoom.offsetHeight - innerHeight;
    var p = Math.min(1, Math.max(0, -r.top / h));
    var s = p < .34 ? 0 : p < .67 ? 1 : 2;
    if (s !== stage) { stage = s; zoom.dataset.stage = s; cap.textContent = caps[s]; }
  }
  addEventListener('scroll', onZoom, { passive: true }); onZoom();

  /* названия по одному */
  var names = [].slice.call(document.querySelectorAll('#places span:not(.lead)'));
  if (names.length && !reduce) {
    var i = 0;
    setInterval(function () {
      names.forEach(function (n) { n.classList.remove('is-lit'); });
      names[i % names.length].classList.add('is-lit'); i++;
    }, 1600);
  }

  /* Max: копируем номер и открываем мессенджер */
  var mx = $('maxBtn');
  if (mx) {
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) mx.href = 'https://max.ru/';
    mx.addEventListener('click', function () {
      try { navigator.clipboard && navigator.clipboard.writeText(mx.dataset.num); } catch (e) {}
      mx.textContent = 'Max: номер скопирован';
      setTimeout(function () { mx.textContent = 'Max'; }, 4000);
    });
  }

  /* нижняя кнопка на телефоне, после первого экрана */
  var bar = document.querySelector('.callbar'), hero = document.querySelector('.hero'), call = $('contacts');
  function onBar() {
    var past = hero.getBoundingClientRect().bottom < 0;
    var atCall = call.getBoundingClientRect().top < innerHeight * .6;
    bar.classList.toggle('is-on', past && !atCall);
  }
  addEventListener('scroll', onBar, { passive: true });
})();
