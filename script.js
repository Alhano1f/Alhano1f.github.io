(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = (n, l = 3) => String(Math.round(n)).padStart(l, '0');
  const GLYPHS = '#%&@$*+=<>/\\ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

  $('#yr').textContent = new Date().getFullYear();

  /* ---------- scramble text ---------- */
  const scrambleTimers = new WeakMap();
  function scramble(el, text, dur = 520) {
    if (reduce) { el.textContent = text; return; }
    cancelAnimationFrame(scrambleTimers.get(el));
    const t0 = performance.now();
    const tick = now => {
      const p = clamp((now - t0) / dur);
      const n = Math.floor(p * text.length);
      let out = text.slice(0, n);
      for (let i = n; i < text.length; i++) out += text[i] === ' ' || text[i] === '·' ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (p < 1) scrambleTimers.set(el, requestAnimationFrame(tick));
    };
    scrambleTimers.set(el, requestAnimationFrame(tick));
  }

  /* ---------- boot ---------- */
  const boot = $('#boot');
  if (reduce || sessionStorageGet('al-booted')) { boot.classList.add('done'); }
  else {
    const num = $('#bootNum'), bar = $('#bootBar'), t0 = performance.now(), D = 1100;
    const step = now => {
      const p = clamp((now - t0) / D), e = 1 - Math.pow(1 - p, 3);
      num.textContent = pad(e * 100); bar.style.width = e * 100 + '%';
      if (p < 1) requestAnimationFrame(step);
      else { setTimeout(() => boot.classList.add('done'), 180); sessionStorageSet('al-booted', '1'); }
    };
    requestAnimationFrame(step);
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ---------- sections, bar, scroll % ---------- */
  const bar = $('#bar'), secLabel = $('#secLabel'), pct = $('#scrollPct');
  const sections = $$('[data-label]');
  $$('.scrolly').forEach(s => s.style.setProperty('--h', s.dataset.h || 4));
  let currentLabel = '';

  function progressOf(sec) {
    const r = sec.getBoundingClientRect();
    const vh = innerHeight;
    const total = r.height - (vh - 48);
    return total > 0 ? clamp(-r.top / total) : (r.top < 0 ? 1 : 0);
  }

  /* ---------- memories ---------- */
  const MEMS = [
    ['MARKET SIZING', 'Riyadh Art · TAM', 'bars'],
    ['BENCHMARKING', 'Big Time Film Fund · TAM', 'compare'],
    ['OPERATING MODEL', 'Saudi Film Talent · TAM', 'flow'],
    ['WORKFORCE', 'Riyadh Season · Expo 2020 · Expo 2025', 'grid'],
    ['ERP SYSTEMS', 'Odoo implementations · Rightechs', 'flow2'],
    ['MACHINE LEARNING', 'Teaching-licence PoC · ETEC', 'scatter'],
    ['RESEARCH', 'IEEE · electricity consumption', 'line'],
    ['DASHBOARDS', 'Power BI · ETEC & GamePulse', 'dash'],
    ['CASE COACHING', 'Mustashar MiniMBA', 'tree'],
  ];
  const thumbs = {
    bars: '<svg viewBox="0 0 100 50" preserveAspectRatio="none"><g fill="#1E90FF">' + [14, 22, 18, 30, 26, 38, 44].map((h, i) => `<rect x="${6 + i * 13}" y="${48 - h}" width="8" height="${h}" opacity="${.4 + i * .09}"/>`).join('') + '</g></svg>',
    compare: '<svg viewBox="0 0 100 50"><g stroke="#BFC7D1" stroke-width=".6" fill="none"><circle cx="30" cy="25" r="15"/><circle cx="50" cy="25" r="15" stroke="#1E90FF"/><circle cx="70" cy="25" r="15"/></g></svg>',
    flow: '<svg viewBox="0 0 100 50"><g fill="none" stroke="#1E90FF" stroke-width=".8"><rect x="6" y="18" width="16" height="14"/><rect x="42" y="8" width="16" height="14"/><rect x="42" y="28" width="16" height="14"/><rect x="78" y="18" width="16" height="14"/><path d="M22 25h10v-10h10M32 25v10h10M58 15h10v10h10M58 35h10V25" stroke="#BFC7D1"/></g></svg>',
    grid: '<svg viewBox="0 0 100 50"><g fill="#1E90FF">' + Array.from({ length: 18 }, (_, i) => `<rect x="${8 + (i % 6) * 15}" y="${6 + Math.floor(i / 6) * 14}" width="11" height="10" opacity="${[.25, .5, .9][(i * 7) % 3]}"/>`).join('') + '</g></svg>',
    flow2: '<svg viewBox="0 0 100 50"><g fill="none" stroke="#BFC7D1" stroke-width=".7"><path d="M8 25h84"/></g><g fill="#1E90FF">' + [12, 30, 48, 66, 84].map(x => `<circle cx="${x}" cy="25" r="4"/>`).join('') + '</g></svg>',
    scatter: '<svg viewBox="0 0 100 50"><g fill="#1E90FF">' + Array.from({ length: 34 }, (_, i) => { const x = 6 + (i * 37 % 88), y = 44 - x * .38 + ((i * 13) % 11 - 5); return `<circle cx="${x}" cy="${y}" r="1.4" opacity=".85"/>`; }).join('') + '</g><path d="M6 44L94 10" stroke="#BFC7D1" stroke-width=".6"/></svg>',
    line: '<svg viewBox="0 0 100 50" preserveAspectRatio="none"><path d="M0 38 C10 30 15 34 22 26 S35 30 42 20 55 28 62 16 78 22 86 10L100 14" fill="none" stroke="#1E90FF" stroke-width="1.2"/><path d="M0 40 C10 34 15 36 22 30 S35 33 42 24 55 30 62 20 78 26 86 15L100 18" fill="none" stroke="#BFC7D1" stroke-width=".5" stroke-dasharray="2 2"/></svg>',
    dash: '<svg viewBox="0 0 100 50"><g fill="none" stroke="#3a3f48" stroke-width=".6"><rect x="4" y="4" width="44" height="20"/><rect x="52" y="4" width="44" height="20"/><rect x="4" y="27" width="92" height="19"/></g><path d="M8 18l8-6 8 4 8-8 8 5" stroke="#1E90FF" fill="none"/><circle cx="74" cy="14" r="7" fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="30 14"/><g fill="#BFC7D1">' + [10, 22, 34, 46, 58, 70, 82].map((x, i) => `<rect x="${x}" y="${42 - (i * 5 % 11) - 3}" width="6" height="${(i * 5 % 11) + 3}"/>`).join('') + '</g></svg>',
    tree: '<svg viewBox="0 0 100 50"><g fill="none" stroke="#BFC7D1" stroke-width=".7"><path d="M50 8v8M50 16H22v8M50 16h28v8M22 32v0M22 24H12v10M22 24h10v10M78 24H68v10M78 24h10v10"/></g><g fill="#1E90FF"><rect x="44" y="3" width="12" height="6"/>' + [12, 32, 68, 88].map(x => `<rect x="${x - 4}" y="34" width="8" height="6"/>`).join('') + '</g></svg>',
  };
  const space = $('#space');
  const POS = [[-.26, -.05], [.2, -.2], [-.05, .22], [.28, .16], [-.3, .26], [.06, -.26], [-.2, -.24], [.3, -.02], [-.02, .02]];
  const cards = MEMS.map((m, i) => {
    const d = document.createElement('div');
    d.className = 'mem';
    d.innerHTML = `<div class="mh"><span>0${i + 1}-${MEMS.length}</span><span>MEMORY</span></div><div class="thumb">${thumbs[m[2]]}</div><div class="mt">${m[0]}</div><div class="ms">${m[1]}</div>`;
    space.appendChild(d);
    return d;
  });
  const memTitle = $('#memTitle'), memSub = $('#memSub'), memCount = $('#memCount'), memDepth = $('#memDepth'), depthBar = $('#depthBar'), memFoot = $('#memFoot'), welcome = $('#welcome');
  let activeMem = -1;
  const GAP = 520;

  function renderMemories(p) {
    const W = space.clientWidth, H = space.clientHeight;
    const mobile = W < 700;
    const travel = p / .8; // cards finish at 80%
    const zHead = travel * (3000 + (MEMS.length - 1) * GAP + 700);
    let best = 0, bestD = 1e9;
    cards.forEach((c, i) => {
      const z = -3000 - i * GAP + zHead;
      const [px, py] = POS[i];
      const x = px * W * (mobile ? 1.1 : 1), y = py * H;
      const op = z > 650 ? 0 : clamp((z + 3600) / 2200) * (z > 380 ? clamp(1 - (z - 380) / 270) : 1);
      c.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
      c.style.opacity = op.toFixed(3);
      c.style.visibility = op < .01 ? 'hidden' : 'visible';
      const dz = Math.abs(z - 120);
      if (op > .05 && dz < bestD) { bestD = dz; best = i; }
    });
    if (best !== activeMem) {
      activeMem = best;
      memCount.textContent = `MEMORY ${pad(best + 1, 2)} / ${pad(MEMS.length, 2)}`;
      scramble(memTitle, MEMS[best][0], 380);
      memSub.textContent = MEMS[best][1];
    }
    const depth = clamp(travel) * 100;
    memDepth.textContent = pad(depth);
    depthBar.style.width = depth + '%';
    const wp = clamp((p - .78) / .2);
    welcome.style.opacity = wp < .02 ? 0 : clamp(wp * 1.6);
    welcome.style.transform = `scale(${.35 + wp * .75})`;
    welcome.style.textShadow = `${.07 * wp}em ${.07 * wp}em 0 #1E90FF`;
    $('.mem-label').style.opacity = 1 - wp;
    memFoot.textContent = p < .05 ? 'SCROLL TO OPEN ↓' : (wp > .5 ? 'YOU JUST STEPPED IN' : 'YOU ARE INSIDE');
  }

  /* ---------- starfield ---------- */
  const canvas = $('#stars'), ctx = canvas.getContext('2d');
  let stars = [], cw = 0, ch = 0, dpr = 1, warp = 0, lastY = scrollY;
  function sizeStars() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round(cw * ch / 2600) }, newStar);
  }
  function newStar() { return { x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2, z: Math.random(), s: Math.random() }; }
  function drawStars() {
    ctx.clearRect(0, 0, cw, ch);
    const speed = .0009 + warp * .00025;
    for (const st of stars) {
      st.z -= speed;
      if (st.z <= .02) Object.assign(st, newStar(), { z: 1 });
      const k = .5 / st.z, x = cw / 2 + st.x * cw * k * .5, y = ch / 2 + st.y * ch * k * .5;
      if (x < 0 || x > cw || y < 0 || y > ch) { st.z = 0; continue; }
      const r = (1 - st.z) * 1.9 * (.5 + st.s), a = clamp((1 - st.z) * 1.2) * (.35 + st.s * .6);
      ctx.fillStyle = st.s > .93 ? `rgba(30,144,255,${a})` : `rgba(235,238,242,${a})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }
    warp *= .92;
  }

  /* ---------- dot sphere (pick a side) ---------- */
  const sc = $('#sphere'), sctx = sc.getContext('2d');
  let pts = [], sw = 0, sh = 0, rot = 0;
  function sizeSphere() {
    const d = Math.min(devicePixelRatio || 1, 2);
    sw = sc.clientWidth; sh = sc.clientHeight;
    sc.width = sw * d; sc.height = sh * d; sctx.setTransform(d, 0, 0, d, 0, 0);
    const N = 900; pts = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
  }
  let sphereSide = null;
  function drawSphere() {
    sctx.clearRect(0, 0, sw, sh);
    const R = Math.min(sw * .3, sh * .36), cx = sw / 2, cy = sh * .52;
    rot += .0032;
    const c = Math.cos(rot), s = Math.sin(rot);
    for (const [x0, y, z0] of pts) {
      const x = x0 * c - z0 * s, z = x0 * s + z0 * c;
      const depth = (z + 1) / 2, px = cx + x * R, py = cy + y * R * .92;
      const left = px < cx;
      let col = '237,235,230';
      if (sphereSide === 'analytical' && left) col = '30,144,255';
      if (sphereSide === 'strategic' && !left) col = '255,255,255';
      let a = .12 + depth * .7;
      if (sphereSide && ((sphereSide === 'analytical') !== left)) a *= .3;
      sctx.fillStyle = `rgba(${col},${a})`;
      sctx.fillRect(px, py, 1 + depth * 1.8, 1 + depth * 1.8);
    }
  }
  // side panels
  $$('.side-card').forEach(btn => btn.addEventListener('click', () => {
    const side = btn.dataset.side, open = btn.getAttribute('aria-expanded') === 'true';
    $$('.side-card').forEach(b => b.setAttribute('aria-expanded', 'false'));
    $$('.side-drawer').forEach(d => d.hidden = true);
    sphereSide = null;
    if (!open) {
      btn.setAttribute('aria-expanded', 'true');
      const d = $('#' + btn.getAttribute('aria-controls'));
      d.hidden = false; sphereSide = side;
      d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }
    if (reduce) drawSphere();
  }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => {
    const d = b.closest('.side-drawer'); d.hidden = true; sphereSide = null;
    const btn = $(`[aria-controls="${d.id}"]`); btn.setAttribute('aria-expanded', 'false'); btn.focus();
  }));

  /* ---------- lines ---------- */
  const lns = $$('#lines .ln'), lineNum = $('#lineNum'), arrow = $('.arrow-line');
  let lastLine = -2;
  function renderLines(p) {
    const k = Math.min(lns.length - 1, Math.floor(p * lns.length * 1.05));
    if (k === lastLine) return; lastLine = k;
    lns.forEach((el, i) => {
      el.classList.toggle('active', i === k);
      el.classList.toggle('past', i < k);
      if (i < k) {
        const back = k - i;
        el.style.transform = `translateY(calc(-50% - ${back * 9 + 16}vh)) scale(${Math.max(.32, .5 - (back - 1) * .08)})`;
      } else if (i === k) el.style.transform = '';
      else el.style.transform = 'translateY(40px)';
    });
    lineNum.textContent = pad(k + 1, 2);
    arrow.classList.toggle('on', k === lns.length - 1);
  }

  /* ---------- who (sideways) ---------- */
  const track = $('#whoTrack');
  function renderWho(p) {
    if (innerWidth <= 760) { track.style.transform = ''; return; }
    const u = clamp((p - .04) / .92) * 2, i = Math.floor(u), f = u - i;
    const t = clamp((f - .38) / .3), sm = t * t * (3 - 2 * t);
    const pos = Math.min(2, i + sm);
    track.style.transform = `translate3d(${-pos * 100}%,0,0)`;
  }

  /* ---------- credits ---------- */
  const crList = $('#creditsList'), crItems = $$('li', crList), crNum = $('#crNum');
  let lastCr = -1;
  function renderCredits(p) {
    const rowH = crItems[0].offsetHeight;
    const pos = p * (crItems.length - 1);
    crList.style.transform = `translateY(${-pos * rowH - rowH / 2}px)`;
    const k = Math.round(pos);
    if (k !== lastCr) {
      lastCr = k;
      crItems.forEach((li, i) => li.classList.toggle('on', i === k));
      crNum.textContent = pad(k + 1, 2);
    }
  }

  /* ---------- counters + reveal ---------- */
  function countUp(el) {
    if (el.dataset.text) { scramble(el, el.dataset.text, 900); return; }
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const fmt = v => pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), D = 1400;
    const step = now => {
      const q = clamp((now - t0) / D), e = 1 - Math.pow(1 - q, 4);
      let s = fmt(to * e);
      if (q < .7) s = s.replace(/\d/g, ch => Math.random() < .35 * (1 - q) ? '#%&@$'[(Math.random() * 5) | 0] : ch);
      el.textContent = s;
      if (q < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.classList.contains('num')) countUp(e.target);
    else e.target.classList.add('in');
    io.unobserve(e.target);
  }), { threshold: .3 });
  $$('.num, .reveal').forEach(el => io.observe(el));

  /* ---------- main loop ---------- */
  const memSec = $('#memories'), lineSec = $('#lines'), whoSec = $('#who'), crSec = $('#credits'), sideSec = $('#side');
  let starsVisible = false, sphereVisible = false;
  const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.target === sideSec) sphereVisible = e.isIntersecting; if (e.target === memSec) starsVisible = e.isIntersecting; }));
  io2.observe(sideSec); io2.observe(memSec);

  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    pct.textContent = pad(clamp(scrollY / max) * 100);
    warp = Math.min(40, warp + Math.abs(scrollY - lastY) * .08); lastY = scrollY;

    // current section + bar theme
    const probe = 60;
    let cur = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top <= probe) cur = s;
    const lbl = cur.dataset.label;
    if (lbl !== currentLabel) { currentLabel = lbl; scramble(secLabel, lbl); }
    bar.classList.toggle('on-dark', !cur.classList.contains('light'));

    if (reduce) return;
    renderMemories(progressOf(memSec));
    renderLines(progressOf(lineSec));
    renderWho(progressOf(whoSec));
    renderCredits(progressOf(crSec));
  }

  function frame() {
    if (starsVisible) drawStars();
    if (sphereVisible) drawSphere();
    requestAnimationFrame(frame);
  }

  /* ---------- fit the landing headline ---------- */
  const mega = $('.mega');
  function fitMega() {
    mega.style.fontSize = '100px';
    const stacked = innerWidth <= 900;
    const need = stacked ? Math.max(...$$('span', mega).map(s => s.scrollWidth)) : mega.scrollWidth;
    const size = Math.min(stacked ? 96 : 170, 100 * mega.clientWidth / need * .98);
    mega.style.fontSize = size.toFixed(1) + 'px';
  }
  if (document.fonts) document.fonts.ready.then(fitMega);

  function onResize() { fitMega(); sizeStars(); sizeSphere(); onScroll(); if (reduce) drawSphere(); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);
  onResize();
  if (!reduce) requestAnimationFrame(frame);
  else { drawStars(); drawSphere(); }

  // measure widget on landing
  const mn = $('#measureNum');
  if (mn && !reduce) setInterval(() => { mn.textContent = pad(260 + Math.random() * 60); }, 1600);
})();
