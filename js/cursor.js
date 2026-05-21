// Custom cursor follow
  (function () {
    const cur = document.getElementById('cursor');
    let tx = window.innerWidth/2, ty = window.innerHeight/2;
    let cx = tx, cy = ty;
    cur.style.willChange = 'transform';
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    function loop() {
      cx += (tx - cx) * 1.0;
      cy += (ty - cy) * 1.0;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    // Hover targets
    const enlarge = ['a','button','.cta','.stack-tags span','.ben','.how .step'];
    document.querySelectorAll(enlarge.join(',')).forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('lg'));
      el.addEventListener('mouseleave', () => cur.classList.remove('lg'));
    });
  })();

  // Scroll readout
  (function () {
    const bar = document.getElementById('scrollBar');
    const pct = document.getElementById('scrollPct');
    function upd() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
      bar.style.setProperty('--p', (p*100).toFixed(0) + '%');
      pct.textContent = String(Math.round(p*100)).padStart(2,'0') + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  })();

  // Reveal on scroll
  (function () {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .mask-wrap').forEach(el => obs.observe(el));
  })();