/* =========================================================
   ENERGY ORB — Three.js
   A softly rotating particle sphere with a wireframe core,
   sitting behind the profile photo. Warm gold / teal palette
   to match the Ghibli sky.
   ========================================================= */

(function () {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('energyOrb');
  const stage = document.querySelector('.orb-stage');
  if (!canvas || !stage) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = stage.clientWidth;
  let height = stage.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const group = new THREE.Group();
  scene.add(group);

  // Outer particle sphere (fibonacci distribution)
  const POINT_COUNT = 220;
  function fibonacciSphere(samples, radius) {
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
    }
    return pts;
  }
  const spherePts = fibonacciSphere(POINT_COUNT, 2.6);
  const pointsGeo = new THREE.BufferGeometry().setFromPoints(spherePts);
  const pointsMat = new THREE.PointsMaterial({
    size: 0.045,
    color: 0xf2a65a,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });
  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  group.add(pointCloud);

  // A second, teal-tinted inner points layer for depth
  const innerPts = fibonacciSphere(90, 1.7);
  const innerGeo = new THREE.BufferGeometry().setFromPoints(innerPts);
  const innerMat = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x3fb6ad,
    transparent: true,
    opacity: 0.7
  });
  const innerCloud = new THREE.Points(innerGeo, innerMat);
  group.add(innerCloud);

  // Wireframe core
  const coreGeo = new THREE.IcosahedronGeometry(1.15, 1);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffe0b0, wireframe: true, transparent: true, opacity: 0.5 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Soft glow sprite at center
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 128;
  glowCanvas.height = 128;
  const gctx = glowCanvas.getContext('2d');
  const gradient = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,224,176,0.9)');
  gradient.addColorStop(1, 'rgba(255,224,176,0)');
  gctx.fillStyle = gradient;
  gctx.fillRect(0, 0, 128, 128);
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false });
  const glowSprite = new THREE.Sprite(glowMat);
  glowSprite.scale.set(3.4, 3.4, 1);
  group.add(glowSprite);

  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!prefersReduced) {
      group.rotation.y += 0.0016;
      group.rotation.x = Math.sin(t * 0.25) * 0.12;
      core.rotation.y -= 0.0022;
      core.rotation.x += 0.0012;
      const pulse = 1 + Math.sin(t * 1.4) * 0.04;
      glowSprite.scale.set(3.4 * pulse, 3.4 * pulse, 1);
    }

    renderer.render(scene, camera);
  }
  animate();
})();