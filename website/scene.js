import * as THREE from 'three';

const host = document.getElementById('hero-scene');
const canvas = document.getElementById('scene-canvas');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 650px)');

if (host && canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
  } catch {
    // The CSS sculpture stays visible when WebGL is unavailable.
  }
  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
    camera.position.set(0, 0, 7.5);
    scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x5c6aaa, 3.4));
    const key = new THREE.DirectionalLight(0xffffff, 5);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7197ff, 5);
    rim.position.set(4, -1, -2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xe5ebff, 2);
    fill.position.set(2, 2, 5);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);
    const material = new THREE.MeshStandardMaterial({color: 0x2148ed, roughness: 0.28, metalness: 0.38});
    const geometries = [
      new THREE.TorusKnotGeometry(0.94, 0.28, 160, 24, 2, 3),
      new THREE.IcosahedronGeometry(1.3, 0),
      new THREE.TorusKnotGeometry(0.93, 0.19, 180, 20, 3, 4)
    ];
    const sculpture = new THREE.Mesh(geometries[0], material);
    sculpture.rotation.set(0.3, 0.2, -0.2);
    group.add(sculpture);

    const orbitMaterial = new THREE.LineBasicMaterial({color: 0xa2b0df, transparent: true, opacity: 0.45});
    const orbits = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const points = Array.from({length: 129}, (_, j) => {
        const angle = j / 128 * Math.PI * 2;
        return new THREE.Vector3(Math.cos(angle) * (1.9 + i * 0.14), Math.sin(angle) * (1.9 + i * 0.14), 0);
      });
      const orbit = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), orbitMaterial);
      orbit.rotation.set(0.85 + i * 0.55, i * 0.8, 0.25 + i * 0.5);
      orbits.add(orbit);
    }
    group.add(orbits);
    const satelliteGeometry = new THREE.SphereGeometry(0.065, 16, 12);
    const satellites = [];
    const satelliteMaterial = new THREE.MeshStandardMaterial({color: 0x284cff, roughness: 0.25, metalness: 0.2});
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      group.add(mesh);
      satellites.push(mesh);
    }
    // A sparse, deterministic point field gives depth without a full-screen effect.
    const positions = new Float32Array(54 * 3);
    for (let i = 0; i < 54; i++) {
      const angle = i * 2.39996;
      const radius = 1.7 + (i % 11) / 8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = Math.sin(i * 0.73) * 1.4 - 1;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(pointGeometry, new THREE.PointsMaterial({color: 0x657ec9, size: 0.018, transparent: true, opacity: 0.55}));
    scene.add(points);

    let paused = reducedMotion.matches;
    let visible = true;
    let frame = 0;
    let time = 0;
    let previous = 0;
    let shapeIndex = 0;
    let changing = false;
    let transition = 1;
    let pointer = {x: 0, y: 0};
    const toggle = document.getElementById('scene-toggle');
    const changeShape = document.getElementById('scene-shape');
    const indexLabel = host.querySelector('.scene-index');
    const surface = host.querySelector('.scene-surface');

    const updateToggle = () => {
      const label = paused ? toggle.dataset.resume : toggle.dataset.pause;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? '▷' : 'Ⅱ';
    };
    const render = () => renderer.render(scene, camera);
    function animate(now) {
      frame = 0;
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!paused) time += delta;
      sculpture.rotation.x = 0.3 + time * 0.17;
      sculpture.rotation.y = 0.2 + time * 0.24;
      sculpture.rotation.z = -0.2 + Math.sin(time * 0.3) * 0.12;
      group.rotation.y += (pointer.x * 0.4 - group.rotation.y) * 0.045;
      group.rotation.x += (-pointer.y * 0.24 - group.rotation.x) * 0.045;
      group.position.y = Math.sin(time * 0.8) * 0.09;
      orbits.rotation.z = time * 0.045;
      points.rotation.z = -time * 0.012;
      satellites.forEach((satellite, i) => {
        const angle = time * (0.2 + i * 0.025) + i * Math.PI * 0.45;
        const radius = 1.95 + (i % 2) * 0.18;
        satellite.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.6, Math.sin(angle + i) * 1.15);
      });
      if (changing) {
        transition = Math.max(0, transition - delta * 5);
        if (transition === 0) {
          sculpture.geometry = geometries[shapeIndex];
          changing = false;
        }
      } else transition = Math.min(1, transition + delta * 4);
      sculpture.scale.setScalar(reducedMotion.matches ? 1 : Math.max(transition, 0.01));
      render();
      if (visible && !document.hidden && !paused) frame = requestAnimationFrame(animate);
    }
    function start() {
      if (!frame && visible && !document.hidden && !paused) {
        previous = 0;
        frame = requestAnimationFrame(animate);
      }
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    }
    new ResizeObserver(() => {
      const bounds = surface.getBoundingClientRect();
      camera.aspect = bounds.width / Math.max(bounds.height, 1);
      camera.position.z = bounds.width < 300 ? 8.4 : 7.5;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
      render();
    }).observe(surface);
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, {rootMargin: '100px'});
    visibilityObserver.observe(host);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    surface.addEventListener('pointermove', event => {
      if (reducedMotion.matches || paused) return;
      const rect = surface.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.y = (event.clientY - rect.top) / rect.height * 2 - 1;
    }, {passive: true});
    surface.addEventListener('pointerleave', () => {pointer = {x: 0, y: 0};});
    toggle.addEventListener('click', () => {
      paused = !paused;
      updateToggle();
      if (paused) stop(); else start();
    });
    changeShape.addEventListener('click', () => {
      shapeIndex = (shapeIndex + 1) % geometries.length;
      indexLabel.textContent = `0${shapeIndex + 1} / 03`;
      if (paused || reducedMotion.matches) {
        sculpture.geometry = geometries[shapeIndex];
        transition = 1;
        changing = false;
        sculpture.scale.setScalar(1);
        render();
      } else changing = true;
    });
    reducedMotion.addEventListener('change', () => {
      paused = reducedMotion.matches;
      pointer = {x: 0, y: 0};
      updateToggle();
      if (paused) stop(); else start();
    });
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      stop();
      host.classList.remove('scene-ready');
      host.querySelector('.scene-controls').hidden = true;
    });
    canvas.addEventListener('webglcontextrestored', () => {
      render();
      host.classList.add('scene-ready');
      host.querySelector('.scene-controls').hidden = false;
      start();
    });
    animate(0);
    updateToggle();
    host.classList.add('scene-ready');
    host.querySelector('.scene-controls').hidden = false;
  }
}

// Animate only nonessential visual framing; all text remains visible without JS.
if (!reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('arrived');
      revealObserver.unobserve(entry.target);
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.section, .project, .skills-grid article').forEach(element => revealObserver.observe(element));
}
