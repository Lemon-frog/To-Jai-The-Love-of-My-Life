/* SCENE 5: the waltz */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = gsap.utils.random, BEAT = 60 / 66;
  const noBtn = document.getElementById('danceNo'), yesBtn = document.getElementById('danceYes');
  const audio = document.getElementById('bgm');
  const danceCap = document.getElementById('danceCap');
  let shownLyric = danceCap.textContent;
  const lyrics = [
    [6, 'I Love You Too Much'],
    [10, 'To live without you loving me back'],
    [13, 'I Love You Too Much'],
    [17, "Heaven's my witness and this is a fact"],
    [20, 'I know I belong'],
    [24, 'When I sing this song'],
    [27, "There's love above love and it's ours"],
    [30, "'Cause I love you too much"],
    [34, 'I live for your touch'],
    [38, 'I whisper your name night after night'],
    [41, 'I Love You Too Much'],
    [45, "There's only one feeling and I know it's right"],
    [48, 'I know I belong'],
    [52, 'When I sing this song'],
    [55, "There's love above love and it's ours"],
    [58, "'Cause I love you too much"],
    [63, "Heaven knows your name I've been praying"],
    [69, 'To have you come here by my side'],
    [77, "Without you a part of me's missing"],
    [83, 'Just to make you my home, I will fight'],
    [90, ''],
    [104, 'I know I belong'],
    [107, 'When I sing this song'],
    [111, "There's love above love and it's ours"],
    [113, "'Cause I love you too much"],
    [118, 'I Love You Too Much'],
    [123, ''],
    [125, 'I Love You Too Much'],
    [128, "Heaven's my witness and this is a fact"],
    [132, 'You live in my soul'],
    [135, 'Your heart is my goal'],
    [138, "There's love above love and it's mine 'cause I love you"],
    [142, "There's love above love and it's yours 'cause I love you"],
    [145, "There's love above love and it's ours"],
    [148, 'If you love me as much']
  ];
  function showLyric(text) {
    if (text === shownLyric) return;
    shownLyric = text;
    gsap.killTweensOf(danceCap);
    gsap.to(danceCap, {
      opacity: 0, y: -6, duration: 0.35, ease: 'power1.in',
      onComplete: () => {
        danceCap.textContent = text;
        if (text) gsap.fromTo(danceCap, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
      }
    });
  }
  function syncLyrics() {
    const time = audio.currentTime;
    let active = '';
    for (const [start, line] of lyrics) {
      if (time < start) break;
      active = line;
    }
    showLyric(active);
  }
  ['timeupdate', 'seeked', 'loadedmetadata', 'play'].forEach((event) => {
    audio.addEventListener(event, () => {
      if (!audio.paused) syncLyrics();
    });
  });
  audio.addEventListener('pause', () => showLyric(''));
  syncLyrics();
  let dodges = 0, dodging = false, said = false;
  function dodge() {
    if (dodging) return; dodging = true;
    const r = noBtn.getBoundingClientRect(), cx = gsap.getProperty(noBtn, 'x'), cy = gsap.getProperty(noBtn, 'y');
    gsap.to(noBtn, { x: rnd(16 - r.left + cx, innerWidth - 16 - r.right + cx), y: rnd(16 - r.top + cy, innerHeight - 16 - r.bottom + cy),
      rotation: rnd(-12, 12), duration: 0.55, ease: 'back.out(1.7)', onComplete: () => { dodging = false; } });
    dodges++; gsap.to(yesBtn, { scale: Math.min(1 + dodges * 0.06, 1.35), duration: 0.5, ease: 'back.out(2)' });
  }
  noBtn.addEventListener('pointerenter', dodge);
  noBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); dodge(); });
  yesBtn.addEventListener('click', () => { if (said) return; said = true; gsap.to('#finBtns', { autoAlpha: 0, duration: 0.5 }); window.goTo('#part5', '#0C0E2B'); });
  document.getElementById('nextDanceBtn').addEventListener('click', () => {
    window.goTo('#part6', '#0C0E2B');
  });

  const st = document.getElementById('stars5');
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('span'), z = Math.random() < 0.5 ? 1.5 : 2;
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*65}%;width:${z}px;height:${z}px;--t:${3+Math.random()*5}s;--d:${-Math.random()*6}s;--o:${0.4+Math.random()*0.5}`;
    st.appendChild(s);
  }
  const mkLoop = (cls, host, n, fn) => { const el = document.getElementById(host); for (let i = 0; i < n; i++) { const d = document.createElement(cls[0]); d.className = cls[1]; el.appendChild(d); fn(d, i, el); } };
  if (!reduceMotion) {
    mkLoop(['div','sky-lantern'], 'lant5', 8, (l, i, host) => {
      l.style.left = rnd(3, 95) + '%';
      gsap.fromTo(l, { y: 30 }, { y: () => -(host.offsetHeight + 90), duration: rnd(32, 52), ease: 'none', repeat: -1, delay: -rnd(0, 50) });
      gsap.to(l, { x: rnd(-30, 30), duration: rnd(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    mkLoop(['span','firefly'], 'flies5', 14, (f) => {
      f.style.cssText = `left:${rnd(4,94)}%;top:${rnd(55,92)}%`;
      (function w() { gsap.to(f, { x: '+=' + rnd(-60, 60), y: '+=' + rnd(-40, 40), duration: rnd(3, 6), ease: 'sine.inOut', onComplete: w }); })();
      gsap.fromTo(f, { opacity: 0.15 }, { opacity: 1, duration: rnd(1, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: rnd(0, 2) });
    });
    mkLoop(['div','fall-petal'], 'fall5', 8, (el, i) => {
      el.style.left = rnd(2, 96) + '%'; const D = rnd(14, 22);
      gsap.to(el, { y: () => innerHeight * 1.1, rotation: '+=' + rnd(240, 540), duration: D, ease: 'none', repeat: -1, delay: i * 1.8 });
      gsap.to(el, { x: rnd(40, 90) * (i % 2 ? 1 : -1), duration: D / 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
  }

  gsap.set('#danceScene', { opacity: 0, y: 30 });
  const O = (id, o) => gsap.set(id, { svgOrigin: o });
  O('#dSkirtMain', '351 334'); O('#dSkirtBack', '351 334'); O('#dHair', '366 244'); O('#couple', '320 440');
  O('#dManHead', '250 282'); O('#dWomanHead', '350 284'); O('#dLegL', '241 372'); O('#dLegR', '259 372');
  O('#dArmsUp', '300 300'); O('#dScarfTail', '259 288'); O('#dManEye', '261 256'); O('#dWomanEye', '341 259');
  gsap.set('#epilogueMessage', { opacity: 0, y: 18 });
  let epiloguePlayed = false;
  new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting || epiloguePlayed) return;
    epiloguePlayed = true;
    observer.disconnect();
    const reveal = gsap.to('#epilogueMessage', { opacity: 1, y: 0, duration: 1.8, ease: 'power2.out' });
    if (reduceMotion) reveal.timeScale(6);
  }, { threshold: 0.3 }).observe(document.getElementById('part6'));
  let played = false;
  new IntersectionObserver((e, io) => {
    if (!e[0].isIntersecting || played) return; played = true; io.disconnect();
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    syncLyrics();
    tl.to('#danceScene', { opacity: 1, y: 0, duration: 1.8 }).to('#danceCap', { opacity: 1, duration: 2 }, '-=0.6');
    if (reduceMotion) { tl.timeScale(6); return; }
    const B = BEAT, I = 'sine.inOut';
    // one continuous waltz: every motion is a sine of the same 3-beat phase, so nothing ever snaps at a loop point
    const TAU = Math.PI * 2, S = Math.sin, C = Math.cos, t0 = gsap.ticker.time, sec = document.getElementById('part5');
    gsap.ticker.add(() => {
      const r = sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const now = gsap.ticker.time, th = TAU * now / (B * 3), ph = TAU * now / (B * 6);
      const k0 = Math.min(1, (now - t0) / 2.5), k = k0 * k0 * (3 - 2 * k0);   // eases the dance in
      gsap.set('#couple', { x: k * 34 * S(ph), y: -k * 4.5 * (1 - C(th - .5)), rotation: k * 1.8 * S(th + .6) });
      gsap.set('#dLegL', { rotation: k * 9 * S(th) });
      gsap.set('#dLegR', { rotation: k * 9 * S(th + 2.1) });
      gsap.set('#dWFootL', { x: -k * 9 * S(th + .4) });
      gsap.set('#dWFootR', { x: k * 9 * S(th + 2.5) });
      gsap.set('#dSkirtMain', { scaleX: 1 + k * .07 * S(th), skewX: k * 3.2 * S(th + .7) });
      gsap.set('#dSkirtBack', { scaleX: 1 - k * .06 * S(th + .3), skewX: -k * 3.6 * S(th + .8) });
      gsap.set('#dHair', { rotation: k * (3 + 5 * S(th - .9)) });
      gsap.set('#dArmsUp', { rotation: k * 2.2 * S(th + 1.2) });
      gsap.set('#dManHead', { rotation: k * (1 + 2.2 * S(th + .2)) });
      gsap.set('#dWomanHead', { rotation: -k * (1 + 2.2 * S(th + .4)) });
      gsap.set('#dScarfTail', { rotation: k * (2 + 6 * S(th - .7)) });
      gsap.set('#dManBlush', { opacity: .3 + .1 * S(th) });
      gsap.set('#dWomanBlush', { opacity: .3 + .1 * S(th + 1) });
    });
    (function blink() { gsap.to(['#dManEye', '#dWomanEye'], { scaleY: .08, duration: .09, yoyo: true, repeat: 1, delay: rnd(2.4, 5), onComplete: blink }); })();
    gsap.to('#dPool', { opacity: 0.26, duration: 3, ease: I, yoyo: true, repeat: -1 });
    gsap.to('#moon5', { opacity: 0.8, duration: 4, ease: I, yoyo: true, repeat: -1 });
  }, { threshold: 0.3 }).observe(document.getElementById('part5'));
})();
