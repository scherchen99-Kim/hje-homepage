/* ---------- header menu ---------- */
const burger = document.getElementById('burger');
burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

/* ---------- hero carousel ---------- */
const hero = document.getElementById('hero');
const slides = [...hero.querySelectorAll('.slide')];
const cards = [...hero.querySelectorAll('.hcard')];
const DUR = 7000;
let cur = 0, timer, paused = false;
hero.style.setProperty('--dur', DUR / 1000 + 's');

function go(i) {
  cur = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle('is-on', k === cur));
  cards.forEach((c, k) => {
    c.classList.remove('is-on');
    if (k === cur) { void c.offsetWidth; c.classList.add('is-on'); }
  });
  schedule();
}
function schedule() {
  clearTimeout(timer);
  if (!paused) timer = setTimeout(() => go(cur + 1), DUR);
}
cards.forEach(c => c.addEventListener('click', () => go(+c.dataset.i)));
document.getElementById('pause').addEventListener('click', () => {
  paused = !paused;
  hero.classList.toggle('paused', paused);
  paused ? clearTimeout(timer) : go(cur + 1);
});
schedule();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); countUp(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function countUp(root) {
  root.querySelectorAll('.count:not([data-pre])').forEach(el => {
    const to = +el.dataset.to, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ---------- parallax on feature ---------- */
const feat = document.querySelector('.feature');
addEventListener('scroll', () => {
  const r = feat.getBoundingClientRect();
  if (r.bottom > 0 && r.top < innerHeight) feat.style.setProperty('--py', (r.top * -0.08).toFixed(1) + 'px');
}, { passive: true });

/* ---------- installation record ---------- */
// [location, client, waste/fuel, capacity, contractor, type]
const REC = [
  ['Mungyeong', 'Mungyeong City', 'Oil / municipal', '150 t/day', 'Samsung Eng. / Hansol Paper', 'city'],
  ['Suwon', 'Suwon City', 'Light & waste oil', '250 t/day', 'Hyundai Heavy Ind.', 'city'],
  ['Geoje', 'Geoje City', 'Light oil / municipal', '150 t/day', 'Jindo', 'city'],
  ['Hongseong', 'Hongseong County', 'Light oil', '200 t/day', 'Jindo', 'city'],
  ['Suncheon', 'Suncheon City', 'Municipal waste', '120 t/day', 'LG Machine', 'city'],
  ['Gapyeong', 'Gapyeong County', 'Municipal waste', '100 t/day', 'Government', 'city'],
  ['Ulsan', 'Green Environ', 'Gas / municipal', '110 t/day', 'Hyundai Heavy Ind.', 'city'],
  ['Gumi', 'Doray Sehan', 'Gas / municipal', '110 t/day', 'Samsung Eng.', 'city'],
  ['Ulsan', 'Samsung Electronics', 'Factory waste', '190 t/day', 'Samsung Eng.', 'factory'],
  ['Gumi', 'LG Electronics', 'Factory waste', '85 t/day', 'LG Machine', 'factory'],
  ['Cheongju', 'LG Chemical', 'Methane gas / factory', '80 t/day', 'LG Machine', 'factory'],
  ['Gunpo', 'LG Merchandise', 'Gas / factory waste', '120 t/day', 'LG Machine', 'factory'],
  ['Yangsan', 'Samsung ICT Group', 'Factory waste', '150 t/day', 'Samsung Eng.', 'factory'],
  ['Jinju', 'Korea Chemical', 'Factory / municipal', '150 t/day', 'Jindo', 'factory'],
  ['Anseong', 'Oriental Co.', 'Factory / municipal', '90 t/day', 'Samsung Eng.', 'factory'],
  ['Anyang', 'Noroo Paint', 'Factory waste', '100 t/day', 'Jindo', 'factory'],
  ['Ansan', 'Kangsung Ind.', 'Factory waste', '120 t/day', 'Jindo', 'factory'],
  ['Banwol', 'Kukje Chemical', 'Light oil / factory', '70 t/day', 'Samsung Eng.', 'factory'],
  ['Banwol', 'Shinpoong Pharm.', 'Light & waste oil / factory', '80 t/day', 'Samsung Eng.', 'factory'],
  ['Gimhae', 'Smil Co.', 'Light oil / factory / municipal', '70 t/day', 'Jindo', 'factory'],
  ['Changwon', 'Hyosung Heavy Ind.', 'Light oil', '80 t/day', 'Jindo', 'factory'],
  ['Ulsan', 'Michang Oil', 'Waste oil / municipal', '230 t/h', 'Jindo', 'factory'],
  ['Anseong', 'Sinpung Paper', 'Light oil / factory', '50 t/day', 'LG Machine', 'factory'],
  ['Yeosu', 'Samyang Chemical', 'Methane gas', '80 t/day', 'Samyang Chemical', 'factory'],
  ['Ansan', 'Sunglim Yuhwa', 'Waste oil', '8 t/h', 'Samsung Eng.', 'factory'],
  ['Suwon', 'Air Force', 'Military waste', '80 t/day', 'Jindo', 'city'],
  ['Yeongcheon', '3 military schools', 'Military waste', '110 t/day', 'Jindo', 'city'],
  ['Seoul', 'Eulji Paik Hospital', 'Medical waste', '2.3 t/h', 'HJE', 'hospital'],
  ['—', 'Soonchunhyang Hospital', 'Medical waste', '3.5 t/h', 'HJE', 'hospital'],
  ['Seoul', 'Catholic Kangnam Hospital', 'Medical waste', '2.8 t/h', 'HJE', 'hospital'],
  ['—', 'One Eco Co.', 'Medical waste', '2.0 t/h', 'HJE', 'hospital'],
  ['Gwangyang', 'KY Steel', 'COG / factory sludge', 'Kiln / dryer 300 t/day', 'Hyundai Heavy Ind.', 'kiln'],
  ['Pohang', 'POSCO', 'COG / carbon', 'Kiln / dryer 250 t/day', 'Hyundai Heavy Ind.', 'kiln'],
  ['Gumi', 'Gumi City sewage plant', 'Waste oil / sludge', 'Kiln 9.5 t/h', 'Government', 'kiln'],
];
const body = document.getElementById('recBody');
const record = document.getElementById('record');
let filter = 'all', showAll = false;
function renderRec() {
  const rows = REC.filter(r => filter === 'all' || r[5] === filter);
  const list = (showAll || filter !== 'all') ? rows : rows.slice(0, 8);
  record.classList.toggle('all', showAll || filter !== 'all');
  body.innerHTML = list.map((r, i) =>
    `<tr style="animation-delay:${i * 25}ms"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');
}
document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(x => x.classList.toggle('is-on', x === b));
  filter = b.dataset.f; renderRec();
}));
document.getElementById('recMore').addEventListener('click', () => { showAll = true; renderRec(); });
renderRec();
