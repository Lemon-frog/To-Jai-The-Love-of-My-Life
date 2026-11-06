/* SCENE 2: serenade animation, strumming, fireflies, and the LRC lyrics (LRC const) */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Waltz tempo (3/4). Change BPM to taste: lower = slower, dreamier. ----- */
  const BPM  = 66;
  const BEAT = 60 / BPM;          // seconds per beat (~0.91s)

  /* ----- Stars ----- */
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 110; i++) {
    const s = document.createElement('span');
    const r = Math.random();
    const size = r < 0.1 ? 3 : (r < 0.5 ? 2 : 1.5);
    s.className = 'star' + (size === 3 ? ' star-lg' : '');
    s.style.cssText =
      `left:${Math.random() * 100}%;top:${Math.random() * 74}%;width:${size}px;height:${size}px;` +
      `--t:${2.4 + Math.random() * 4}s;--d:${-Math.random() * 6}s;--o:${0.55 + Math.random() * 0.45}`;
    starsEl.appendChild(s);
  }

  /* ----- Balcony balusters ----- */
  const rail = document.getElementById('rail');
  for (let x = 362; x < 486; x += 12) {
    const b = document.createElementNS(NS, 'rect');
    b.setAttribute('x', x); b.setAttribute('y', 239);
    b.setAttribute('width', 2.5); b.setAttribute('height', 23);
    rail.appendChild(b);
  }

  /* ----- Initial hidden state (revealed when the section scrolls into view) ----- */
  gsap.set(['#stars', '#moon', '#scene', '#nextWrap'], { opacity: 0 });
  gsap.set('#forearm', { svgOrigin: '220 370', rotation: -6 });
  gsap.set('#manHead', { svgOrigin: '217 332' });
  gsap.set('#womanHead', { svgOrigin: '414 192' });
  gsap.set('#womanHair', { svgOrigin: '418 170' });
  gsap.set('#womanWisp', { svgOrigin: '358.6 250' });
  gsap.set('#manWisp',   { svgOrigin: '236 249' });
  gsap.set('#womanEye',  { svgOrigin: '341.2 260.6' });
  gsap.set('#manEye',    { svgOrigin: '260.5 258.5' });

  /* ----- Slow idle life: a three-beat sway, a breath of hair, warm light ----- */
  if (!reduceMotion) {
    gsap.to('#manHead',   { rotation: 3,  duration: BEAT * 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#womanHead', { rotation: -3, duration: BEAT * 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#womanHair', { rotation: 2.5, duration: BEAT * 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#womanWisp', { rotation: 7, duration: BEAT * 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#manWisp',   { rotation: -6, duration: BEAT * 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#doorGlow',  { opacity: 0.7, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.next-arrow', { y: 5, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // both of them blink, out of sync
    (function blinkW() { gsap.to('#womanEye', { scaleY: 0.1, duration: 0.09, yoyo: true, repeat: 1, delay: 2.4 + Math.random() * 3.6, onComplete: blinkW }); })();
    (function blinkM() { gsap.to('#manEye',   { scaleY: 0.1, duration: 0.09, yoyo: true, repeat: 1, delay: 3 + Math.random() * 3.6,   onComplete: blinkM }); })();
  }

  /* ----- Floating notes ----- */
  const notesG = document.getElementById('notes');
  const glyphs = ['\u266A', '\u266B', '\u2669', '\u266C'];

  function spawnNote() {
    if (reduceMotion) return;
    const t = document.createElementNS(NS, 'text');
    t.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    t.setAttribute('font-size', gsap.utils.random(18, 30));
    t.setAttribute('fill', '#F8E6B8');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-family', "'Segoe UI Symbol','Noto Sans Symbols 2',Georgia,serif");
    notesG.appendChild(t);

    // From the guitar's sound hole, drifting up toward the balcony
    const x0 = gsap.utils.random(246, 268), y0 = 372;
    const x1 = gsap.utils.random(372, 430),  y1 = gsap.utils.random(215, 250);
    const D  = gsap.utils.random(4.2, 5.4);

    gsap.set(t, { x: x0, y: y0, opacity: 0, scale: 0.6 });
    gsap.timeline({ onComplete: () => t.remove() })
      .to(t, { x: x1, duration: D, ease: 'sine.inOut' }, 0)
      .to(t, { y: y1, duration: D, ease: 'power1.out' }, 0)
      .to(t, { rotation: gsap.utils.random(-25, 25), scale: 1.1, duration: D, ease: 'none' }, 0)
      .to(t, { xPercent: gsap.utils.random(-90, 90), duration: D / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
      .to(t, { opacity: 0.95, duration: 0.7, ease: 'power1.out' }, 0)
      .to(t, { opacity: 0, duration: D * 0.5, ease: 'power1.in' }, D * 0.5);
  }

  /* ----- Strumming: one 3/4 measure at a time, slightly different every time ----- */
  // Boom (strong down) - chick (soft) - chick (soft): the classic waltz feel.
  const pattern = [
    { down: 22, up: -16, note: 1.0 },
    { down: 14, up: -12, note: 0.0 },
    { down: 17, up: -10, note: 0.5 }
  ];
  let running = false;
  let current = null;

  function strumMeasure() {
    if (!running) return;
    const jit = () => Math.random() - 0.5;
    const tl = gsap.timeline({ onComplete: strumMeasure });

    pattern.forEach((b, i) => {
      const t = Math.max(0, i * BEAT + jit() * 0.05);   // human timing drift
      tl.to('#forearm', { rotation: b.down + jit() * 4, duration: BEAT * 0.30, ease: 'power2.out' }, t)
        .to('#forearm', { rotation: b.up + jit() * 4,   duration: BEAT * 0.62, ease: 'sine.inOut' }, t + BEAT * 0.30);
      if (Math.random() < b.note) tl.call(spawnNote, null, t + BEAT * 0.12);
      if (i === 0 && Math.random() < 0.35) tl.call(spawnPetal, null, t + BEAT * 0.5);
      if (i === 0) tl.to('#foot', { rotation: -9, duration: 0.1, ease: 'sine.inOut', yoyo: true, repeat: 1 }, t + BEAT * 0.05);
    });

    tl.to({}, { duration: 0 }, 3 * BEAT);                // lock the measure length to exactly 3 beats
    current = tl;
  }

  function begin() {
    if (running) return;
    running = true;
    strumMeasure();
    scheduleShoot();
  }

  /* ----- Entrance: night falls once, then the song begins ----- */
  let introPlayed = false, ready = false, inView = false;

  const intro = gsap.timeline({
    paused: true,
    onComplete: () => { ready = true; if (inView) begin(); }
  });
  intro
    .to('#stars', { opacity: 1, duration: 2.4, ease: 'power1.inOut' }, 0)
    .fromTo('#moon', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 2.6, ease: 'power2.out' }, 0.2)
    .to('#scene', { opacity: 1, duration: 1.4, ease: 'power1.out' }, 0.3)
    .fromTo(['#woman', '#man'], { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 1.3, stagger: 0.4, ease: 'power2.out' }, 1.0)
    .to('#nextWrap', { opacity: 1, duration: 1.2, ease: 'power1.out' }, '-=0.4');

  if (reduceMotion) intro.timeScale(6);

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) {
      if (!introPlayed) { introPlayed = true; intro.play(); }
      else if (ready) begin();
    } else {
      running = false;                 // pause the strumming off-screen
      if (current) current.kill();
      if (shootCall) shootCall.kill();
    }
  }, { threshold: 0.35 }).observe(document.getElementById('part2'));

  /* ----- Extra scene detail ----- */
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e); return e;
  };
  const rnd = gsap.utils.random;

  // picket fence + grass tufts
  const fence = document.getElementById('fence');
  for (let x = 4; x < 182; x += 14) mk('path', { d: `M${x} 440V422L${x + 2.5} 418L${x + 5} 422V440Z` }, fence);
  mk('rect', { x: 0, y: 427, width: 186, height: 2.5 }, fence);
  mk('rect', { x: 0, y: 434, width: 186, height: 2.5 }, fence);
  const grass = document.getElementById('grass');
  for (let i = 0; i < 46; i++) {
    const x = Math.random() * 800;
    mk('path', { d: `M${x} 441q-2 -8 -4 -11M${x} 441q0 -10 1 -14M${x} 441q2 -8 5 -10`, fill: 'none',
      stroke: Math.random() < 0.5 ? '#2B366E' : '#223060', 'stroke-width': 1.2, 'stroke-linecap': 'round' }, grass);
  }

  // wildflowers in the grass
  const wf = ['#F4C7D4', '#FFFFFF', '#F6E1B6', '#B9AEF0'];
  for (let i = 0; i < 22; i++) {
    const x = rnd(240, 345), h = rnd(8, 15);
    mk('path', { d: `M${x} 441 q1 -${h / 2} 0 -${h}`, fill: 'none', stroke: '#2B366E', 'stroke-width': 1.2 }, grass);
    mk('circle', { cx: x, cy: 441 - h, r: rnd(1.6, 2.6), fill: wf[i % 4], opacity: 0.9 }, grass);
  }

  // string lights from the lamp to the balcony
  const lg = document.getElementById('lampGarland');
  mk('path', { d: 'M176 328 Q 270 372 358 281', fill: 'none', stroke: '#4A4290', 'stroke-width': 1 }, lg);
  const lgBulbs = [];
  for (let i = 1; i < 9; i++) {
    const t = i / 9, u = 1 - t;
    const x = u * u * 176 + 2 * u * t * 270 + t * t * 358, y = u * u * 328 + 2 * u * t * 372 + t * t * 281;
    const g = mk('g', {}, lg);
    mk('circle', { cx: x, cy: y + 3, r: 6, fill: '#FFE3A0', opacity: 0.25 }, g);
    mk('circle', { cx: x, cy: y + 3, r: 2.2, fill: '#FFF0C2' }, g);
    lgBulbs.push(g);
  }
  if (!reduceMotion) {
    gsap.to(lgBulbs, { opacity: 0.4, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.2, from: 'random' } });
    gsap.set('#chime', { svgOrigin: '559 166' });
    gsap.to('#chime', { rotation: 5, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // fairy lights along the balcony
  const lights = document.getElementById('lights');
  const bulbs = [];
  for (let i = 0; i <= 9; i++) {
    const t = i / 9, g = mk('g', {}, lights);
    const x = 358 + 120 * t, y = 283 + 46 * t * (1 - t);
    mk('circle', { cx: x, cy: y + 3, r: 6, fill: '#FFE3A0', opacity: 0.25 }, g);
    mk('circle', { cx: x, cy: y + 3, r: 2.4, fill: '#FFF0C2' }, g);
    bulbs.push(g);
  }

  // fireflies
  const ff = document.getElementById('fireflies');
  function wander(g) {
    gsap.to(g, { x: '+=' + rnd(-45, 45), y: '+=' + rnd(-28, 28), duration: rnd(3, 6), ease: 'sine.inOut', onComplete: () => wander(g) });
  }
  for (let i = 0; i < 12; i++) {
    const g = mk('g', {}, ff);
    mk('circle', { r: 5, fill: '#FFF0A8', opacity: 0.22 }, g);
    mk('circle', { r: 1.8, fill: '#FFF6C8' }, g);
    gsap.set(g, { x: rnd(40, 470), y: rnd(330, 428), opacity: 0.2 });
    if (!reduceMotion) {
      wander(g);
      gsap.to(g, { opacity: 1, duration: rnd(1, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: rnd(0, 2) });
    }
  }

  if (!reduceMotion) {
    gsap.to(bulbs, { opacity: 0.4, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.18, from: 'random' } });
    gsap.set('#scarfTail', { svgOrigin: '207 337' });
    gsap.to('#scarfTail', { rotation: 7, duration: BEAT * 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.set('#curtain', { svgOrigin: '492 234' });
    gsap.to('#curtain', { scaleX: 1.35, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // chimney smoke
    gsap.set('.puff', { svgOrigin: '714 68', opacity: 0 });
    gsap.fromTo('.puff', { y: 0, x: 0, scale: 0.6, opacity: 0.4 },
      { y: -55, x: 16, scale: 1.8, opacity: 0, duration: 6, ease: 'power1.out', repeat: -1, stagger: 2 });
  }

  // lamp moths, cat, owl, fog, lantern, skirt, foot
  gsap.set('#foot', { svgOrigin: '218 441' });
  const moths = document.getElementById('moths');
  function orbit(g) { gsap.to(g, { x: 176 + rnd(-26, 26), y: 336 + rnd(-20, 20), duration: rnd(0.8, 1.7), ease: 'sine.inOut', onComplete: () => orbit(g) }); }
  for (let i = 0; i < 3; i++) {
    const g = mk('g', {}, moths);
    const w = mk('ellipse', { rx: 3, ry: 1.3 }, g);
    gsap.set(g, { x: 176, y: 338 });
    if (!reduceMotion) { orbit(g); gsap.to(w, { scaleY: 0.3, duration: 0.07, yoyo: true, repeat: -1 }); }
  }
  if (!reduceMotion) {
    gsap.set('#catTail', { svgOrigin: '94 414' });
    gsap.to('#catTail', { rotation: 14, duration: BEAT * 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.set('#owlEyes', { svgOrigin: '80 339' });
    (function blink() {
      gsap.to('#owlEyes', { scaleY: 0.08, duration: 0.1, yoyo: true, repeat: 1, delay: rnd(2.5, 6), onComplete: blink });
    })();
    gsap.to('.fog', { x: '+=40', duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 3 });
    gsap.to('#lanternGlow', { opacity: 0.55, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.set('#skirt', { svgOrigin: '419 198' });
    gsap.to('#skirt', { skewX: 1.6, duration: BEAT * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // rose petals she lets fall to him
  function spawnPetal() {
    if (reduceMotion) return;
    const p = mk('ellipse', { rx: 4.2, ry: 2.5, fill: '#EFA9BB' }, document.getElementById('petals'));
    const D = rnd(5, 7);
    gsap.set(p, { x: 388, y: 236, rotation: rnd(0, 180) });
    gsap.timeline({ onComplete: () => p.remove() })
      .to(p, { y: 434, duration: D, ease: 'power1.in' }, 0)
      .to(p, { x: '-=' + rnd(110, 190), duration: D, ease: 'sine.inOut' }, 0)
      .to(p, { rotation: '+=' + rnd(200, 420), duration: D, ease: 'none' }, 0)
      .to(p, { scaleX: 0.4, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: Math.floor(D / 0.6) }, 0)
      .to(p, { opacity: 0, duration: 0.8 }, D - 0.8);
  }

  // occasional shooting star
  let shootCall = null;
  function scheduleShoot() {
    if (reduceMotion) return;
    shootCall = gsap.delayedCall(rnd(9, 18), () => { shoot(); scheduleShoot(); });
  }
  function shoot() {
    const el = document.createElement('div');
    el.className = 'shoot';
    el.style.top = rnd(4, 26) + '%';
    el.style.left = rnd(55, 92) + '%';
    document.getElementById('part2').appendChild(el);
    gsap.set(el, { rotation: -25 });
    gsap.timeline({ onComplete: () => el.remove() })
      .fromTo(el, { x: 0, y: 0 }, { x: -300, y: 140, duration: 1.1, ease: 'power1.in' }, 0)
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
      .to(el, { opacity: 0, duration: 0.5 }, 0.6);
  }

  /* ----- Lyrics synced to the song -----
     Paste your own lyrics below in LRC format: [minutes:seconds.hundredths] line.
     The lines here are only placeholders: swap in lyrics you have the rights to use.
     A line with no text (e.g. "[01:10.00]") clears the screen for an instrumental part.
     LYRIC_OFFSET nudges everything earlier (+) or later (-), in seconds. */
  const LYRIC_OFFSET = 0;
  const LRC = `
[00:06.00] I Love You Too Much
[00:10.00] To live without you loving me back
[00:13.00] I Love You Too Much
[00:17.00] Heaven's my witness and this is a fact
[00:20.00] I know I belong
[00:24.00] When I sing this song
[00:27.00] There's love above love and it's ours
[00:30.00] 'Cause I love you too much
[00:34.00] I live for your touch
[00:38.00] I whisper your name night after night
[00:41.00] I Love You Too Much
[00:45.00] There's only one feeling and i know it's right
[00:48.00] I know I belong
[00:52.00] When I sing this song 
[00:55.00] There's love above love and it's ours
[00:58.00] 'Cause I love you too much
[01:03.00] Heaven knows your name I've been praying
[01:09.00] To have you come here by my side
[01:17.00] Without you a part of me's missing 
[01:23.00] Just to make you my home, I will fight
[01:30.00]
[01:44.00] I know I belong
[01:47.00] When I sing this song
[01:51.00] There's love above love and it's ours
[01:53.00] 'Cause I love you too much
[01:58.00] I Love You Too Much
[02:03.00]
[02:05.00] I Love You Too Much
[02:08.00] Heaven's my witness and this is a fact
[02:12.00] You live in my soul
[02:15.00] Your heart is my goal
[02:18.00] There's love above love and it's mine 'cause I love you
[02:22.00] There's love above love and it's yours 'cause I love you
[02:25.00] There's love above love and it's ours
[02:28.00] If you love me as much
`;
  const LYRICS = LRC.trim().split('\n').map(l => {
    const m = l.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
    return m ? { t: +m[1] * 60 + parseFloat(m[2]), text: m[3].trim() } : null;
  }).filter(Boolean).sort((a, b) => a.t - b.t);

  const lyricEl = document.getElementById('lyric');
  const bgm = document.getElementById('bgm');
  let shownLyric = null;

  function showLyric(text) {
    if (text === shownLyric) return;
    shownLyric = text;
    gsap.killTweensOf(lyricEl);
    gsap.to(lyricEl, {
      opacity: 0, y: -6, duration: 0.35, ease: 'power1.in',
      onComplete: () => {
        lyricEl.textContent = text;
        if (text) gsap.fromTo(lyricEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
      }
    });
  }
  bgm.addEventListener('timeupdate', () => {
    if (bgm.paused) return;
    const now = bgm.currentTime + LYRIC_OFFSET;
    let line = null;
    for (const L of LYRICS) { if (L.t <= now) line = L; else break; }
    showLyric(line ? line.text : '');
  });
  bgm.addEventListener('pause', () => showLyric(''));

  /* ----- Next button -> Part 3 ----- */
  document.getElementById('nextBtn').addEventListener('click', () => {
    window.goTo('#part3', '#0C0E2B');
  });
})();
