const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".dark-pulse-canvas");
const ctx = canvas.getContext("2d");

let rings = [];
let motes = [];
let smoke = [];
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

function resetRing(r, burst = false) {
  const pts = points();
  r.t = burst ? rand(0, 1) : 0;
  r.speed = rand(0.52, 0.92);
  r.offset = rand(-30, 30) * pts.scale;
  r.radius = rand(28, 58) * pts.scale;
  r.phase = rand(0, Math.PI * 2);
}

function resetMote(m, burst = false) {
  const pts = points();
  m.t = burst ? rand(0, 1) : 0;
  m.speed = rand(0.62, 1.28);
  m.offset = rand(-58, 58) * pts.scale;
  m.size = rand(3, 9) * pts.scale;
  m.phase = rand(0, Math.PI * 2);
}

function resetSmoke(s, burst = false) {
  const pts = points();
  s.t = burst ? rand(0, 1) : 0;
  s.speed = rand(0.34, 0.74);
  s.offset = rand(-72, 72) * pts.scale;
  s.radius = rand(28, 62) * pts.scale;
  s.phase = rand(0, Math.PI * 2);
}

function init() {
  setupCanvas();
  rings = Array.from({ length: 9 }, () => {
    const r = {};
    resetRing(r, true);
    return r;
  });
  motes = Array.from({ length: 72 }, () => {
    const m = {};
    resetMote(m, true);
    return m;
  });
  smoke = Array.from({ length: 24 }, () => {
    const s = {};
    resetSmoke(s, true);
    return s;
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
  const wobble = Math.sin(time * 6 + item.phase + item.t * 9) * 14 * b.scale;
  return {
    x: b.start.x + b.dx * item.t + b.nx * (item.offset + wobble),
    y: b.start.y + b.dy * item.t + b.ny * (item.offset + wobble)
  };
}

function drawRing(x, y, radius, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1.25, 0.62);
  const grad = ctx.createRadialGradient(0, 0, radius * 0.48, 0, 0, radius);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.58, `rgba(68,18,118,${alpha * 0.52})`);
  grad.addColorStop(0.78, `rgba(184,92,255,${alpha})`);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(5, radius * 0.18);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMote(x, y, size, alpha) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.4);
  grad.addColorStop(0, `rgba(245,215,255,${alpha})`);
  grad.addColorStop(0.32, `rgba(184,92,255,${alpha * 0.72})`);
  grad.addColorStop(1, "rgba(35,10,66,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawFrame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const b = beamBasis();
  const time = now / 1000;
  ctx.clearRect(0, 0, b.rect.width, b.rect.height);
  ctx.globalCompositeOperation = "lighter";

  for (const s of smoke) {
    s.t += dt * s.speed;
    if (s.t > 1) resetSmoke(s);
    const pos = pointOnBeam(s, time);
    const alpha = Math.sin(s.t * Math.PI) * 0.16;
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, s.radius);
    grad.addColorStop(0, `rgba(184,92,255,${alpha})`);
    grad.addColorStop(0.5, `rgba(61,20,108,${alpha * 0.82})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, s.radius * 1.4, s.radius * 0.8, b.angle, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const r of rings) {
    r.t += dt * r.speed;
    if (r.t > 1) resetRing(r);
    const pos = pointOnBeam(r, time);
    const alpha = Math.sin(r.t * Math.PI) * 0.9;
    drawRing(pos.x, pos.y, r.radius * (0.6 + r.t * 0.7), b.angle, alpha);
  }

  for (const m of motes) {
    m.t += dt * m.speed;
    if (m.t > 1) resetMote(m);
    const pos = pointOnBeam(m, time);
    drawMote(pos.x, pos.y, m.size, Math.sin(m.t * Math.PI) * 0.86);
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
