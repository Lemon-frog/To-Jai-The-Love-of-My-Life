/* STORY GLUE: window.goTo() scene transitions + chapter title captions */
(function () {
  gsap.registerPlugin(ScrollToPlugin);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const veil = document.getElementById('veil');
  const syncDocumentVisibility = () => {
    document.documentElement.classList.toggle('document-hidden', document.hidden);
    gsap.globalTimeline.paused(document.hidden);
  };
  document.addEventListener('visibilitychange', syncDocumentVisibility);
  syncDocumentVisibility();

  /* One way to move between scenes: the screen softly dims (warm for day, deep blue for night)
     while the page glides, so every cut feels like a dissolve. */
  window.goTo = function (sel, tint) {
    gsap.killTweensOf(veil);
    gsap.set(veil, { backgroundColor: tint || '#0C0E2B', opacity: 0 });
    if (reduceMotion) { gsap.to(window, { duration: 0.01, scrollTo: { y: sel, autoKill: false } }); return; }
    gsap.timeline()
      .to(veil, { opacity: 0.55, duration: 0.8, ease: 'sine.in' })
      .to(veil, { opacity: 0, duration: 1.2, ease: 'sine.out' }, 1.0);
    gsap.to(window, { duration: 1.9, scrollTo: { y: sel, autoKill: false }, ease: 'power3.inOut' });
  };

  /* Chapter captions: a quiet title card the first time you arrive at each scene */
  const CH = [
    ['part0', 'I',   'A Greeting',            '#8A4B58'],
    ['part1', 'II',  'The Question',  '#8A4B58'],
    ['part2', 'III', 'The Serenade',  '#F6E1B6'],
    ['part3', 'IV',  'A Declaration',  '#F6E1B6'],
    ['part4', 'V',   'Thank You',          '#F6E1B6'],
    ['part5', 'VI',  'The Last Dance',     '#F6E1B6'],
    ['part6', 'VII', 'A Final Note',       '#F6E1B6']
  ];
  const scenePausedAnimations = new WeakSet();
  const sceneMotion = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle('document-offscreen', !isIntersecting);
      gsap.globalTimeline.getChildren(false, true, true).forEach((animation) => {
        const children = typeof animation.targets === 'function'
          ? [animation]
          : animation.getChildren(true, true, true);
        const belongsToScene = children.some((child) =>
          typeof child.targets === 'function' &&
          child.targets().some((element) => element instanceof Element && target.contains(element))
        );
        if (!belongsToScene) return;
        if (isIntersecting) {
          if (scenePausedAnimations.has(animation)) {
            animation.resume();
            scenePausedAnimations.delete(animation);
          }
        } else if (!animation.paused()) {
          animation.pause();
          scenePausedAnimations.add(animation);
        }
      });
    });
  }, { threshold: 0.01 });

  const cap = document.getElementById('chapter');
  const capNum = document.getElementById('chapterNum');
  const capTitle = document.getElementById('chapterTitle');
  let capTl = null;

  CH.forEach(([id, num, title, color]) => {
    const el = document.getElementById(id);
    sceneMotion.observe(el);
    let shown = false;
    new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting || shown) return;
      shown = true; obs.disconnect();
      if (capTl) capTl.kill();
      capNum.textContent = 'Chapter ' + num;
      capTitle.textContent = title;
      cap.style.color = color;
      cap.classList.toggle('chapter-on-light', color === '#8A4B58');
      capTl = gsap.timeline({ delay: id === 'part0' ? 2.4 : 0.9 })
        .fromTo(cap, { opacity: 0, y: -8 }, { opacity: 0.9, y: 0, duration: 1.2, ease: 'power2.out' })
        .to(cap, { opacity: 0, y: -4, duration: 1.4, ease: 'power1.in' }, '+=2.4');
      if (reduceMotion) capTl.timeScale(6);
    }, { threshold: 0.15 }).observe(el);
  });
})();
