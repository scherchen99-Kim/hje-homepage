/* ---------- background images: make --img paths absolute ---------- */
document.querySelectorAll('[style*="--img"]').forEach(el => {
  const m = el.getAttribute('style').match(/--img:\s*url\(["']?([^"')]+)["']?\)/);
  if (m) el.style.setProperty('--img', `url("${new URL(m[1], location.href).href}")`);
});

/* ---------- header menu ---------- */
const burger = document.getElementById('burger');
burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

/* ---------- hero carousel ---------- */
const hero = document.getElementById('hero');
const slides = [...hero.querySelectorAll('.slide')];
const cards = [...hero.querySelectorAll('.hcard')];
const DUR = 6000;
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
// Korean labels, same order as REC
const REC_KO = [
  ['문경', '문경시', '유류·생활폐기물', '150톤/일', '삼성엔지니어링 / 한솔제지'],
  ['수원', '수원시', '경유·폐유', '250톤/일', '현대중공업'],
  ['거제', '거제시', '경유·생활폐기물', '150톤/일', '진도'],
  ['홍성', '홍성군', '경유', '200톤/일', '진도'],
  ['순천', '순천시', '생활폐기물', '120톤/일', 'LG기계'],
  ['가평', '가평군', '생활폐기물', '100톤/일', '정부 발주'],
  ['울산', '그린엔바이론', '가스·생활폐기물', '110톤/일', '현대중공업'],
  ['구미', '도레이새한', '가스·생활폐기물', '110톤/일', '삼성엔지니어링'],
  ['울산', '삼성전자', '공장 폐기물', '190톤/일', '삼성엔지니어링'],
  ['구미', 'LG전자', '공장 폐기물', '85톤/일', 'LG기계'],
  ['청주', 'LG화학', '메탄가스·공장 폐기물', '80톤/일', 'LG기계'],
  ['군포', 'LG상사', '가스·공장 폐기물', '120톤/일', 'LG기계'],
  ['양산', '삼성 ICT 그룹', '공장 폐기물', '150톤/일', '삼성엔지니어링'],
  ['진주', '한국화학', '공장·생활폐기물', '150톤/일', '진도'],
  ['안성', '오리엔탈', '공장·생활폐기물', '90톤/일', '삼성엔지니어링'],
  ['안양', '노루페인트', '공장 폐기물', '100톤/일', '진도'],
  ['안산', '강성산업', '공장 폐기물', '120톤/일', '진도'],
  ['반월', '국제화학', '경유·공장 폐기물', '70톤/일', '삼성엔지니어링'],
  ['반월', '신풍제약', '경유·폐유·공장 폐기물', '80톤/일', '삼성엔지니어링'],
  ['김해', '스밀', '경유·공장·생활폐기물', '70톤/일', '진도'],
  ['창원', '효성중공업', '경유', '80톤/일', '진도'],
  ['울산', '미창석유', '폐유·생활폐기물', '230톤/시간', '진도'],
  ['안성', '신풍제지', '경유·공장 폐기물', '50톤/일', 'LG기계'],
  ['여수', '삼양화학', '메탄가스', '80톤/일', '삼양화학'],
  ['안산', '성림유화', '폐유', '8톤/시간', '삼성엔지니어링'],
  ['수원', '공군', '군 생활폐기물', '80톤/일', '진도'],
  ['영천', '군 학교 3곳', '군 생활폐기물', '110톤/일', '진도'],
  ['서울', '을지병원', '의료폐기물', '2.3톤/시간', '혁진'],
  ['—', '순천향병원', '의료폐기물', '3.5톤/시간', '혁진'],
  ['서울', '가톨릭 강남성모병원', '의료폐기물', '2.8톤/시간', '혁진'],
  ['—', '원에코', '의료폐기물', '2.0톤/시간', '혁진'],
  ['광양', 'KY스틸', 'COG·공장 슬러지', '킬른·건조기 300톤/일', '현대중공업'],
  ['포항', '포스코', 'COG·탄소', '킬른·건조기 250톤/일', '현대중공업'],
  ['구미', '구미시 하수처리장', '폐유·슬러지', '킬른 9.5톤/시간', '정부 발주'],
];
const IS_KO = document.documentElement.lang === 'ko';
if (IS_KO) REC.forEach((r, i) => { REC[i] = [...REC_KO[i], r[5]]; });
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

/* ---------- logo: back to the very top (the #top header is fixed, so the browser would not scroll) ---------- */
document.querySelectorAll('a[href="#top"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  document.body.classList.remove('menu-open');
  scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
}));

/* ---------- technology: animated plant, synced with the 5-step list ---------- */
(() => {
  const plant = document.getElementById('plant');
  if (!plant) return;
  const steps = [...document.querySelectorAll('.flow li')];
  const STEP = 2400;
  plant.querySelectorAll('.fx-path, .fx-under').forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1));
  document.querySelector('.flow').style.setProperty('--step', STEP / 1000 + 's');
  const turnOn = n => plant.querySelectorAll(`[data-step="${n}"]`).forEach(el => el.classList.add('on'));
  let cur = 0, timer = null;
  const show = n => {
    for (let k = 1; k <= n; k++) turnOn(k);
    steps.forEach((li, i) => { li.classList.remove('active'); if (i === n - 1) { void li.offsetWidth; li.classList.add('active'); } });
    cur = n;
  };
  const run = () => { clearInterval(timer); timer = setInterval(() => show(cur % steps.length + 1), STEP); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { show(steps.length); return; }
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { o.disconnect(); show(1); run(); }
  }), { threshold: .35 }).observe(plant);
  steps.forEach((li, i) => li.addEventListener('click', () => { show(i + 1); run(); }));
})();
