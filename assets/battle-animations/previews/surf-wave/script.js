const scene = document.querySelector(".battle-scene");
const surfCanvas = document.querySelector(".surf-canvas");
const splashCanvas = document.querySelector(".splash-canvas");
const surfCtx = surfCanvas.getContext("2d");
const splashCtx = splashCanvas.getContext("2d");

let droplets = [];
let foam = [];
let last = performance.now();

function setupCanvas(canvas, ctx) {
  const rect = scene.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resize() {
  setupCanvas(surfCanvas, surfCtx);
  setupCanvas(splashCanvas, splashCtx);
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function targetPoint() {
  const rect = scene.getBoundingClientRect();
  return {
    x: rect.width * 0.78,
    y: rect.height * 0.43,
    scale: rect.width / 920
  };
}

function resetDroplet(d, burst = false) {
  const p = targetPoint();
  d.t = burst ? rand(0, 1) : 0;
  d.speed = rand(0.65, 1.35);
  d.angle = rand(-Math.PI * 0.86, -Math.PI * 0.1);
  d.distance = rand(48, 142) * p.scale;
  d.size = rand(3, 9) * p.scale;
  d.startX = p.x + rand(18, 88) * p.scale;
  d.startY = p.y + rand(-76, -12) * p.scale;
}

function resetFoam(f, burst = false) {
  const p = targetPoint();
  f.t = burst ? rand(0, 1) : 0;
  f.speed = rand(0.55, 1.05);
  f.x = p.x + rand(-92, 98) * p.scale;
  f.y = p.y + rand(-34, 66) * p.scale;
  f.r = rand(5, 18) * p.scale;
  f.drift = rand(-28, 34) * p.scale;
}

function init() {
  resize();
  droplets = Array.from({ length: 52 }, () => {
    const d = {};
    resetDroplet(d, true);
    return d;
  });
  foam = Array.from({ length: 44 }, () => {
    const f = {};
    resetFoam(f, true);
    return f;
  });
}

function easedCycle(time) {
  return (time % 1.35) / 1.35;
}

function drawWave(ctx, now, rect) {
  const p = targetPoint();
  const cycle = easedCycle(now / 1000);
  const pool = Math.min(1, Math.max(0, cycle / 0.18));
  const rise = Math.min(1, Math.max(0, (cycle - 0.1) / 0.34));
  const curl = Math.min(1, Math.max(0, (cycle - 0.32) / 0.32));
  const crash = Math.min(1, Math.max(0, (cycle - 0.58) / 0.24));
  const fade = Math.max(0, 1 - Math.max(0, cycle - 0.82) / 0.18);
  const width = (250 + 42 * rise) * p.scale;
  const height = (32 + 142 * rise) * p.scale;
  const baseY = p.y + 82 * p.scale;
  const left = p.x - width * 0.66;
  const right = p.x + width * 0.42;
  const lipX = left + width * (0.68 + 0.05 * curl);
  const lipY = baseY - height * (0.84 + 0.08 * curl);
  const tubeX = left + width * (0.78 + 0.04 * curl);
  const tubeY = baseY - height * (0.58 - 0.04 * crash);

  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.globalCompositeOperation = "source-over";

  const poolGrad = ctx.createRadialGradient(p.x, baseY, 6, p.x, baseY, width * 0.78);
  poolGrad.addColorStop(0, `rgba(223,250,255,${0.52 * fade})`);
  poolGrad.addColorStop(0.36, `rgba(97,217,255,${0.44 * fade})`);
  poolGrad.addColorStop(1, "rgba(47,156,255,0)");
  ctx.fillStyle = poolGrad;
  ctx.beginPath();
  ctx.ellipse(p.x, baseY, width * 0.62 * pool, 38 * p.scale * pool, 0, 0, Math.PI * 2);
  ctx.fill();

  const waveGrad = ctx.createLinearGradient(left, lipY, right, baseY);
  waveGrad.addColorStop(0, `rgba(142,234,255,${0.92 * fade})`);
  waveGrad.addColorStop(0.34, `rgba(47,156,255,${0.94 * fade})`);
  waveGrad.addColorStop(0.76, `rgba(0,111,206,${0.9 * fade})`);
  waveGrad.addColorStop(1, `rgba(0,67,142,${0.68 * fade})`);
  ctx.fillStyle = waveGrad;

  ctx.save();
  ctx.scale(rise || 0.001, 1);
  ctx.translate(left * (1 / Math.max(rise, 0.001) - 1), 0);
  ctx.beginPath();
  ctx.moveTo(left, baseY + 12 * p.scale);
  ctx.bezierCurveTo(left + width * 0.1, baseY - height * 0.2, left + width * 0.34, baseY - height * 0.58, lipX, lipY);
  ctx.bezierCurveTo(lipX + width * 0.14, lipY - height * 0.12, right + width * 0.04, lipY + height * 0.12, tubeX, tubeY);
  ctx.bezierCurveTo(tubeX - width * 0.02, tubeY + height * 0.28, right - width * 0.18, baseY + 22 * p.scale, left + width * 0.08, baseY + 24 * p.scale);
  ctx.bezierCurveTo(left + width * 0.02, baseY + 20 * p.scale, left, baseY + 16 * p.scale, left, baseY + 12 * p.scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.globalCompositeOperation = "source-over";
  const tubeGrad = ctx.createRadialGradient(tubeX - width * 0.03, tubeY, 6, tubeX - width * 0.03, tubeY, width * 0.18);
  tubeGrad.addColorStop(0, `rgba(255,255,255,${0.86 * fade * curl})`);
  tubeGrad.addColorStop(0.36, `rgba(223,250,255,${0.72 * fade * curl})`);
  tubeGrad.addColorStop(0.56, `rgba(97,217,255,${0.42 * fade * curl})`);
  tubeGrad.addColorStop(1, "rgba(47,156,255,0)");
  ctx.fillStyle = tubeGrad;
  ctx.beginPath();
  ctx.ellipse(tubeX - width * 0.04, tubeY, width * 0.17 * curl, height * 0.24 * curl, -0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `rgba(255,255,255,${0.78 * fade})`;
  ctx.lineWidth = 12 * p.scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lipX - width * 0.16, lipY + height * 0.06);
  ctx.bezierCurveTo(lipX - width * 0.02, lipY - height * 0.12, lipX + width * 0.18, lipY - height * 0.04, tubeX, tubeY);
  ctx.bezierCurveTo(tubeX + width * 0.08, tubeY + height * 0.16, tubeX - width * 0.05, tubeY + height * 0.3, tubeX - width * 0.16, tubeY + height * 0.2);
  ctx.stroke();

  ctx.fillStyle = `rgba(255,255,255,${0.88 * fade * curl})`;
  for (let i = 0; i < 9; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      tubeX + Math.sin(now / 120 + i) * 34 * p.scale,
      tubeY + height * 0.12 + i * 5 * p.scale,
      rand(10, 24) * p.scale * curl,
      rand(5, 14) * p.scale * curl,
      rand(-0.5, 0.5),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.strokeStyle = `rgba(223,250,255,${0.54 * fade})`;
  ctx.lineWidth = 4 * p.scale;
  for (let i = 0; i < 4; i += 1) {
    const yy = baseY - height * (0.14 + i * 0.12);
    ctx.beginPath();
    ctx.moveTo(left + width * (0.1 + i * 0.04), yy);
    ctx.bezierCurveTo(left + width * 0.32, yy - 16 * p.scale, left + width * 0.54, yy + 12 * p.scale, left + width * 0.76, yy - 8 * p.scale);
    ctx.stroke();
  }

  if (crash > 0) {
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(255,255,255,${0.58 * fade * crash})`;
    for (let i = 0; i < 16; i += 1) {
      const x = tubeX + width * 0.05 * crash + Math.sin(now / 130 + i) * 82 * p.scale * crash;
      const y = tubeY + height * 0.24 + (Math.cos(now / 150 + i) * 24 + i * 3) * p.scale;
      ctx.beginPath();
      ctx.ellipse(x, y, rand(8, 22) * p.scale, rand(4, 10) * p.scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawSplashes(ctx, dt, rect) {
  const p = targetPoint();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.globalCompositeOperation = "lighter";

  for (const f of foam) {
    f.t += dt * f.speed;
    if (f.t > 1) resetFoam(f);
    const alpha = Math.sin(f.t * Math.PI) * 0.62;
    ctx.fillStyle = `rgba(236,252,255,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(f.x + f.drift * f.t, f.y + Math.sin(f.t * Math.PI) * -18 * p.scale, f.r, f.r * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const d of droplets) {
    d.t += dt * d.speed;
    if (d.t > 1) resetDroplet(d);
    const alpha = Math.sin(d.t * Math.PI);
    const x = d.startX + Math.cos(d.angle) * d.distance * d.t;
    const y = d.startY + Math.sin(d.angle) * d.distance * d.t + 96 * p.scale * d.t * d.t;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, d.size);
    grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(0.46, `rgba(142,234,255,${alpha * 0.85})`);
    grad.addColorStop(1, "rgba(47,156,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, d.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function frame(now) {
  const dt = Math.min(32, now - last) / 1000;
  last = now;
  const rect = scene.getBoundingClientRect();
  drawWave(surfCtx, now, rect);
  drawSplashes(splashCtx, dt, rect);
  requestAnimationFrame(frame);
}

window.addEventListener("resize", init);
init();
requestAnimationFrame(frame);
