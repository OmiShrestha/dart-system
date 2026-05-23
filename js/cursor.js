// Custom cursor follow
  (function () {
    const cur = document.getElementById('cursor');
    let tx = window.innerWidth/2, ty = window.innerHeight/2;
    let cx = tx, cy = ty;
    cur.style.willChange = 'transform';
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    document.addEventListener('mouseleave', () => cur.style.opacity = '0');
    document.addEventListener('mouseenter', () => cur.style.opacity = '1');
    function loop() {
      cx += (tx - cx) * 1.0;
      cy += (ty - cy) * 1.0;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    // Hover targets — reticle grows + ring appears
    const enlarge = ['a','button','.cta','.stack-tags span','.ben','.how .step','.feature'];
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

  // Hit-impact click ripple
  (function() {
    function ring(x, y, size, ms, delay) {
      var el = document.createElement('div');
      el.className = 'hit-ring';
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.width  = size + 'px';
      el.style.height = size + 'px';
      el.style.animationDuration = ms + 'ms';
      if (delay) el.style.animationDelay = delay + 'ms';
      document.body.appendChild(el);
      el.addEventListener('animationend', function() { el.remove(); });
    }
    document.addEventListener('click', function(e) {
      var dot = document.createElement('div');
      dot.className = 'hit-dot';
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      document.body.appendChild(dot);
      dot.addEventListener('animationend', function() { dot.remove(); });
      ring(e.clientX, e.clientY, 40, 360,  0);
      ring(e.clientX, e.clientY, 68, 500, 45);
    });
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
