const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".ice-beam-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let crystals = [];
let last = performance.now();

function setupCanvas() {
  const rect = scene.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function points() {
  const rect = scene.getBoundingClientRect();
  return {
    rect,
    start: { x: rect.width * 0.3, y: rect.height * 0.56 },
    end: { x: rect.width * 0.78, y: rect.height * 0.42 },
    scale: rect.width / 920
  };
}

function resetParticle(p, burst = false) {
  const pts = points();
  p.t = burst ? rand(0, 1) : 0;
  p.speed = rand(0.8, 1.55);
  p.offset = rand(-26, 26) * pts.scale;
  p.size = rand(2, 6) * pts.scale;
  p.phase = rand(0, Math.PI * 2);
  p.alpha = rand(0.42, 0.92);
}

function resetCrystal(c, burst = false) {
  const pts = points();
  c.t = burst ? rand(0, 1) : 0;
  c.speed = rand(0.52, 1.1);
  c.offset = rand(-42, 42) * pts.scale;
  c.size = rand(8, 22) * pts.scale;
  c.spin = rand(0, Math.PI * 2);
  c.spinSpeed = rand(4, 10);
}

function init() {
  setupCanvas();
  particles = Array.from({ length: 90 }, () => {
    const p = {};
    resetParticle(p, true);
    return p;
  });
  crystals = Array.from({ length: 28 }, () => {
    const c = {};
    resetCrystal(c, true);
    return c;
  });
}

function beamBasis() {
  const pts = points();
  const dx = pts.end.x - pts.start.x;
  const dy = pts.end.y - pts.start.y;
  const len = Math.hypot(dx, dy) || 1;
  return { ...pts, dx, dy, len, nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
}

function pointOnBeam(item, time) {
  const b = beamBasis();
  const wobble = Math.sin(time * 10 + item.phase + item.t * 12) * 5 * b.scale;
  return {
    x: b.start.x + b.dx * item.t + b.nx * (item.offset + wobble),
    y: b.start.y + b.dy * item.t + b.ny * (item.offset + wobble)
  };
}

function drawIceCrystal(x, y, size, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = `rgba(223,250,255,${alpha})`;
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.9})`;
  ctx.lineWidth = Math.max(1, size * 0.12);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.42, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.42, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawBeam(now) {
  const b = beamBasis();
  const time = now / 1000;
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  for (let i = 0; i < 4; i += 1) {
    const wiggle = Math.sin(time * 18 + i) * 8 * b.scale;
    const grad = ctx.createLinearGradient(b.start.x, b.start.y, b.end.x, b.end.y);
    grad.addColorStop(0, "rgba(255,255,255,0.05)");
    grad.addColorStop(0.18, i === 0 ? "rgba(255,255,255,0.92)" : "rgba(184,240,255,0.46)");
    grad.addColorStop(0.72, i === 0 ? "rgba(202,248,255,0.88)" : "rgba(65,154,255,0.34)");
    grad.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = (i === 0 ? 8 : 20 + i * 9) * b.scale;
    ctx.beginPath();
    ctx.moveTo(b.start.x, b.start.y);
    ctx.bezierCurveTo(
      b.start.x + b.dx * 0.28 + b.nx * wiggle,
      b.start.y + b.dy * 0.28 + b.ny * wiggle,
      b.start.x + b.dx * 0.64 - b.nx * wiggle,
      b.start.y + b.dy * 0.64 - b.ny * wiggle,
      b.end.x,
      b.end.y
    );
    ctx.stroke();
  }
}

function drawFrame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const b = beamBasis();
  ctx.clearRect(0, 0, b.rect.width, b.rect.height);

  drawBeam(now);

  for (const p of particles) {
    p.t += dt * p.speed;
    if (p.t > 1) resetParticle(p);
    const pos = pointOnBeam(p, now / 1000);
    const alpha = Math.sin(p.t * Math.PI) * p.alpha;
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 3);
    grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(0.36, `rgba(202,248,255,${alpha * 0.72})`);
    grad.addColorStop(1, "rgba(65,154,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, p.size * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const c of crystals) {
    c.t += dt * c.speed;
    if (c.t > 1) resetCrystal(c);
    const pos = pointOnBeam(c, now / 1000);
    drawIceCrystal(pos.x, pos.y, c.size, c.spin + now / 1000 * c.spinSpeed, Math.sin(c.t * Math.PI) * 0.78);
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
