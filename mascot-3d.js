const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";

let threePromise = null;
let renderer = null;
let scene = null;
let camera = null;
let frameId = 0;
let model = null;
let started = false;
let activeCanvas = null;

function loadThree() {
  if (!threePromise) {
    threePromise = import(THREE_URL);
  }

  return threePromise;
}

function makeMaterial(THREE, color, emissive = 0x000000, intensity = 0.18) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: intensity,
    roughness: 0.42,
    metalness: 0.18,
  });
}

function createRoundedBoxFallback(THREE, width, height, depth) {
  return new THREE.BoxGeometry(width, height, depth, 3, 3, 3);
}

function createOakBitModel(THREE) {
  const group = new THREE.Group();

  const bodyMaterial = makeMaterial(THREE, 0x17233d, 0x06102a, 0.22);
  const trimMaterial = makeMaterial(THREE, 0x43dbff, 0x0db8ff, 0.6);
  const headMaterial = makeMaterial(THREE, 0xffed65, 0xffd94a, 0.32);
  const accentMaterial = makeMaterial(THREE, 0xff3f8b, 0xff1f73, 0.45);
  const eyeMaterial = makeMaterial(THREE, 0xf8fbff, 0xffffff, 0.8);

  const body = new THREE.Mesh(createRoundedBoxFallback(THREE, 1.45, 1.35, 0.42), bodyMaterial);
  body.position.y = -0.05;
  group.add(body);

  const topBand = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.34, 0.46), headMaterial);
  topBand.position.set(0, 0.38, 0.03);
  group.add(topBand);

  const face = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.58, 0.48), trimMaterial);
  face.position.set(0, -0.12, 0.05);
  group.add(face);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.38, 0.51), bodyMaterial);
  screen.position.set(0, -0.12, 0.1);
  group.add(screen);

  const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.54), eyeMaterial);
  leftEye.position.set(-0.25, -0.06, 0.14);
  group.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.25;
  group.add(rightEye);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.55), accentMaterial);
  mouth.position.set(0, -0.32, 0.15);
  group.add(mouth);

  const antennaGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.42, 8);
  const leftAntenna = new THREE.Mesh(antennaGeometry, trimMaterial);
  leftAntenna.position.set(-0.38, 0.96, 0);
  leftAntenna.rotation.z = -0.22;
  group.add(leftAntenna);

  const rightAntenna = leftAntenna.clone();
  rightAntenna.position.x = 0.38;
  rightAntenna.rotation.z = 0.22;
  group.add(rightAntenna);

  const orbGeometry = new THREE.SphereGeometry(0.09, 12, 12);
  const leftOrb = new THREE.Mesh(orbGeometry, headMaterial);
  leftOrb.position.set(-0.43, 1.16, 0);
  group.add(leftOrb);

  const rightOrb = leftOrb.clone();
  rightOrb.position.x = 0.43;
  group.add(rightOrb);

  const footGeometry = new THREE.BoxGeometry(0.36, 0.12, 0.38);
  const leftFoot = new THREE.Mesh(footGeometry, accentMaterial);
  leftFoot.position.set(-0.34, -0.82, 0.02);
  group.add(leftFoot);

  const rightFoot = leftFoot.clone();
  rightFoot.position.x = 0.34;
  group.add(rightFoot);

  model = { group, mouth, leftEye, rightEye, screen };
  return group;
}

function resizeCanvas(canvas) {
  if (!renderer || !camera) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(canvas, THREE) {
  const time = performance.now() / 1000;
  resizeCanvas(canvas);

  if (model?.group) {
    model.group.rotation.y = Math.sin(time * 0.8) * 0.22;
    model.group.rotation.x = Math.sin(time * 0.65) * 0.06;
    model.group.position.y = Math.sin(time * 1.8) * 0.08;
  }

  if (model?.mouth) {
    const isSpeaking = canvas.closest(".oakbit")?.classList.contains("is-speaking");
    model.mouth.scale.y = isSpeaking ? 1 + Math.abs(Math.sin(time * 12)) * 1.2 : 1;
  }

  renderer.render(scene, camera);
  frameId = window.requestAnimationFrame(() => animate(canvas, THREE));
}

export async function startOakBit3D(canvas) {
  if (!canvas) {
    return;
  }

  if (started && activeCanvas === canvas) {
    resizeCanvas(canvas);
    return;
  }

  if (started) {
    stopOakBit3D();
  }

  const THREE = await loadThree();
  started = true;
  activeCanvas = canvas;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.05, 4.2);

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const ambient = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x9befff, 2.2);
  keyLight.position.set(2.4, 3.2, 3);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xffed65, 1.8, 5);
  rimLight.position.set(-2, 1.8, 2);
  scene.add(rimLight);

  scene.add(createOakBitModel(THREE));
  animate(canvas, THREE);
}

export function stopOakBit3D() {
  if (frameId) {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
  }
  renderer?.dispose?.();
  renderer = null;
  scene = null;
  camera = null;
  model = null;
  activeCanvas = null;
  started = false;
}

window.OakBit3D = {
  start: startOakBit3D,
  stop: stopOakBit3D,
};
