const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".snarl-canvas");
const ctx = canvas.getContext("2d");

let waves = [];
let wisps = [];
let shards = [];
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
    start: { x: rect.width * 0.31, y: rect.height * 0.58 },
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

function resetWave(w, burst = false) {
  const pts = points();
  w.t = burst ? rand(0, 1) : 0;
  w.speed = rand(0.5, 0.92);
  w.offset = rand(-26, 26) * pts.scale;
  w.radius = rand(30, 72) * pts.scale;
  w.phase = rand(0, Math.PI * 2);
}

function resetWisp(w, burst = false) {
  const pts = points();
  w.t = burst ? rand(0, 1) : 0;
  w.speed = rand(0.6, 1.2);
  w.offset = rand(-74, 74) * pts.scale;
  w.size = rand(16, 42) * pts.scale;
  w.phase = rand(0, Math.PI * 2);
}

function resetShard(s, burst = false) {
  const pts = points();
  s.t = burst ? rand(0, 1) : 0;
  s.speed = rand(0.8, 1.5);
  s.offset = rand(-44, 44) * pts.scale;
  s.size = rand(8, 18) * pts.scale;
  s.spin = rand(0, Math.PI * 2);
  s.spinSpeed = rand(4, 9);
}

function init() {
  setupCanvas();
  waves = Array.from({ length: 8 }, () => {
    const w = {};
    resetWave(w, true);
    return w;
  });
  wisps = Array.from({ length: 34 }, () => {
    const w = {};
    resetWisp(w, true);
    return w;
  });
  shards = Array.from({ length: 24 }, () => {
    const s = {};
    resetShard(s, true);
    return s;
  });
}

function pointOnBeam(item, time) {
  const b = basis();
  const tremble = Math.sin(time * 16 + item.phase + item.t * 18) * 12 * b.scale;
  return {
    x: b.start.x + b.dx * item.t + b.nx * (item.offset + tremble),
    y: b.start.y + b.dy * item.t + b.ny * (item.offset + tremble)
  };
}

function drawWave(x, y, radius, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1.5, 0.58);
  ctx.strokeStyle = `rgba(185,160,255,${alpha})`;
  ctx.lineWidth = Math.max(5, radius * 0.14);
  ctx.beginPath();
  ctx.arc(0, 0, radius, -Math.PI * 0.82, Math.PI * 0.82);
  ctx.stroke();
  ctx.strokeStyle = `rgba(10,8,18,${alpha * 0.55})`;
  ctx.lineWidth = Math.max(3, radius * 0.08);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.78, -Math.PI * 0.72, Math.PI * 0.72);
  ctx.stroke();
  ctx.restore();
}

function drawWisp(x, y, size, alpha) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
  grad.addColorStop(0, `rgba(236,224,255,${alpha * 0.55})`);
  grad.addColorStop(0.45, `rgba(139,92,246,${alpha * 0.38})`);
  grad.addColorStop(1, "rgba(10,8,18,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, size * 1.35, size * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawShard(x, y, size, angle, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = `rgba(185,160,255,${alpha})`;
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.65})`;
  ctx.lineWidth = Math.max(1, size * 0.1);
  ctx.beginPath();
  ctx.moveTo(-size, -size * 0.16);
  ctx.lineTo(size * 0.32, -size * 0.5);
  ctx.lineTo(size, size * 0.16);
  ctx.lineTo(-size * 0.28, size * 0.48);
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

  for (const w of wisps) {
    w.t += dt * w.speed;
    if (w.t > 1) resetWisp(w);
    const pos = pointOnBeam(w, time);
    drawWisp(pos.x, pos.y, w.size, Math.sin(w.t * Math.PI) * 0.72);
  }

  for (const w of waves) {
    w.t += dt * w.speed;
    if (w.t > 1) resetWave(w);
    const pos = pointOnBeam(w, time);
    drawWave(pos.x, pos.y, w.radius * (0.65 + w.t * 0.85), b.angle, Math.sin(w.t * Math.PI) * 0.88);
  }

  for (const s of shards) {
    s.t += dt * s.speed;
    if (s.t > 1) resetShard(s);
    const pos = pointOnBeam(s, time);
    drawShard(pos.x, pos.y, s.size, s.spin + time * s.spinSpeed, Math.sin(s.t * Math.PI) * 0.66);
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
