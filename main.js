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
// Simplified Chinese labels, same order as REC
const REC_ZH = [
  ['闻庆', '闻庆市', '燃油·生活垃圾', '150吨/日', '三星工程 / 韩松制纸'],
  ['水原', '水原市', '轻油·废油', '250吨/日', '现代重工业'],
  ['巨济', '巨济市', '轻油·生活垃圾', '150吨/日', 'Jindo'],
  ['洪城', '洪城郡', '轻油', '200吨/日', 'Jindo'],
  ['顺天', '顺天市', '生活垃圾', '120吨/日', 'LG机械'],
  ['加平', '加平郡', '生活垃圾', '100吨/日', '政府'],
  ['蔚山', 'Green Environ', '燃气·生活垃圾', '110吨/日', '现代重工业'],
  ['龟尾', 'Toray Saehan', '燃气·生活垃圾', '110吨/日', '三星工程'],
  ['蔚山', '三星电子', '工业废弃物', '190吨/日', '三星工程'],
  ['龟尾', 'LG电子', '工业废弃物', '85吨/日', 'LG机械'],
  ['清州', 'LG化学', '沼气·工业废弃物', '80吨/日', 'LG机械'],
  ['军浦', 'LG商事', '燃气·工业废弃物', '120吨/日', 'LG机械'],
  ['梁山', '三星ICT集团', '工业废弃物', '150吨/日', '三星工程'],
  ['晋州', 'Korea Chemical', '工业·生活垃圾', '150吨/日', 'Jindo'],
  ['安城', 'Oriental', '工业·生活垃圾', '90吨/日', '三星工程'],
  ['安养', 'Noroo涂料', '工业废弃物', '100吨/日', 'Jindo'],
  ['安山', 'Kangsung Ind.', '工业废弃物', '120吨/日', 'Jindo'],
  ['半月', 'Kukje Chemical', '轻油·工业废弃物', '70吨/日', '三星工程'],
  ['半月', 'Shinpoong制药', '轻油·废油·工业废弃物', '80吨/日', '三星工程'],
  ['金海', 'Smil', '轻油·工业·生活垃圾', '70吨/日', 'Jindo'],
  ['昌原', '晓星重工业', '轻油', '80吨/日', 'Jindo'],
  ['蔚山', 'Michang Oil', '废油·生活垃圾', '230吨/时', 'Jindo'],
  ['安城', 'Sinpung Paper', '轻油·工业废弃物', '50吨/日', 'LG机械'],
  ['丽水', '三养化学', '沼气', '80吨/日', '三养化学'],
  ['安山', 'Sunglim Yuhwa', '废油', '8吨/时', '三星工程'],
  ['水原', '空军', '军营生活垃圾', '80吨/日', 'Jindo'],
  ['永川', '3所军事院校', '军营生活垃圾', '110吨/日', 'Jindo'],
  ['首尔', '乙支医院', '医疗废弃物', '2.3吨/时', 'HJE'],
  ['—', '顺天乡大学附属医院', '医疗废弃物', '3.5吨/时', 'HJE'],
  ['首尔', '天主教江南圣母医院', '医疗废弃物', '2.8吨/时', 'HJE'],
  ['—', 'One Eco', '医疗废弃物', '2.0吨/时', 'HJE'],
  ['光阳', 'KY Steel', '焦炉煤气·工业污泥', '窑炉/干燥机 300吨/日', '现代重工业'],
  ['浦项', '浦项制铁（POSCO）', '焦炉煤气·碳', '窑炉/干燥机 250吨/日', '现代重工业'],
  ['龟尾', '龟尾市污水处理厂', '废油·污泥', '窑炉 9.5吨/时', '政府'],
];
// Spanish labels: place and company names stay as in English, the rest translated
const ES_WASTE = {
  'Oil / municipal': 'Petróleo / municipales', 'Light & waste oil': 'Diésel y aceite usado', 'Light oil / municipal': 'Diésel / municipales',
  'Light oil': 'Diésel', 'Municipal waste': 'Residuos municipales', 'Gas / municipal': 'Gas / municipales', 'Factory waste': 'Residuos industriales',
  'Methane gas / factory': 'Gas metano / industriales', 'Gas / factory waste': 'Gas / residuos industriales', 'Factory / municipal': 'Industriales / municipales',
  'Light oil / factory': 'Diésel / industriales', 'Light & waste oil / factory': 'Diésel, aceite usado / industriales',
  'Light oil / factory / municipal': 'Diésel / industriales / municipales', 'Waste oil / municipal': 'Aceite usado / municipales',
  'Methane gas': 'Gas metano', 'Waste oil': 'Aceite usado', 'Military waste': 'Residuos militares', 'Medical waste': 'Residuos médicos',
  'COG / factory sludge': 'Gas de coque / lodos industriales', 'COG / carbon': 'Gas de coque / carbón', 'Waste oil / sludge': 'Aceite usado / lodos',
};
const ES_CLIENT = { 'Air Force': 'Fuerza Aérea', '3 military schools': '3 escuelas militares', 'Gumi City sewage plant': 'Planta de aguas residuales de Gumi' };
const esCap = c => c.replace('Kiln / dryer', 'Horno / secador').replace('Kiln', 'Horno').replace(/t\/day/g, 't/día');
const esClient = c => ES_CLIENT[c] || c.replace(/ City$/, ' (ciudad)').replace(/ County$/, ' (condado)');
const LANG = document.documentElement.lang.slice(0, 2);
if (LANG === 'ko') REC.forEach((r, i) => { REC[i] = [...REC_KO[i], r[5]]; });
if (LANG === 'zh') REC.forEach((r, i) => { REC[i] = [...REC_ZH[i], r[5]]; });
// Malay labels: place and company names stay as in English
const MS_WASTE = {
  'Oil / municipal': 'Minyak / sisa perbandaran', 'Light & waste oil': 'Diesel dan minyak terpakai', 'Light oil / municipal': 'Diesel / sisa perbandaran',
  'Light oil': 'Diesel', 'Municipal waste': 'Sisa perbandaran', 'Gas / municipal': 'Gas / sisa perbandaran', 'Factory waste': 'Sisa kilang',
  'Methane gas / factory': 'Gas metana / sisa kilang', 'Gas / factory waste': 'Gas / sisa kilang', 'Factory / municipal': 'Sisa kilang / perbandaran',
  'Light oil / factory': 'Diesel / sisa kilang', 'Light & waste oil / factory': 'Diesel dan minyak terpakai / sisa kilang',
  'Light oil / factory / municipal': 'Diesel / sisa kilang / sisa perbandaran', 'Waste oil / municipal': 'Minyak terpakai / sisa perbandaran',
  'Methane gas': 'Gas metana', 'Waste oil': 'Minyak terpakai', 'Military waste': 'Sisa ketenteraan', 'Medical waste': 'Sisa perubatan',
  'COG / factory sludge': 'Gas ketuhar kok / enap cemar kilang', 'COG / carbon': 'Gas ketuhar kok / karbon', 'Waste oil / sludge': 'Minyak terpakai / enap cemar',
};
const MS_CLIENT = { 'Air Force': 'Tentera Udara', '3 military schools': '3 sekolah tentera', 'Gumi City sewage plant': 'Loji rawatan kumbahan Bandar Gumi' };
const msCap = c => c.replace('Kiln / dryer', 'Tanur / pengering').replace('Kiln', 'Tanur').replace(/t\/day/g, 'tan/hari').replace(/t\/h$/, 'tan/jam');
const msClient = c => MS_CLIENT[c] || c.replace(/^(.*) City$/, 'Bandar $1').replace(/^(.*) County$/, 'Daerah $1');
if (LANG === 'ms') REC.forEach((r, i) => { REC[i] = [r[0], msClient(r[1]), MS_WASTE[r[2]] || r[2], msCap(r[3]), r[4] === 'Government' ? 'Kerajaan' : r[4], r[5]]; });
if (LANG === 'es') REC.forEach((r, i) => { REC[i] = [r[0], esClient(r[1]), ES_WASTE[r[2]] || r[2], esCap(r[3]), r[4] === 'Government' ? 'Gobierno' : r[4], r[5]]; });
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

/* ---------- patent certificates: click to enlarge ---------- */
(() => {
  const links = document.querySelectorAll('.patent-card, img[data-zoom]');
  if (!links.length) return;
  const box = document.createElement('div'); box.className = 'lightbox'; box.innerHTML = '<img alt="">';
  document.body.appendChild(box);
  const img = box.querySelector('img');
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const pic = a.tagName === 'IMG' ? a : a.querySelector('img');
    img.src = a.tagName === 'IMG' ? a.currentSrc || a.src : a.href; img.alt = pic.alt; box.classList.add('open');
  }));
  const close = () => box.classList.remove('open');
  box.addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---------- white header: soft shadow once the page scrolls ---------- */
const hdr = document.querySelector('.hdr');
const onScrollHdr = () => hdr.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScrollHdr, { passive: true }); onScrollHdr();
// hdr.scrolled
