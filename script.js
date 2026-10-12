import * as THREE from "./vendor/three.module.min.js";

(function () {
  const canvas = document.getElementById("bg-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040d0a, 0.035);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Jade gem centerpiece
  const gemGeometry = new THREE.IcosahedronGeometry(2.4, 0);
  const gemMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f9e73,
    emissive: 0x0a4d3c,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.25,
    flatShading: true,
    transparent: true,
    opacity: 0.35,
  });
  const gem = new THREE.Mesh(gemGeometry, gemMaterial);
  scene.add(gem);

  const wireGeometry = new THREE.IcosahedronGeometry(2.42, 0);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x3ee0a8,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const wireGem = new THREE.Mesh(wireGeometry, wireMaterial);
  scene.add(wireGem);

  const keyLight = new THREE.PointLight(0x3ee0a8, 2.2, 30);
  keyLight.position.set(5, 4, 6);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xd4af6a, 1, 30);
  fillLight.position.set(-6, -3, 4);
  scene.add(fillLight);

  scene.add(new THREE.AmbientLight(0x1f9e73, 0.3));

  // Particle field
  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x3ee0a8,
    size: 0.035,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("pointermove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      gem.rotation.y = t * 0.18;
      gem.rotation.x = t * 0.09;
      wireGem.rotation.y = t * 0.18;
      wireGem.rotation.x = t * 0.09;
      gem.position.y = Math.sin(t * 0.6) * 0.15;
      wireGem.position.y = gem.position.y;

      particles.rotation.y = t * 0.015;

      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();
