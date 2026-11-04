/* SCENE 1: flower bloom, Yes/No buttons (Yes starts the music and goes to Scene 2) */
(function () {
  gsap.registerPlugin(ScrollToPlugin);

  const NS = 'http://www.w3.org/2000/svg';
  const ORIGIN = '200 250'; // base of the bloom: where every petal pivots
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Build the petals ---------- */
  // One teardrop petal, pointing up from the pivot.
  const PETAL_D = 'M200 250 C 158 205, 164 128, 200 92 C 236 128, 242 205, 200 250 Z';

  // [closed angle, open angle]
  const backRing  = [[-14,-78],[-7,-40],[0,0],[7,40],[14,78]];
  const frontRing = [[-9,-58],[-3,-20],[3,20],[9,58]];

  const SMALL_D = 'M200 250 C 178 224, 182 172, 200 142 C 218 172, 222 224, 200 250 Z';
  const BIG_VEINS = ['M200 244 C199 200 200 150 200 104', 'M200 236 C188 208 184 164 195 124', 'M200 236 C212 208 216 164 205 124'];
  const SMALL_VEINS = ['M200 244 C199 208 200 178 200 150'];

  function makePetals(parent, ring, fill, cls, d = PETAL_D, veins = BIG_VEINS) {
    return ring.map(([closed, open]) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'petal ' + cls);
      const add = (a) => { const e = document.createElementNS(NS, 'path'); for (const k in a) e.setAttribute(k, a[k]); g.appendChild(e); };
      add({ d, fill, stroke: '#EBD3CF', 'stroke-width': 1 });
      add({ d, fill: 'url(#tipBlush)' });
      veins.forEach(v => add({ d: v, fill: 'none', stroke: '#E4CAC6', 'stroke-width': 0.7, 'stroke-linecap': 'round', opacity: 0.8 }));
      parent.appendChild(g);
      gsap.set(g, { svgOrigin: ORIGIN, rotation: closed, scaleX: 0.62, scaleY: 0.78, opacity: 1 });
      return { el: g, closed, open };
    });
  }

  const back  = makePetals(document.getElementById('petalsBack'),  backRing,  'url(#petalFill)',      'back');
  const front = makePetals(document.getElementById('petalsFront'), frontRing, 'url(#petalFillFront)', 'front');

  const inner = makePetals(document.getElementById('petalsInner'),
    [[-6,-34],[-2,-12],[2,12],[6,34]], 'url(#petalInner)', 'inner', SMALL_D, SMALL_VEINS);
  gsap.set('.sepal', { svgOrigin: ORIGIN, scale: 0 });

  // Tiny stamens in the centre
  const stamens = document.getElementById('stamens');
  [-26,-14,0,14,26].forEach(a => {
    const rad = (a - 90) * Math.PI / 180;
    const len = 34 + Math.abs(a) * -0.2;
    const x2 = 200 + Math.cos(rad) * len, y2 = 236 + Math.sin(rad) * len;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', 200); l.setAttribute('y1', 236);
    l.setAttribute('x2', x2);  l.setAttribute('y2', y2);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', x2); dot.setAttribute('cy', y2); dot.setAttribute('r', 2.6);
    dot.setAttribute('fill', '#E3C58A'); dot.setAttribute('stroke', 'none');
    stamens.appendChild(l); stamens.appendChild(dot);
  });
  gsap.set('#heart', { svgOrigin: '200 236', scale: 0, opacity: 0 });

  // Stem and leaves start folded
  const stemEl = document.getElementById('stem');
  const stemLen = stemEl.getTotalLength();
  gsap.set(stemEl, { strokeDasharray: stemLen, strokeDashoffset: stemLen });
  gsap.set('.leaf', { svgOrigin: '200 330', scale: 0, opacity: 0 });
  gsap.set('#flower', { y: 14 });

  /* ---------- Backdrop: halo dots, sprigs, bokeh, drifting petals ---------- */
  const rnd = gsap.utils.random;
  const mkSvg = (tag, a, parent) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); parent.appendChild(e); return e; };

  const hd = document.getElementById('haloDots');
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2;
    mkSvg('circle', { cx: 200 + Math.cos(a) * 172, cy: 200 + Math.sin(a) * 172, r: i % 6 === 0 ? 2.6 : 1.2 }, hd);
  }
  gsap.to('#halo', { opacity: 1, duration: 3, delay: 1.2, ease: 'power1.inOut' });
  if (!reduceMotion) gsap.to('#halo', { rotation: 360, duration: 140, ease: 'none', repeat: -1 });

  document.querySelectorAll('.sprig').forEach(svg => {
    const P = [[2,2],[60,40],[110,90],[190,190]];
    const B = t => { const u = 1 - t, c = [u*u*u, 3*u*u*t, 3*u*t*t, t*t*t];
      return [0, 1].map(k => c.reduce((a, w, n) => a + w * P[n][k], 0)); };
    mkSvg('path', { d: 'M2 2 C60 40 110 90 190 190', fill: 'none', stroke: '#B98A92', 'stroke-width': 1.3 }, svg);
    for (let t = 0.1; t < 0.95; t += 0.1) {
      const [x, y] = B(t), [x2, y2] = B(t + 0.01);
      const ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
      [-40, 40].forEach(o => mkSvg('ellipse', { cx: x + 9, cy: y, rx: 9, ry: 3.6, fill: '#C9A3AA', 'fill-opacity': 0.6,
        transform: `rotate(${ang + o} ${x} ${y})` }, svg));
    }
    [0.97, 0.78, 0.55].forEach(t => { const [x, y] = B(t); mkSvg('circle', { cx: x + 3, cy: y - 5, r: 2.4, fill: '#E3B7BF' }, svg); });
  });

  const bk = document.getElementById('bokeh');
  const tints = ['rgba(255,200,212,.35)', 'rgba(214,196,242,.32)', 'rgba(246,225,182,.38)'];
  for (let i = 0; i < 9; i++) {
    const d = document.createElement('div'), sz = rnd(40, 130);
    d.className = 'bokeh';
    d.style.cssText = `left:${rnd(0, 95)}%;top:${rnd(0, 92)}%;width:${sz}px;height:${sz}px;background:${tints[i % 3]}`;
    bk.appendChild(d);
    if (!reduceMotion) {
      gsap.to(d, { x: rnd(-30, 30), y: rnd(-40, 40), duration: rnd(7, 12), ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(d, { opacity: rnd(0.35, 0.7), duration: rnd(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }
  if (!reduceMotion) {
    const fall = document.getElementById('fall');
    for (let i = 0; i < 9; i++) {
      const el = document.createElement('div');
      el.className = 'fall-petal';
      el.style.left = rnd(2, 96) + '%';
      fall.appendChild(el);
      const D = rnd(14, 22);
      gsap.set(el, { rotation: rnd(0, 360), scale: rnd(0.7, 1.3) });
      gsap.to(el, { y: () => window.innerHeight * 1.1, rotation: '+=' + rnd(240, 540), duration: D, ease: 'none', repeat: -1, delay: 4 + i * 1.6 });
      gsap.to(el, { x: rnd(40, 90) * (i % 2 ? 1 : -1), duration: D / 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }

  function startSparkles() {
    if (reduceMotion) return;
    const g = document.getElementById('sparkles');
    for (let i = 0; i < 8; i++) {
      const a = rnd(0, Math.PI * 2), r = rnd(135, 185);
      const sp = mkSvg('path', { d: 'M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z', fill: '#F6E1B6' }, g);
      gsap.set(sp, { x: 200 + Math.cos(a) * r, y: 170 + Math.sin(a) * r * 0.85, scale: 0, opacity: 0 });
      gsap.to(sp, { scale: rnd(0.8, 1.3), opacity: 1, rotation: 45, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: rnd(1, 3), delay: rnd(0, 3) });
    }
  }

  /* ---------- Extra life: pollen, light rays, butterflies ---------- */
  function startPollen() {
    if (reduceMotion) { gsap.to('#rays', { opacity: 0.6, duration: 1 }); return; }
    gsap.to('#rays', { opacity: 0.75, duration: 3, ease: 'sine.inOut' });
    gsap.to('#rays', { rotation: 360, duration: 220, ease: 'none', repeat: -1 });
    const pg = document.getElementById('pollen');
    for (let i = 0; i < 14; i++) {
      const m = mkSvg('circle', { r: rnd(0.9, 1.8), fill: '#F2D9A8' }, pg);
      gsap.set(m, { x: 200 + rnd(-16, 16), y: 228, opacity: 0 });
      gsap.timeline({ repeat: -1, delay: rnd(0, 6), repeatDelay: rnd(0.5, 2) })
        .to(m, { y: '-=' + rnd(90, 160), x: '+=' + rnd(-50, 50), duration: rnd(4, 7), ease: 'sine.out' }, 0)
        .to(m, { opacity: 0.9, duration: 1, ease: 'power1.out' }, 0)
        .to(m, { opacity: 0, duration: 2, ease: 'power1.in' }, '>-1.2');
    }
    // two butterflies visit the flower
    const fxs = document.getElementById('p1fx');
    const cx = fxs.clientWidth / 2, cy = fxs.clientHeight * 0.36;
    [['#F4B6C6', '#D58FA3', 1.5, -1], ['#C9B8F0', '#9C86CE', 1.2, 1]].forEach(([fill, stroke, sc, dir]) => {
      const b = mkSvg('g', {}, fxs);
      const wl = mkSvg('g', { class: 'wing-l' }, b), wr = mkSvg('g', { class: 'wing-r' }, b);
      mkSvg('path', { d: 'M0 0 C-6 -10 -16 -9 -14 0 C-13 7 -5 7 0 0Z', fill, stroke, 'stroke-width': 0.7 }, wl);
      mkSvg('path', { d: 'M0 0 C6 -10 16 -9 14 0 C13 7 5 7 0 0Z', fill, stroke, 'stroke-width': 0.7 }, wr);
      mkSvg('ellipse', { rx: 1.1, ry: 4.4, cy: 1, fill: '#6A4A5A' }, b);
      gsap.set(b, { scale: sc, x: cx + dir * 220, y: cy - 60, opacity: 0 });
      gsap.to(b, { opacity: 1, duration: 1.5 });
      (function fly() { gsap.to(b, { x: cx + rnd(-210, 210), y: cy + rnd(-150, 120), duration: rnd(3, 5), ease: 'sine.inOut', onComplete: fly }); })();
    });
  }

  /* ---------- Bloom timeline ---------- */
  const bloom = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

  bloom
    .to(stemEl, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' })
    .to('.leaf', { scale: 1, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'back.out(1.6)' }, '-=0.6')
    .to('#flower', { y: 0, duration: 1.4, ease: 'sine.out' }, 0.5)
    .to('.sepal', { scale: 1, duration: 0.9, stagger: 0.1, ease: 'back.out(1.6)' }, 1.6)
    .to('#glow', { opacity: 1, duration: 2.6, ease: 'sine.inOut' }, '-=0.2')
    // outer ring first
    .to(back.map(p => p.el), {
      rotation: (i) => back[i].open,
      scaleX: 1, scaleY: 1,
      duration: 2.4, ease: 'power3.inOut',
      stagger: { each: 0.12, from: 'center' }
    }, '-=0.3')
    // then the inner ring, slightly behind
    .to(front.map(p => p.el), {
      rotation: (i) => front[i].open,
      scaleX: 0.92, scaleY: 0.9,
      duration: 2.2, ease: 'power3.inOut',
      stagger: { each: 0.1, from: 'center' }
    }, '-=1.9')
    .to(inner.map(p => p.el), {
      rotation: (i) => inner[i].open, scaleX: 0.95, scaleY: 0.9,
      duration: 2, ease: 'power3.inOut', stagger: { each: 0.09, from: 'center' }
    }, '-=1.7')
    .to('#heart', { scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(2)' }, '-=1.0')
    // question, then buttons
    .fromTo('#question', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, '-=0.4')
    .fromTo('#buttons',  { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, '-=0.6')
    .to('#dew', { opacity: 1, duration: 1.4 }, '-=0.8')
    .add(startIdle)
    .add(startSparkles)
    .add(startPollen);

  if (reduceMotion) bloom.timeScale(6);

  // The flower now comes second in the story, so it blooms when you arrive at it.
  let bloomStarted = false;
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting || bloomStarted) return;
    bloomStarted = true; obs.disconnect();
    gsap.delayedCall(0.4, () => bloom.play());
  }, { threshold: 0.45 }).observe(document.getElementById('part1'));

  // A slow breath once the flower is open
  function startIdle() {
    if (reduceMotion) return;
    gsap.to('#flower', { y: -6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.petal.front', { rotation: '+=2.5', duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1,
      stagger: { each: 0.25, from: 'center' } });
    gsap.to('#glow', { opacity: 0.75, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  /* ---------- "No" button: dodges the cursor ---------- */
  const noBtn  = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  let dodges = 0;
  let dodging = false;

  function dodge(e) {
    if (dodging) return;
    dodging = true;
    if (e && e.type === 'pointerdown') e.preventDefault();

    const rect = noBtn.getBoundingClientRect();
    const pad = 16;
    const curX = gsap.getProperty(noBtn, 'x');
    const curY = gsap.getProperty(noBtn, 'y');

    // Pick a new spot, at least ~140px away from the current one, kept on screen.
    let dx, dy, tries = 0;
    do {
      const minX = pad - rect.left + curX;
      const maxX = window.innerWidth  - pad - rect.right + curX;
      const minY = pad - rect.top + curY;
      const maxY = window.innerHeight - pad - rect.bottom + curY;
      dx = gsap.utils.random(minX, maxX);
      dy = gsap.utils.random(minY, maxY);
      tries++;
    } while (Math.hypot(dx - curX, dy - curY) < 140 && tries < 12);

    gsap.to(noBtn, {
      x: dx, y: dy,
      rotation: gsap.utils.random(-12, 12),
      duration: 0.55, ease: 'back.out(1.7)',
      onComplete: () => { dodging = false; }
    });

    // The more it runs away, the more inviting "Yes" becomes.
    dodges++;
    gsap.to(yesBtn, { scale: Math.min(1 + dodges * 0.06, 1.35), duration: 0.5, ease: 'back.out(2)' });
  }

  noBtn.addEventListener('pointerenter', dodge);
  noBtn.addEventListener('pointerdown', dodge);   // touch screens
  noBtn.addEventListener('focus', () => {          // keyboard users get a gentle shake instead
    gsap.fromTo(noBtn, { x: '-=6' }, { x: '+=0', duration: 0.6, ease: 'elastic.out(1.2, 0.25)' });
  });
  noBtn.addEventListener('click', (e) => e.preventDefault());

  /* ---------- "Yes" button: music + glide into the night ---------- */
  const audio = document.getElementById('bgm');
  let answered = false;

  yesBtn.addEventListener('click', () => {
    if (answered) return;
    answered = true;

    // 1) Play music immediately, inside the click so browsers allow it.
    audio.volume = 0;
    const playing = audio.play();
    if (playing && typeof playing.then === 'function') {
      playing.then(() => {
        gsap.to(audio, { volume: 0.85, duration: 2.5, ease: 'none' });
      }).catch(() => {
        console.warn('Audio could not play. Check that audio.mp3 exists next to this file.');
      });
    }

    // 2) Tiny confirmation, a burst of petals, then the dissolve into the night.
    const fxs = document.getElementById('p1fx');
    if (!reduceMotion) {
      const r = yesBtn.getBoundingClientRect(), s = fxs.getBoundingClientRect();
      for (let i = 0; i < 18; i++) {
        const p = mkSvg('ellipse', { rx: rnd(3, 5), ry: rnd(1.8, 2.8), fill: i % 3 ? '#F4B6C6' : '#FFFFFF' }, fxs);
        gsap.set(p, { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, rotation: rnd(0, 180) });
        gsap.timeline({ onComplete: () => p.remove() })
          .to(p, { x: '+=' + rnd(-160, 160), y: '+=' + rnd(-190, -40), duration: rnd(1.1, 1.8), ease: 'power2.out' }, 0)
          .to(p, { y: '+=' + rnd(60, 140), duration: 1.2, ease: 'sine.in' }, 1.0)
          .to(p, { rotation: '+=' + rnd(200, 420), duration: 2.4, ease: 'none' }, 0)
          .to(p, { opacity: 0, duration: 0.8 }, 1.6);
      }
    }
    gsap.timeline()
      .to(yesBtn, { scale: 1.12, duration: 0.18, ease: 'power2.out' })
      .to(yesBtn, { scale: 1, duration: 0.3, ease: 'back.out(3)' })
      .call(() => window.goTo('#part2', '#0C0E2B'), null, '+=0.35');
  });
})();
