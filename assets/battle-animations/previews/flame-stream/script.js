const beamCanvas = document.querySelector(".flame-canvas");
const targetCanvas = document.querySelector(".target-fire-canvas");
const scene = document.querySelector(".battle-scene");
const beamCtx = beamCanvas.getContext("2d");
const targetCtx = targetCanvas.getContext("2d");

let beamParticles = [];
let targetFlames = [];
let embers = [];
let lastTime = performance.now();

function setupCanvas(canvas, ctx) {
  const rect = scene.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resizeCanvas() {
  setupCanvas(beamCanvas, beamCtx);
  setupCanvas(targetCanvas, targetCtx);
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function scenePoints() {
  const rect = scene.getBoundingClientRect();
  return {
    rect,
    mouth: { x: rect.width * 0.31, y: rect.height * 0.57 },
    target: { x: rect.width * 0.77, y: rect.height * 0.39 },
    targetBox: {
      x: rect.width * 0.70,
      y: rect.height * 0.19,
      w: rect.width * 0.16,
      h: rect.height * 0.34
    }
  };
}

function resetBeamParticle(p, burst = false) {
  const pts = scenePoints();
  p.t = burst ? rand(0, 0.92) : 0;
  p.speed = rand(0.62, 1.08);
  p.offset = rand(-34, 34);
  p.wave = rand(0, Math.PI * 2);
  p.waveSpeed = rand(5, 9);
  p.size = rand(22, 58);
  p.grow = rand(0.72, 1.34);
  p.start = pts.mouth;
  p.end = pts.target;
  p.life = rand(0.78, 1);
  p.hot = Math.random() > 0.38;
}

function resetTargetFlame(f, burst = false) {
  const { targetBox } = scenePoints();
  f.x = targetBox.x + rand(targetBox.w * 0.12, targetBox.w * 0.88);
  f.baseY = targetBox.y + rand(targetBox.h * 0.42, targetBox.h * 0.94);
  f.t = burst ? rand(0, 1) : 0;
  f.speed = rand(0.86, 1.65);
  f.height = rand(targetBox.h * 0.28, targetBox.h * 0.62);
  f.width = rand(18, 42);
  f.wobble = rand(-18, 18);
  f.phase = rand(0, Math.PI * 2);
  f.hot = Math.random() > 0.32;
}

function resetEmber(e, burst = false) {
  const pts = scenePoints();
  e.t = burst ? rand(0, 0.95) : 0;
  e.speed = rand(0.48, 0.95);
  e.offset = rand(-52, 52);
  e.lift = rand(16, 58);
  e.size = rand(2, 6);
  e.start = pts.mouth;
  e.end = pts.target;
}

function init() {
  resizeCanvas();
  beamParticles = Array.from({ length: 130 }, () => {
    const p = {};
    resetBeamParticle(p, true);
    return p;
  });
  targetFlames = Array.from({ length: 76 }, () => {
    const f = {};
    resetTargetFlame(f, true);
    return f;
  });
  embers = Array.from({ length: 48 }, () => {
    const e = {};
    resetEmber(e, true);
    return e;
  });
}

function pointOnBeam(item, time) {
  const x = item.start.x + (item.end.x - item.start.x) * item.t;
  const y = item.start.y + (item.end.y - item.start.y) * item.t;
  const dx = item.end.x - item.start.x;
  const dy = item.end.y - item.start.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const wobble = Math.sin(item.wave + time * item.waveSpeed + item.t * 9) * 12;
  const spread = item.offset * (0.42 + item.t * 0.88);
  return {
    x: x + nx * (spread + wobble),
    y: y + ny * (spread + wobble) - Math.sin(item.t * Math.PI) * 18
  };
}

function drawFireBlob(ctx, x, y, radius, alpha, hot, squash = 0.82) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  if (hot) {
    gradient.addColorStop(0, `rgba(255, 255, 232, ${alpha})`);
    gradient.addColorStop(0.22, `rgba(255, 238, 96, ${alpha * 0.95})`);
    gradient.addColorStop(0.55, `rgba(255, 126, 24, ${alpha * 0.72})`);
    gradient.addColorStop(1, "rgba(205, 24, 14, 0)");
  } else {
    gradient.addColorStop(0, `rgba(255, 214, 70, ${alpha * 0.85})`);
    gradient.addColorStop(0.42, `rgba(255, 80, 22, ${alpha * 0.76})`);
    gradient.addColorStop(1, "rgba(116, 12, 10, 0)");
  }
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 1.35, radius * squash, rand(-0.7, 0.7), 0, Math.PI * 2);
  ctx.fill();
}

function drawBeam(now, dt, rect) {
  const time = now / 1000;
  beamCtx.clearRect(0, 0, rect.width, rect.height);
  beamCtx.globalCompositeOperation = "lighter";

  for (const p of beamParticles) {
    p.t += dt * p.speed;
    if (p.t > p.life) resetBeamParticle(p);
    const pos = pointOnBeam(p, time);
    const fadeIn = Math.min(1, p.t / 0.18);
    const fadeOut = Math.max(0, 1 - Math.max(0, p.t - 0.78) / 0.22);
    const alpha = 0.34 * fadeIn * fadeOut;
    const radius = p.size * (0.65 + Math.sin(p.t * Math.PI) * 0.45) * p.grow;
    drawFireBlob(beamCtx, pos.x, pos.y, radius, alpha, p.hot);
  }

  for (const e of embers) {
    e.t += dt * e.speed;
    if (e.t > 1) resetEmber(e);
    const x = e.start.x + (e.end.x - e.start.x) * e.t;
    const y = e.start.y + (e.end.y - e.start.y) * e.t + e.offset * 0.36 - Math.sin(e.t * Math.PI) * e.lift;
    const alpha = Math.sin(e.t * Math.PI);
    beamCtx.fillStyle = `rgba(255, 238, 120, ${alpha})`;
    beamCtx.shadowColor = "rgba(255, 72, 20, 0.9)";
    beamCtx.shadowBlur = 12;
    beamCtx.beginPath();
    beamCtx.arc(x, y, e.size, 0, Math.PI * 2);
    beamCtx.fill();
    beamCtx.shadowBlur = 0;
  }

  const { mouth } = scenePoints();
  drawFireBlob(beamCtx, mouth.x, mouth.y, 34 + Math.sin(time * 18) * 5, 0.72, true);
}

function drawTargetFire(now, dt, rect) {
  const time = now / 1000;
  const { targetBox } = scenePoints();
  targetCtx.clearRect(0, 0, rect.width, rect.height);
  targetCtx.globalCompositeOperation = "lighter";

  const glow = targetCtx.createRadialGradient(
    targetBox.x + targetBox.w * 0.5,
    targetBox.y + targetBox.h * 0.58,
    0,
    targetBox.x + targetBox.w * 0.5,
    targetBox.y + targetBox.h * 0.58,
    targetBox.w * 0.72
  );
  glow.addColorStop(0, "rgba(255, 238, 96, 0.24)");
  glow.addColorStop(0.55, "rgba(255, 80, 22, 0.18)");
  glow.addColorStop(1, "rgba(255, 40, 10, 0)");
  targetCtx.fillStyle = glow;
  targetCtx.fillRect(targetBox.x - 30, targetBox.y - 30, targetBox.w + 60, targetBox.h + 60);

  for (const f of targetFlames) {
    f.t += dt * f.speed;
    if (f.t > 1) resetTargetFlame(f);
    const rise = f.height * f.t;
    const fade = Math.sin(f.t * Math.PI);
    const x = f.x + Math.sin(time * 9 + f.phase) * f.wobble * (0.2 + f.t);
    const y = f.baseY - rise;
    const radius = f.width * (0.6 + fade * 0.9);
    drawFireBlob(targetCtx, x, y, radius, 0.42 * fade, f.hot, 1.18);
    drawFireBlob(targetCtx, x, y + radius * 0.32, radius * 0.62, 0.32 * fade, true, 0.74);
  }
}

function drawFrame(now) {
  const dt = Math.min(32, now - lastTime) / 1000;
  lastTime = now;
  const { rect } = scenePoints();
  drawBeam(now, dt, rect);
  drawTargetFire(now, dt, rect);
  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
