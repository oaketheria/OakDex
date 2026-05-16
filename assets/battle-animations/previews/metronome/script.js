const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".metronome-canvas");
const ctx = canvas.getContext("2d");

let notes = [];
let stars = [];
let bolts = [];
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
    start: { x: rect.width * 0.3, y: rect.height * 0.52 },
    end: { x: rect.width * 0.78, y: rect.height * 0.42 },
    scale: rect.width / 920
  };
}

function resetNote(n, burst = false) {
  const pts = points();
  n.t = burst ? rand(0, 1) : 0;
  n.speed = rand(0.28, 0.56);
  n.radius = rand(34, 108) * pts.scale;
  n.angle = rand(0, Math.PI * 2);
  n.spin = rand(-1.8, 1.8);
  n.size = rand(16, 26) * pts.scale;
  n.symbol = Math.random() > 0.5 ? "♪" : "?";
}

function resetStar(s, burst = false) {
  const pts = points();
  s.t = burst ? rand(0, 1) : 0;
  s.speed = rand(0.5, 1.1);
  s.offset = rand(-70, 70) * pts.scale;
  s.size = rand(6, 13) * pts.scale;
  s.phase = rand(0, Math.PI * 2);
}

function resetBolt(b, burst = false) {
  const pts = points();
  b.t = burst ? rand(0.46, 1) : 0;
  b.speed = rand(0.9, 1.5);
  b.offset = rand(-36, 36) * pts.scale;
  b.size = rand(7, 15) * pts.scale;
  b.phase = rand(0, Math.PI * 2);
}

function init() {
  setupCanvas();
  notes = Array.from({ length: 12 }, () => {
    const n = {};
    resetNote(n, true);
    return n;
  });
  stars = Array.from({ length: 42 }, () => {
    const s = {};
    resetStar(s, true);
    return s;
  });
  bolts = Array.from({ length: 18 }, () => {
    const b = {};
    resetBolt(b, true);
    return b;
  });
}

function basis() {
  const pts = points();
  const dx = pts.end.x - pts.start.x;
  const dy = pts.end.y - pts.start.y;
  const len = Math.hypot(dx, dy) || 1;
  return { ...pts, dx, dy, len, nx: -dy / len, ny: dx / len };
}

function pointOnBeam(item, time) {
  const b = basis();
  const wobble = Math.sin(time * 10 + item.phase + item.t * 12) * 10 * b.scale;
  return {
    x: b.start.x + b.dx * item.t + b.nx * (item.offset + wobble),
    y: b.start.y + b.dy * item.t + b.ny * (item.offset + wobble)
  };
}

function drawStar(x, y, size, alpha, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = `rgba(255, 246, 181, ${alpha})`;
  ctx.strokeStyle = `rgba(106, 240, 193, ${alpha * 0.8})`;
  ctx.lineWidth = Math.max(1, size * 0.12);
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? size : size * 0.42;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawBolt(x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = `rgba(255, 219, 84, ${alpha})`;
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-size * 0.2, -size);
  ctx.lineTo(size * 0.55, -size * 0.1);
  ctx.lineTo(size * 0.12, -size * 0.1);
  ctx.lineTo(size * 0.34, size);
  ctx.lineTo(-size * 0.58, -size * 0.02);
  ctx.lineTo(-size * 0.12, -size * 0.02);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawFrame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const pts = points();
  const time = now / 1000;
  ctx.clearRect(0, 0, pts.rect.width, pts.rect.height);
  ctx.globalCompositeOperation = "lighter";

  for (const n of notes) {
    n.t += dt * n.speed;
    if (n.t > 1) resetNote(n);
    const swirl = n.angle + time * n.spin + n.t * Math.PI * 2.4;
    const radius = n.radius * (1 - n.t * 0.35);
    const x = pts.start.x + Math.cos(swirl) * radius;
    const y = pts.start.y + Math.sin(swirl) * radius * 0.58 - n.t * 24 * pts.scale;
    const alpha = Math.sin(n.t * Math.PI) * 0.9;
    ctx.font = `900 ${n.size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(255, 246, 181, ${alpha})`;
    ctx.strokeStyle = `rgba(106, 240, 193, ${alpha * 0.7})`;
    ctx.lineWidth = 3;
    ctx.strokeText(n.symbol, x, y);
    ctx.fillText(n.symbol, x, y);
  }

  for (const s of stars) {
    s.t += dt * s.speed;
    if (s.t > 1) resetStar(s);
    const pos = pointOnBeam(s, time);
    drawStar(pos.x, pos.y, s.size, Math.sin(s.t * Math.PI) * 0.82, time * 2 + s.phase);
  }

  for (const b of bolts) {
    b.t += dt * b.speed;
    if (b.t > 1) resetBolt(b);
    const pos = pointOnBeam(b, time);
    drawBolt(pos.x, pos.y, b.size, Math.sin(b.t * Math.PI) * 0.9);
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
