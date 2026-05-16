const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".bubble-canvas");
const ctx = canvas.getContext("2d");

let bubbles = [];
let bursts = [];
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
    end: { x: rect.width * 0.78, y: rect.height * 0.42 },
    scale: rect.width / 920
  };
}

function resetBubble(b, burst = false) {
  const pts = points();
  b.t = burst ? rand(0, 1) : 0;
  b.speed = rand(0.42, 0.9);
  b.offset = rand(-48, 48) * pts.scale;
  b.radius = rand(8, 24) * pts.scale;
  b.phase = rand(0, Math.PI * 2);
  b.wobble = rand(10, 26) * pts.scale;
  b.alpha = rand(0.58, 0.95);
}

function resetBurst(p, burst = false) {
  const pts = points();
  p.t = burst ? rand(0, 1) : 0;
  p.speed = rand(0.55, 1.1);
  p.x = pts.end.x + rand(-54, 54) * pts.scale;
  p.y = pts.end.y + rand(-42, 50) * pts.scale;
  p.radius = rand(5, 18) * pts.scale;
  p.driftX = rand(-42, 42) * pts.scale;
  p.driftY = rand(-54, 34) * pts.scale;
}

function init() {
  setupCanvas();
  bubbles = Array.from({ length: 42 }, () => {
    const b = {};
    resetBubble(b, true);
    return b;
  });
  bursts = Array.from({ length: 34 }, () => {
    const p = {};
    resetBurst(p, true);
    return p;
  });
}

function beamPoint(item, time) {
  const pts = points();
  const dx = pts.end.x - pts.start.x;
  const dy = pts.end.y - pts.start.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bob = Math.sin(time * 5 + item.phase + item.t * 8) * item.wobble;
  return {
    x: pts.start.x + dx * item.t + nx * (item.offset + bob),
    y: pts.start.y + dy * item.t + ny * (item.offset + bob) - Math.sin(item.t * Math.PI) * 18 * pts.scale
  };
}

function drawBubble(x, y, r, alpha) {
  const grad = ctx.createRadialGradient(x - r * 0.28, y - r * 0.32, 0, x, y, r);
  grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.92})`);
  grad.addColorStop(0.18, `rgba(223,250,255,${alpha * 0.28})`);
  grad.addColorStop(0.72, `rgba(97,217,255,${alpha * 0.18})`);
  grad.addColorStop(1, `rgba(47,156,255,${alpha * 0.04})`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(223,250,255,${alpha * 0.82})`;
  ctx.lineWidth = Math.max(1.5, r * 0.12);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x - r * 0.32, y - r * 0.38, r * 0.22, r * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawFrame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const pts = points();
  const time = now / 1000;
  ctx.clearRect(0, 0, pts.rect.width, pts.rect.height);
  ctx.globalCompositeOperation = "lighter";

  for (const b of bubbles) {
    b.t += dt * b.speed;
    if (b.t > 1) resetBubble(b);
    const pos = beamPoint(b, time);
    const fade = Math.min(1, b.t / 0.16) * Math.max(0, 1 - Math.max(0, b.t - 0.82) / 0.18);
    drawBubble(pos.x, pos.y, b.radius * (0.82 + Math.sin(b.t * Math.PI) * 0.18), b.alpha * fade);
  }

  for (const p of bursts) {
    p.t += dt * p.speed;
    if (p.t > 1) resetBurst(p);
    const alpha = Math.sin(p.t * Math.PI) * 0.75;
    drawBubble(
      p.x + p.driftX * p.t,
      p.y + p.driftY * p.t,
      p.radius * (0.5 + p.t * 0.9),
      alpha
    );
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(drawFrame);
