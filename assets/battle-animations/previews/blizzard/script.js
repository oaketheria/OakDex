const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".blizzard-canvas");
const ctx = canvas.getContext("2d");

let snow = [];
let gusts = [];
let frost = [];
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
    start: { x: rect.width * 0.3, y: rect.height * 0.57 },
    end: { x: rect.width * 0.78, y: rect.height * 0.41 },
    scale: rect.width / 920
  };
}

function resetSnow(p, burst = false) {
  const pts = points();
  p.t = burst ? rand(0, 1) : 0;
  p.speed = rand(0.7, 1.55);
  p.offset = rand(-70, 70) * pts.scale;
  p.size = rand(2, 7) * pts.scale;
  p.spin = rand(0, Math.PI * 2);
  p.spinSpeed = rand(5, 12);
  p.alpha = rand(0.45, 0.95);
}

function resetGust(g, burst = false) {
  const pts = points();
  g.t = burst ? rand(0, 1) : 0;
  g.speed = rand(0.52, 1);
  g.offset = rand(-82, 82) * pts.scale;
  g.length = rand(80, 190) * pts.scale;
  g.width = rand(2, 5) * pts.scale;
  g.alpha = rand(0.16, 0.42);
}

function resetFrost(f, burst = false) {
  const pts = points();
  f.t = burst ? rand(0, 1) : 0;
  f.speed = rand(0.4, 0.85);
  f.x = pts.end.x + rand(-58, 58) * pts.scale;
  f.y = pts.end.y + rand(-50, 62) * pts.scale;
  f.r = rand(5, 18) * pts.scale;
  f.drift = rand(-10, 12) * pts.scale;
}

function init() {
  setupCanvas();
  snow = Array.from({ length: 150 }, () => {
    const p = {};
    resetSnow(p, true);
    return p;
  });
  gusts = Array.from({ length: 34 }, () => {
    const g = {};
    resetGust(g, true);
    return g;
  });
  frost = Array.from({ length: 44 }, () => {
    const f = {};
    resetFrost(f, true);
    return f;
  });
}

function beamPoint(item, time) {
  const pts = points();
  const dx = pts.end.x - pts.start.x;
  const dy = pts.end.y - pts.start.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const wobble = Math.sin(time * 7 + item.t * 11 + item.offset) * 14 * pts.scale;
  return {
    x: pts.start.x + dx * item.t + nx * (item.offset + wobble),
    y: pts.start.y + dy * item.t + ny * (item.offset + wobble)
  };
}

function drawSnowflake(x, y, r, spin, alpha) {
  ctx.strokeStyle = `rgba(240,252,255,${alpha})`;
  ctx.lineWidth = Math.max(1, r * 0.22);
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    const a = spin + i * Math.PI / 3;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x - Math.cos(a) * r, y - Math.sin(a) * r);
    ctx.stroke();
  }
}

function drawFrame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const pts = points();
  const time = now / 1000;
  ctx.clearRect(0, 0, pts.rect.width, pts.rect.height);
  ctx.globalCompositeOperation = "lighter";

  for (const g of gusts) {
    g.t += dt * g.speed;
    if (g.t > 1) resetGust(g);
    const pos = beamPoint(g, time);
    const dx = pts.end.x - pts.start.x;
    const dy = pts.end.y - pts.start.y;
    const angle = Math.atan2(dy, dx);
    const alpha = Math.sin(g.t * Math.PI) * g.alpha;
    const grad = ctx.createLinearGradient(
      pos.x - Math.cos(angle) * g.length * 0.5,
      pos.y - Math.sin(angle) * g.length * 0.5,
      pos.x + Math.cos(angle) * g.length * 0.5,
      pos.y + Math.sin(angle) * g.length * 0.5
    );
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, `rgba(230,250,255,${alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = g.width;
    ctx.beginPath();
    ctx.moveTo(pos.x - Math.cos(angle) * g.length * 0.5, pos.y - Math.sin(angle) * g.length * 0.5);
    ctx.lineTo(pos.x + Math.cos(angle) * g.length * 0.5, pos.y + Math.sin(angle) * g.length * 0.5);
    ctx.stroke();
  }

  for (const p of snow) {
    p.t += dt * p.speed;
    if (p.t > 1) resetSnow(p);
    const pos = beamPoint(p, time);
    const alpha = Math.sin(p.t * Math.PI) * p.alpha;
    drawSnowflake(pos.x, pos.y, p.size, p.spin + time * p.spinSpeed, alpha);
  }

  for (const f of frost) {
    f.t += dt * f.speed;
    if (f.t > 1) resetFrost(f);
    const alpha = Math.sin(f.t * Math.PI) * 0.56;
    const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
    grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(0.38, `rgba(202,248,255,${alpha * 0.72})`);
    grad.addColorStop(1, "rgba(88,190,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(f.x + f.drift * f.t, f.y - f.t * 22 * pts.scale, f.r * 1.2, f.r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
