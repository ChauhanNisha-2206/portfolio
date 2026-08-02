/* =========================================================
   GHIBLI SKY — procedural painterly background
   Soft dawn gradient + drifting cloud blobs + a gentle sun glow.
   Runs on <canvas id="bg-ghibli">. If a real background
   image/video is supplied (see index.html), this fades out
   automatically once that asset loads.
   ========================================================= */

(function () {
  const canvas = document.getElementById('bg-ghibli');
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

  // Soft cloud blobs: each is a cluster of overlapping radial-gradient puffs
  const CLOUD_COUNT = 7;
  const clouds = [];
  for (let i = 0; i < CLOUD_COUNT; i++) {
    clouds.push({
      x: Math.random() * 1.3 - 0.15,
      y: 0.08 + Math.random() * 0.55,
      scale: 0.6 + Math.random() * 1.1,
      speed: 0.15 + Math.random() * 0.25,
      opacity: 0.18 + Math.random() * 0.22,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => ({
        dx: (Math.random() - 0.5) * 220,
        dy: (Math.random() - 0.5) * 60,
        r: 60 + Math.random() * 90
      }))
    });
  }

  function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#ffd9a0');
    grad.addColorStop(0.35, '#ffb8c6');
    grad.addColorStop(0.7, '#a9cbe8');
    grad.addColorStop(1, '#6f9cc7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // sun glow, upper area
    const sunX = W * 0.78;
    const sunY = H * 0.16;
    const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, W * 0.35);
    glow.addColorStop(0, 'rgba(255, 244, 214, 0.85)');
    glow.addColorStop(0.4, 'rgba(255, 214, 153, 0.35)');
    glow.addColorStop(1, 'rgba(255, 214, 153, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  function drawCloud(cloud) {
    const cx = cloud.x * W;
    const cy = cloud.y * H;
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    cloud.puffs.forEach((p) => {
      const x = cx + p.dx * cloud.scale;
      const y = cy + p.dy * cloud.scale;
      const r = p.r * cloud.scale;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  let last = performance.now();
  function animate(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    drawSky();
    clouds.forEach((cloud) => {
      if (!prefersReduced) {
        cloud.x += (cloud.speed * dt) / 60;
        if (cloud.x > 1.3) cloud.x = -0.3;
      }
      drawCloud(cloud);
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();