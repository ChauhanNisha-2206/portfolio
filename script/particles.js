/* =========================================================
   FLOATING LIGHT MOTES
   Slow, gentle glowing dots drifting upward across the whole
   page — like dust caught in golden-hour light.
   ========================================================= */

(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, DPR;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const COUNT = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 22000));
  const colors = ['255,244,214', '255,255,255', '255,214,153'];

  function makeMote() {
    return {
      x: Math.random() * W,
      y: Math.random() * H + H * 0.2,
      r: 1 + Math.random() * 2.2,
      speed: 6 + Math.random() * 14,
      drift: (Math.random() - 0.5) * 10,
      opacity: 0.25 + Math.random() * 0.45,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkle: Math.random() * Math.PI * 2
    };
  }
  const motes = Array.from({ length: COUNT }, makeMote);

  let last = performance.now();
  function animate(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, W, H);

    motes.forEach((m) => {
      if (!prefersReduced) {
        m.y -= m.speed * dt;
        m.x += Math.sin(m.twinkle) * 0.2;
        m.twinkle += dt * 0.6;
        if (m.y < -10) {
          m.y = H + 10;
          m.x = Math.random() * W;
        }
      }
      const flicker = 0.7 + 0.3 * Math.sin(m.twinkle * 2);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${m.color}, ${m.opacity * flicker})`;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();