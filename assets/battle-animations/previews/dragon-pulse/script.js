const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".dragon-pulse-canvas");
const ctx = canvas.getContext("2d");

let pulses = [];
let sparks = [];
let scales = [];
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
    start: { x: rect.width * 0.31, y: rect.height * 0.56 },
    end: { x: rect.width * 0.78, y: rect.height * 0.42 },
    scale: rect.width / 920
  };
}

function basis() {
  const pts = points();
  const dx = pts.end.x - pts.start.x;
  const dy = pts.end.y - pts.start.y;
  const len = Math.hypot(dx, dy) || 1;
  return { ...pts, dx, dy, len, nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
}

function resetPulse(p, burst = false) {
  const pts = points();
  p.t = burst ? rand(0, 1) : 0;
  p.speed = rand(0.46, 0.78);
  p.offset = rand(-22, 22) * pts.scale;
  p.radius = rand(30, 68) * pts.scale;
  p.phase = rand(0, Math.PI * 2);
  p.twist = rand(-1, 1);
}

function resetSpark(s, burst = false) {
  const pts = points();
  s.t = burst ? rand(0, 1) : 0;
  s.speed = rand(0.72, 1.36);
  s.offset = rand(-54, 54) * pts.scale;
  s.size = rand(3, 8) * pts.scale;
  s.phase = rand(0, Math.PI * 2);
}

function resetScale(s, burst = false) {
  const pts = points();
  s.t = burst ? rand(0, 1) : 0;
  s.speed = rand(0.5, 1);
  s.offset = rand(-46, 46) * pts.scale;
  s.size = rand(10, 21) * pts.scale;
  s.spin = rand(0, Math.PI * 2);
  s.spinSpeed = rand(3, 8);
}

function init() {
  setupCanvas();
  pulses = Array.from({ length: 7 }, () => {
    const p = {};
    resetPulse(p, true);
    return p;
  });
  sparks = Array.from({ length: 70 }, () => {
    const s = {};
    resetSpark(s, true);
    return s;
  });
  scales = Array.from({ length: 24 }, () => {
    const s = {};
    resetScale(s, true);
    return s;
  });
}

function pointOnBeam(item, time) {
  const b = basis();
  const coil = Math.sin(time * 7 + item.phase + item.t * 12) * 18 * b.scale;
  return {
    x: b.start.x + b.dx * item.t + b.nx * (item.offset + coil),
    y: b.start.y + b.dy * item.t + b.ny * (item.offset + coil)
  };
}

function drawPulse(x, y, radius, angle, alpha, twist) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle + twist);
  ctx.scale(1.55, 0.62);
  const grad = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(0.48, `rgba(98,118,255,${alpha * 0.42})`);
  grad.addColorStop(0.72, `rgba(116,255,220,${alpha})`);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(5, radius * 0.16);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSpark(x, y, size, alpha) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 2.8);
  grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
  grad.addColorStop(0.35, `rgba(116,255,220,${alpha * 0.8})`);
  grad.addColorStop(1, "rgba(98,118,255,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size * 2.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawScale(x, y, size, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = `rgba(116,255,220,${alpha})`;
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
  ctx.lineWidth = Math.max(1, size * 0.12);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.72, -size * 0.1);
  ctx.lineTo(size * 0.38, size);
  ctx.lineTo(-size * 0.38, size);
  ctx.lineTo(-size * 0.72, -size * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFrame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const b = basis();
  const time = now / 1000;
  ctx.clearRect(0, 0, b.rect.width, b.rect.height);
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < 3; i += 1) {
    const wobble = Math.sin(time * 9 + i * 2) * 16 * b.scale;
    const grad = ctx.createLinearGradient(b.start.x, b.start.y, b.end.x, b.end.y);
    grad.addColorStop(0, "rgba(255,255,255,0.02)");
    grad.addColorStop(0.16, i === 0 ? "rgba(255,255,255,0.74)" : "rgba(116,255,220,0.34)");
    grad.addColorStop(0.68, i === 0 ? "rgba(116,255,220,0.68)" : "rgba(98,118,255,0.34)");
    grad.addColorStop(1, "rgba(255,255,255,0.02)");
    ctx.strokeStyle = grad;
    ctx.lineCap = "round";
    ctx.lineWidth = i === 0 ? 7 * b.scale : (20 + i * 12) * b.scale;
    ctx.beginPath();
    ctx.moveTo(b.start.x, b.start.y);
    ctx.bezierCurveTo(
      b.start.x + b.dx * 0.28 + b.nx * wobble,
      b.start.y + b.dy * 0.28 + b.ny * wobble,
      b.start.x + b.dx * 0.66 - b.nx * wobble,
      b.start.y + b.dy * 0.66 - b.ny * wobble,
      b.end.x,
      b.end.y
    );
    ctx.stroke();
  }

  for (const p of pulses) {
    p.t += dt * p.speed;
    if (p.t > 1) resetPulse(p);
    const pos = pointOnBeam(p, time);
    drawPulse(pos.x, pos.y, p.radius * (0.7 + p.t * 0.7), b.angle, Math.sin(p.t * Math.PI) * 0.9, p.twist + time * 0.5);
  }

  for (const s of sparks) {
    s.t += dt * s.speed;
    if (s.t > 1) resetSpark(s);
    const pos = pointOnBeam(s, time);
    drawSpark(pos.x, pos.y, s.size, Math.sin(s.t * Math.PI) * 0.82);
  }

  for (const s of scales) {
    s.t += dt * s.speed;
    if (s.t > 1) resetScale(s);
    const pos = pointOnBeam(s, time);
    drawScale(pos.x, pos.y, s.size, s.spin + time * s.spinSpeed, Math.sin(s.t * Math.PI) * 0.58);
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
