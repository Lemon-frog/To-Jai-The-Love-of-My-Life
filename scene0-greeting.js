/* SCENE 0: greeting dialogue (edit LINES at the top), man animation, typewriter */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = gsap.utils.random;
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e); return e;
  };
  const STAR = 'M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z';

  /* ----- What he says. Edit freely. "mood" drives his gestures:
         wave = big wave, shy = slower wave + head tilt, offer = holds the flower out to you ----- */
  const LINES = [
    { text: "Hi Jai! Sana ayos ka lang diyan.", mood: 'wave' },
    { text: "Alam kong magkalayo tayo ngayon.", mood: 'wave' },
    { text: "Pero gusto ko pa rin na ligawan ka.", mood: 'shy' },
    { text: "Hindi hadlang ang distansya para sa pagmamahal ko sayo.", mood: 'offer' },
    { text: "Kaya Jai, may tanong ako sayo.", mood: 'offer' }
  ];

  /* ----- Backdrop: warm bokeh + grass ----- */
  const bk = document.getElementById('bokeh0');
  const tints = ['rgba(255,236,200,.5)', 'rgba(255,200,212,.35)', 'rgba(214,196,242,.38)'];
  for (let i = 0; i < 8; i++) {
    const d = document.createElement('div'), sz = rnd(40, 120);
    d.className = 'bokeh';
    d.style.cssText = `left:${rnd(0, 95)}%;top:${rnd(0, 80)}%;width:${sz}px;height:${sz}px;background:${tints[i % 3]}`;
    bk.appendChild(d);
    if (!reduceMotion) {
      gsap.to(d, { x: rnd(-30, 30), y: rnd(-40, 40), duration: rnd(7, 12), ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(d, { opacity: rnd(0.35, 0.7), duration: rnd(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }
  const grass = document.getElementById('gGrass');
  for (let i = 0; i < 40; i++) {
    const x = rnd(-300, 760);
    mk('path', { d: `M${x} 490q-2 -8 -4 -11M${x} 490q0 -10 1 -14M${x} 490q2 -8 5 -10`, fill: 'none',
      stroke: '#B58FA8', 'stroke-width': 1.3, 'stroke-linecap': 'round' }, grass);
  }

  /* ----- Extra scenery: fence, garland, birds, butterfly, blossoms ----- */
  const fence = document.getElementById('gFence');
  for (let x = -70; x < 110; x += 12) mk('path', { d: `M${x} 488V468L${x + 2.5} 464L${x + 5} 468V488Z` }, fence);
  mk('rect', { x: -70, y: 472, width: 180, height: 2.5 }, fence);
  mk('rect', { x: -70, y: 480, width: 180, height: 2.5 }, fence);

  const bloomCols = ['#F4B6C6', '#FFFDFC', '#F6D98B', '#C9B8F0'];
  for (let i = 0; i < 30; i++) {
    const x = rnd(-50, 450), h = rnd(8, 15);
    mk('path', { d: `M${x} 490 q1 -${h / 2} 0 -${h}`, fill: 'none', stroke: '#9A7E98', 'stroke-width': 1.2 }, grass);
    mk('circle', { cx: x, cy: 490 - h, r: rnd(1.8, 2.8), fill: bloomCols[i % 4] }, grass);
  }

  const gar = document.getElementById('gGarland');
  mk('path', { d: 'M-24 366 Q 170 470 366 424', fill: 'none', stroke: '#8D78A8', 'stroke-width': 1 }, gar);
  const bulbs0 = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, u = 1 - t;
    const x = u * u * -24 + 2 * u * t * 170 + t * t * 366, y = u * u * 366 + 2 * u * t * 470 + t * t * 424;
    const g = mk('g', {}, gar);
    mk('circle', { cx: x, cy: y + 3, r: 7, fill: '#FFE3A0', opacity: 0.3 }, g);
    mk('circle', { cx: x, cy: y + 3, r: 2.6, fill: '#FFF3C9' }, g);
    bulbs0.push(g);
  }
  if (!reduceMotion) gsap.to(bulbs0, { opacity: 0.45, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.15, from: 'random' } });

  const birdsG = document.getElementById('gBirds');
  [[360, 150, 1], [404, 178, 0.8], [-24, 176, 0.9], [20, 150, 0.7]].forEach(([x, y, sc]) => {
    const g = mk('g', {}, birdsG);
    mk('path', { class: 'bird', d: 'M0 0 q6 -7 12 0 q6 -7 12 0' }, g);
    gsap.set(g, { x, y, scale: sc });
    if (!reduceMotion) gsap.to(g, { x: '+=' + rnd(30, 60), y: '+=' + rnd(-14, 14), duration: rnd(7, 11), ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  function makeButterfly(parent, fill, stroke, sc) {
    const b = mk('g', {}, parent);
    const wl = mk('g', { class: 'wing-l' }, b), wr = mk('g', { class: 'wing-r' }, b);
    mk('path', { d: 'M0 0 C-6 -10 -16 -9 -14 0 C-13 7 -5 7 0 0Z', fill, stroke, 'stroke-width': 0.7 }, wl);
    mk('path', { d: 'M0 0 C6 -10 16 -9 14 0 C13 7 5 7 0 0Z', fill, stroke, 'stroke-width': 0.7 }, wr);
    mk('ellipse', { rx: 1.1, ry: 4.4, cy: 1, fill: '#6A4A5A' }, b);
    mk('path', { d: 'M0 -3 q-2 -4 -4 -4 M0 -3 q2 -4 4 -4', fill: 'none', stroke: '#6A4A5A', 'stroke-width': 0.6 }, b);
    gsap.set(b, { scale: sc });
    return b;
  }
  const fx = document.getElementById('gFx');
  if (!reduceMotion) {
    const bf = makeButterfly(fx, '#F4B6C6', '#D58FA3', 1.1);
    gsap.set(bf, { x: 90, y: 250 });
    (function fly() { gsap.to(bf, { x: rnd(60, 160), y: rnd(190, 300), duration: rnd(2.6, 4.2), ease: 'sine.inOut', onComplete: fly }); })();
    const bf2 = makeButterfly(fx, '#F6D98B', '#C9A24E', 0.8);
    gsap.set(bf2, { x: 380, y: 330 });
    (function fly2() { gsap.to(bf2, { x: rnd(300, 440), y: rnd(300, 420), duration: rnd(3, 5), ease: 'sine.inOut', onComplete: fly2 }); })();

    // blossoms drifting from the tree
    (function treePetal() {
      const p = mk('ellipse', { rx: 3.4, ry: 2, fill: '#F4B6C6' }, fx);
      const D = rnd(5, 8);
      gsap.set(p, { x: 322 + rnd(-50, 50), y: 400 + rnd(-30, 20), rotation: rnd(0, 180) });
      gsap.timeline({ onComplete: () => p.remove() })
        .to(p, { y: 486, duration: D, ease: 'power1.in' }, 0)
        .to(p, { x: '-=' + rnd(20, 90), duration: D, ease: 'sine.inOut' }, 0)
        .to(p, { rotation: '+=' + rnd(180, 400), duration: D, ease: 'none' }, 0)
        .to(p, { opacity: 0, duration: 0.8 }, D - 0.8);
      gsap.delayedCall(rnd(0.6, 1.4), treePetal);
    })();
  }

  /* ----- Build the dialogue lines (all share one grid cell so the bubble keeps its size) ----- */
  const stack = document.getElementById('speechStack');
  const els = LINES.map(L => {
    const p = document.createElement('p');
    p.className = 'speech-line';
    p.innerHTML = '<span class="typed"></span><span class="rest"></span>';
    p.querySelector('.rest').textContent = L.text;
    stack.appendChild(p);
    return { p, typed: p.querySelector('.typed'), rest: p.querySelector('.rest') };
  });

  /* ----- Pose + idle life ----- */
  gsap.set('#gMan', { opacity: 0, y: 26 });
  gsap.set('#speech', { opacity: 0, y: 14 });
  gsap.set('#gWave',      { svgOrigin: '292 292', rotation: -14 });
  gsap.set('#gFlowerArm', { svgOrigin: '156 274' });
  gsap.set('#gFlower',    { svgOrigin: '114 306' });
  gsap.set(['#gHead', '#gHeadTilt'], { svgOrigin: '200 232' });
  gsap.set('#gEyes',      { svgOrigin: '200 196' });
  gsap.set('#gBrows',     { svgOrigin: '200 184' });
  gsap.set('#gLocks',     { svgOrigin: '200 160' });
  gsap.set('#gTalk',      { svgOrigin: '200 214', opacity: 0, scaleY: 0.3 });
  gsap.set('#gScarfTail', { svgOrigin: '222 254' });

  let wave = null, talk = null;
  if (!reduceMotion) {
    wave = gsap.to('#gWave', { rotation: 16, duration: 0.34, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#gBody',      { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#gHead',      { rotation: 2.5, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#gFlower',    { rotation: 3, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#gScarfTail', { rotation: 6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#gLampGlow',  { opacity: 0.55, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // hair stirs in the breeze, a beat behind the head
    gsap.to('#gLocks',     { rotation: 2.2, x: 0.8, duration: 2.1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    (function blink() {
      gsap.to('#gEyes', { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1, delay: rnd(2.2, 5), onComplete: blink });
    })();
    // eyes drift to the flower, up at the sky, then back to you
    (function glance() {
      const spots = [[0, 0], [-1.6, 0.6], [1.5, -0.8], [0, 0], [0.8, 0.8], [0, 0]];
      const s = spots[Math.floor(rnd(0, spots.length))];
      gsap.to('.gIris', { x: s[0], y: s[1], duration: 0.35, ease: 'power2.out', delay: rnd(1.4, 3.6), onComplete: glance });
    })();
  }

  /* ----- Gestures ----- */
  let offered = false;
  function offerFlower() {
    if (offered) return;
    offered = true;
    // the flower comes toward you
    gsap.to('#gFlowerArm', { scale: 1.2, y: -14, duration: reduceMotion ? 0.01 : 1, ease: 'back.out(1.5)' });
    if (reduceMotion) return;
    const g = document.getElementById('gSparkles');
    for (let i = 0; i < 9; i++) {
      const a = rnd(0, Math.PI * 2), r = rnd(34, 64);
      const sp = mk('path', { d: STAR, fill: '#F2C879' }, g);
      gsap.set(sp, { x: 98 + Math.cos(a) * r, y: 178 + Math.sin(a) * r * 0.9, scale: 0, opacity: 0 });
      gsap.to(sp, { scale: rnd(0.7, 1.3), opacity: 1, rotation: 45, duration: 0.9, ease: 'sine.inOut',
        yoyo: true, repeat: -1, repeatDelay: rnd(0.4, 1.6), delay: 0.6 + rnd(0, 1.2) });
    }
  }
  function applyMood(mood) {
    if (wave) gsap.to(wave, { timeScale: mood === 'wave' ? 1 : mood === 'shy' ? 0.55 : 0.4, duration: 0.6 });
    gsap.to('#gHeadTilt', { rotation: mood === 'shy' ? 6 : 0, duration: 0.8, ease: 'power2.out' });
    gsap.to('#gCheeks',   { opacity: mood === 'shy' ? 1 : 0.55, duration: 0.8 });
    // eyebrows lift when he's hopeful, drop a little when he's shy
    gsap.to('#gBrows',    { y: mood === 'offer' ? -3 : mood === 'shy' ? 1 : 0, rotation: mood === 'shy' ? -2 : 0, duration: 0.6, ease: 'power2.out' });
    if (mood === 'offer') offerFlower();
  }

  /* ----- Typewriter ----- */
  const btn = document.getElementById('speechBtn');
  let idx = -1, typing = null;

  function setMouth(open) {
    if (talk) { talk.kill(); talk = null; }
    gsap.set('#gTalk',  { opacity: open ? 1 : 0, scaleY: 0.3 });
    gsap.set('#gSmile', { opacity: open ? 0 : 1 });
    if (open && !reduceMotion) talk = gsap.to('#gTalk', { scaleY: 1, duration: 0.14, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }
  function paint(i, n) {
    const t = LINES[i].text;
    els[i].typed.textContent = t.slice(0, n);
    els[i].rest.textContent  = t.slice(n);
  }
  function finishLine() {
    if (!typing) return;
    typing.kill(); typing = null;
    paint(idx, LINES[idx].text.length);
    setMouth(false);
  }
  function showLine(i) {
    els.forEach(e => e.p.classList.remove('on'));
    idx = i;
    els[i].p.classList.add('on');
    btn.textContent = i === LINES.length - 1 ? "Let\u2019s go" : 'Continue';
    applyMood(LINES[i].mood);
    paint(i, 0);
    const len = LINES[i].text.length, state = { n: 0 };
    if (reduceMotion) { paint(i, len); return; }
    setMouth(true);
    typing = gsap.to(state, {
      n: len, duration: len * 0.034, ease: 'none',
      onUpdate: () => paint(i, Math.floor(state.n)),
      onComplete: () => { typing = null; paint(i, len); setMouth(false); }
    });
  }

  let leaving = false;
  btn.addEventListener('click', () => {
    if (typing) { finishLine(); return; }
    if (idx < LINES.length - 1) { showLine(idx + 1); return; }
    if (leaving) return;
    leaving = true;
    // He lets the flower go: it floats up and away, and blooms again in the next scene.
    gsap.to('#gFlower',   { y: -70, opacity: 0, duration: reduceMotion ? 0.01 : 1.6, ease: 'power2.in' });
    gsap.to('#gSparkles', { opacity: 0, duration: 0.8 });
    gsap.to('#speech',    { opacity: 0, y: 10, duration: 0.7, ease: 'power1.in' });
    gsap.to('#gHeadTilt', { rotation: 5, duration: 0.8, ease: 'power2.out' });
    gsap.delayedCall(reduceMotion ? 0 : 0.6, () => window.goTo('#part1', '#FFF4EA'));
  });

  /* ----- Entrance ----- */
  const intro = gsap.timeline({ delay: 0.3 });
  intro
    .to('#gMan',    { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' })
    .to('#speech',  { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')
    .call(() => showLine(0));
  if (reduceMotion) intro.timeScale(6);
})();
