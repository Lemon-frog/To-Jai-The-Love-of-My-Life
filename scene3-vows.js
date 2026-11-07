/* SCENE 3: poem cards entrance, lanterns, stars */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    gsap.to('#nextBtn3 .next-arrow', { y: 5, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  /* Quiet stars (fewer and dimmer than Part 2, so they never compete with the text) */
  const st = document.getElementById('stars3');
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    const size = Math.random() < 0.5 ? 1.5 : 2;
    s.className = 'star';
    s.style.cssText =
      `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `--t:${3 + Math.random() * 5}s;--d:${-Math.random() * 6}s;--o:${0.4 + Math.random() * 0.4}`;
    st.appendChild(s);
  }

  /* Paper lanterns drifting up through the mist */
  const lant = document.getElementById('lant3');
  if (lant && !reduceMotion) {
    for (let i = 0; i < 8; i++) {
      const l = document.createElement('div');
      l.className = 'sky-lantern';
      l.style.left = gsap.utils.random(3, 95) + '%';
      l.style.transform = 'scale(' + gsap.utils.random(0.7, 1.3) + ')';
      lant.appendChild(l);
      gsap.fromTo(l, { y: 30 }, { y: () => -(lant.offsetHeight + 90), duration: gsap.utils.random(34, 54), ease: 'none', repeat: -1, delay: -gsap.utils.random(0, 50) });
      gsap.to(l, { x: gsap.utils.random(-30, 30), duration: gsap.utils.random(4, 7), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }

  /* Staggered entrance: title first, then the cards one by one */
  const cards = gsap.utils.toArray('.held');
  gsap.set(['#p3Title', ...cards], { opacity: 0, y: 60 });

  let played = false;
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || played) return;
    played = true;
    io.disconnect();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#p3Title', { opacity: 1, y: 0, duration: 1.2 })
      .to(cards, {
        opacity: 1, y: 0, duration: 1.4,
        stagger: 0.35,
        clearProps: 'transform'      // hands the transform back to CSS so the hover lift works
      }, '-=0.6');
    if (reduceMotion) tl.timeScale(6);
  }, { threshold: 0.25 });

  io.observe(document.getElementById('part3'));
})();
