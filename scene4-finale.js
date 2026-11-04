/* SCENE 4: thank-you finale, "Pwede ba kitang isayaw?" Yes/No */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = gsap.utils.random;
  const STAR = 'M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z';

  /* "Next" at the end of the poems */
  document.getElementById('nextBtn3').addEventListener('click', () => {
    window.goTo('#part4', '#0C0E2B');
  });

  /* Stars, warm bokeh, fireflies, a few drifting petals */
  const st = document.getElementById('stars4');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('span'), size = Math.random() < 0.5 ? 1.5 : 2;
    s.className = 'star';
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 70}%;width:${size}px;height:${size}px;` +
      `--t:${3 + Math.random() * 5}s;--d:${-Math.random() * 6}s;--o:${0.4 + Math.random() * 0.5}`;
    st.appendChild(s);
  }
  const bk = document.getElementById('bokeh4');
  const tints = ['rgba(255,214,170,.22)', 'rgba(255,190,210,.2)', 'rgba(190,170,255,.2)'];
  for (let i = 0; i < 8; i++) {
    const d = document.createElement('div'), sz = rnd(50, 140);
    d.className = 'bokeh';
    d.style.cssText = `left:${rnd(0, 92)}%;top:${rnd(5, 85)}%;width:${sz}px;height:${sz}px;background:${tints[i % 3]}`;
    bk.appendChild(d);
    if (!reduceMotion) {
      gsap.to(d, { x: rnd(-30, 30), y: rnd(-40, 40), duration: rnd(7, 12), ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to(d, { opacity: rnd(0.3, 0.7), duration: rnd(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }
  if (!reduceMotion) {
    const flies = document.getElementById('flies4');
    for (let i = 0; i < 14; i++) {
      const f = document.createElement('span');
      f.className = 'firefly';
      f.style.cssText = `left:${rnd(4, 94)}%;top:${rnd(20, 90)}%`;
      flies.appendChild(f);
      (function wander() { gsap.to(f, { x: '+=' + rnd(-60, 60), y: '+=' + rnd(-40, 40), duration: rnd(3, 6), ease: 'sine.inOut', onComplete: wander }); })();
      gsap.fromTo(f, { opacity: 0.15 }, { opacity: 1, duration: rnd(1, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: rnd(0, 2) });
    }
    const fall = document.getElementById('fall4');
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.className = 'fall-petal';
      el.style.left = rnd(2, 96) + '%';
      fall.appendChild(el);
      const D = rnd(14, 22);
      gsap.set(el, { rotation: rnd(0, 360), scale: rnd(0.7, 1.3) });
      gsap.to(el, { y: () => window.innerHeight * 1.1, rotation: '+=' + rnd(240, 540), duration: D, ease: 'none', repeat: -1, delay: i * 1.8 });
      gsap.to(el, { x: rnd(40, 90) * (i % 2 ? 1 : -1), duration: D / 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }

  /* Paper lanterns drifting up behind her */
  const lant = document.getElementById('lant4');
  if (lant && !reduceMotion) {
    for (let i = 0; i < 9; i++) {
      const l = document.createElement('div');
      l.className = 'sky-lantern';
      l.style.left = rnd(3, 95) + '%';
      l.style.transform = 'scale(' + rnd(0.7, 1.4) + ')';
      lant.appendChild(l);
      gsap.fromTo(l, { y: 30 }, { y: () => -(lant.offsetHeight + 90), duration: rnd(32, 52), ease: 'none', repeat: -1, delay: -rnd(0, 50) });
      gsap.to(l, { x: rnd(-30, 30), duration: rnd(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }

  /* Sparkles around her flower */
  if (!reduceMotion) {
    const g = document.getElementById('fSparkles');
    for (let i = 0; i < 9; i++) {
      const a = rnd(0, Math.PI * 2), r = rnd(50, 95);
      const sp = document.createElementNS(NS, 'path');
      sp.setAttribute('d', STAR); sp.setAttribute('fill', '#FFE9AE');
      g.appendChild(sp);
      gsap.set(sp, { x: 430 + Math.cos(a) * r, y: 262 + Math.sin(a) * r * 0.9, scale: 0, opacity: 0 });
      gsap.to(sp, { scale: rnd(0.8, 1.4), opacity: 1, rotation: 45, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: rnd(1, 3), delay: rnd(0, 3) });
    }
  }

  /* Idle life: she breathes and tilts her head, her hair and wisps drift, her eyes blink and shine,
     the flower sways, and you give her hand a gentle squeeze */
  const fWoman = document.getElementById('fWoman');
  const fHisHand = document.getElementById('fHisHand');
  const herHand = fHisHand.querySelector(':scope > g[transform="translate(131 506) rotate(184) scale(.92)"]');
  const hisHandWrapper = fHisHand.parentElement;
  const fHerHand = document.createElementNS(NS, 'g');
  fHerHand.setAttribute('id', 'fHerHand');
  fWoman.parentElement.insertBefore(hisHandWrapper, fWoman.nextSibling);
  herHand.setAttribute('transform', 'translate(131 458) rotate(184) scale(.92)');
  herHand.querySelector('#herHandShape > path').setAttribute(
    'd',
    'M-10 11 C-11.5 -3 -14 -12 -14.5 -26 C-14.6 -31 -12 -33 -8 -33 L8 -33 C12 -33 14.6 -31 14.5 -26 C14 -12 11.5 -3 10 11Z'
  );

  const fHerArm = document.createElementNS(NS, 'g');
  fHerArm.setAttribute('id', 'fHerArm');
  const leftArmParts = [
    'line[x1="198"][y1="354"]',
    'line[x1="152"][y1="414"]'
  ].map((selector) => fWoman.querySelector(selector));
  leftArmParts.forEach((part) => {
    const outline = part.cloneNode();
    outline.setAttribute('stroke', part.getAttribute('stroke') === '#EBC3CF' ? '#C98BA2' : '#B98467');
    outline.setAttribute('stroke-width', String(Number(part.getAttribute('stroke-width')) + 2.5));
    fHerArm.appendChild(outline);
  });
  leftArmParts.forEach((part) => fHerArm.appendChild(part));
  [
    'path[d="M129.5 435 L151.5 446"]',
    'path[d="M131 439 L153 450"]'
  ].forEach((selector) => fHerArm.appendChild(fWoman.querySelector(selector)));
  fHerHand.appendChild(fHerArm);

  const fFlowerArm = document.createElementNS(NS, 'g');
  fFlowerArm.setAttribute('id', 'fFlowerArm');
  const rightArmParts = [
    'line[x1="400"][y1="352"]',
    'line[x1="418"][y1="440"]'
  ].map((selector) => fWoman.querySelector(selector));
  rightArmParts.forEach((part) => {
    const outline = part.cloneNode();
    outline.setAttribute('stroke', part.getAttribute('stroke') === '#EBC3CF' ? '#C98BA2' : '#B98467');
    outline.setAttribute('stroke-width', String(Number(part.getAttribute('stroke-width')) + 2.5));
    fFlowerArm.appendChild(outline);
  });
  rightArmParts.forEach((part) => fFlowerArm.appendChild(part));
  const fFlowerHand = fWoman.querySelector('#fFlowerHand');
  fFlowerHand.setAttribute('transform', 'translate(410 380) scale(1.08 1.22) translate(-410 -380)');
  fFlowerArm.appendChild(fFlowerHand);
  fWoman.insertBefore(fFlowerArm, fWoman.querySelector('#fHairFront'));
  const flowerPalm = fFlowerHand.querySelector(':scope > path');
  flowerPalm.setAttribute('stroke', '#B98467');
  flowerPalm.setAttribute('stroke-width', '1');
  flowerPalm.setAttribute('stroke-linejoin', 'round');

  const palmShadow = document.createElementNS(NS, 'ellipse');
  palmShadow.setAttribute('cx', '132');
  palmShadow.setAttribute('cy', '486');
  palmShadow.setAttribute('rx', '15');
  palmShadow.setAttribute('ry', '4');
  palmShadow.setAttribute('fill', '#4A2F5A');
  palmShadow.setAttribute('opacity', '.24');
  palmShadow.setAttribute('filter', 'url(#fPalmShadow)');
  fHerHand.appendChild(palmShadow);
  fHerHand.appendChild(herHand);

  const handLayers = herHand.querySelectorAll('use[href="#herHandShape"]');
  herHand.insertBefore(handLayers[2], handLayers[1]);
  handLayers[1].setAttribute('fill', '#E4BA9F');
  handLayers[1].setAttribute('stroke', '#B98467');
  handLayers[2].setAttribute('fill', '#E4BA9F');
  fWoman.parentElement.appendChild(fHerHand);

  gsap.set('#fHead',       { svgOrigin: '300 290' });
  gsap.set('#fHairFront',  { svgOrigin: '300 220' });
  gsap.set('#fHairBack',   { svgOrigin: '300 200' });
  gsap.set('#fWisps',      { svgOrigin: '300 150' });
  gsap.set('#fEyes',       { svgOrigin: '300 210' });
  gsap.set(['#fSpkL', '#fSpkR'], { transformOrigin: '50% 50%' });
  gsap.set('#fFlower',     { svgOrigin: '410 380' });
  gsap.set('#fHisHand',    { svgOrigin: '94 550' });
  gsap.set('#fWoman',      { svgOrigin: '300 600' });
  gsap.set('#fHerHand',    { svgOrigin: '300 600' });
  if (!reduceMotion) {
    gsap.to('#fHead',      { rotation: 2.2, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#fHairFront', { rotation: 1.4, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#fHairBack',  { rotation: -0.9, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#fWisps',     { rotation: 3.5, x: 1.2, duration: 2.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#fFlower',    { rotation: 2.6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(['#fWoman', '#fHerHand'], { scale: 1.008, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('#fGlowC',     { opacity: 0.8, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // the glints in her eyes twinkle softly
    gsap.to(['#fSpkL', '#fSpkR'], { scale: 1.25, opacity: 0.85, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // blink, now and then a slow double blink
    (function blink() {
      const tl = gsap.timeline({ delay: rnd(2.4, 5.2), onComplete: blink });
      tl.to('#fEyes', { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1 });
      if (Math.random() < 0.25) tl.to('#fEyes', { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1 }, '+=0.12');
    })();
    // her gaze: you, then the flower, then back to you
    (function glance() {
      const spots = [[0, 0], [-2.2, 1], [0, 0], [1.6, -0.6], [0, 0]];
      const s = spots[Math.floor(rnd(0, spots.length))];
      gsap.to('.fIris', { x: s[0], y: s[1], duration: 0.4, ease: 'power2.out', delay: rnd(1.6, 3.8), onComplete: glance });
    })();
    (function squeeze() {
      gsap.to('#fHisHand', { scale: 1.035, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1, delay: rnd(3.5, 6), onComplete: squeeze });
    })();
  }

  /* Entrance when you arrive: the scene fades up, then one line gives way to the next */
  gsap.set('#finaleScene',    { opacity: 0, y: 30 });
  gsap.set('#finaleCaption',  { opacity: 0, y: 14 });
  gsap.set('#finaleCaption2', { opacity: 0, y: 14 });
  let played = false;
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || played) return;
    played = true; io.disconnect();
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.to('#finaleScene',    { opacity: 1, y: 0, duration: 1.8 })
      .to('#finaleCaption',  { opacity: 1, y: 0, duration: 1.6 }, '-=0.6')
      .to('#finaleCaption',  { opacity: 0, y: -8, duration: 1.2, ease: 'power1.in' }, '+=3.2')
      .to('#finaleCaption2', { opacity: 1, y: 0, duration: 1.6 }, '-=0.2')
      
      .to('#fGlowC',         { opacity: 0.95, duration: 2.4, ease: 'sine.inOut' }, '<')
          .to('#finBtns',        { autoAlpha: 1, y: 0, duration: 1.2 }, '-=1.2');
    if (reduceMotion) tl.timeScale(6);
  }, { threshold: 0.3 });
  io.observe(document.getElementById('part4'));
})();
