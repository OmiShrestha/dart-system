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

  // BLE Mesh pulse background
  (function() {
    var canvas = document.getElementById('mesh-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, dpr = 1, nodes = [], rafId;
    var NODE_COUNT = 22, THRESH = 260;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      W = rect.width  || canvas.parentElement.offsetWidth  || window.innerWidth;
      H = rect.height || canvas.parentElement.offsetHeight || window.innerHeight;
      if (!W || !H) return;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        var prov = i < 2;
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r:   prov ? 3.5 : Math.random() * 1.5 + 1.5,
          phase: Math.random() * Math.PI * 2,
          freq:  Math.random() * 0.0012 + 0.0006,
          prov:  prov
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(function(n) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -30) n.x = W + 30;
        if (n.x > W+30) n.x = -30;
        if (n.y < -30) n.y = H + 30;
        if (n.y > H+30) n.y = -30;
      });

      // Connection lines
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d  = Math.sqrt(dx*dx + dy*dy);
          if (d < THRESH) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(255,90,31,' + ((1 - d/THRESH) * 0.20).toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(function(n) {
        var pulse = 0.5 + 0.5 * Math.sin(t * n.freq + n.phase);
        var base  = n.prov ? 0.45 : 0.25;
        var alpha = base + pulse * (n.prov ? 0.28 : 0.20);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.8 + pulse * 0.25), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,90,31,' + alpha.toFixed(3) + ')';
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    }

    window.addEventListener('load', function() {
      resize();
      if (!W || !H) return;
      init();

      new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(rafId); rafId = null;
        }
      }).observe(canvas);

      rafId = requestAnimationFrame(draw);
    });

    window.addEventListener('resize', function() {
      resize();
      if (W && H) {
        nodes.forEach(function(n) {
          n.x = Math.min(n.x, W);
          n.y = Math.min(n.y, H);
        });
      }
    });
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
