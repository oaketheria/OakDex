const scene = document.querySelector(".battle-scene");
const canvas = document.querySelector(".dragon-tail-canvas");
const ctx = canvas.getContext("2d");

function setupCanvas() {
  const rect = scene.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function cubic(p0, p1, p2, p3, t) {
  const m = 1 - t;
  return {
    x: m ** 3 * p0.x + 3 * m * m * t * p1.x + 3 * m * t * t * p2.x + t ** 3 * p3.x,
    y: m ** 3 * p0.y + 3 * m * m * t * p1.y + 3 * m * t * t * p2.y + t ** 3 * p3.y
  };
}

function tangentNormal(points, i) {
  const a = points[Math.max(0, i - 1)];
  const b = points[Math.min(points.length - 1, i + 1)];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { tx: dx / len, ty: dy / len, nx: -dy / len, ny: dx / len, angle: Math.atan2(dy, dx) };
}

function drawScaleDiamond(x, y, angle, w, h, alpha, warm = false) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  const grad = ctx.createLinearGradient(0, -h, 0, h);
  grad.addColorStop(0, warm ? "#6b2a28" : "#3b3f50");
  grad.addColorStop(0.5, warm ? "#321a22" : "#161b28");
  grad.addColorStop(1, warm ? "#0c0b12" : "#090b12");
  ctx.fillStyle = grad;
  ctx.strokeStyle = warm ? "rgba(157,70,57,0.55)" : "rgba(141,151,176,0.35)";
  ctx.lineWidth = Math.max(0.8, w * 0.1);
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(w, 0);
  ctx.lineTo(0, h);
  ctx.lineTo(-w, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRidgeSpike(x, y, angle, size, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  const grad = ctx.createLinearGradient(0, -size, 0, size);
  grad.addColorStop(0, "#c34738");
  grad.addColorStop(0.5, "#6d1f25");
  grad.addColorStop(1, "#170b12");
  ctx.fillStyle = grad;
  ctx.strokeStyle = "rgba(15,8,10,0.9)";
  ctx.lineWidth = Math.max(1, size * 0.1);
  ctx.beginPath();
  ctx.moveTo(0, -size * 1.18);
  ctx.bezierCurveTo(size * 0.55, -size * 0.22, size * 0.3, size * 0.36, 0, size * 0.54);
  ctx.bezierCurveTo(-size * 0.22, size * 0.18, -size * 0.32, -size * 0.45, 0, -size * 1.18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTail(now) {
  const rect = scene.getBoundingClientRect();
  const s = rect.width / 920 * 0.38;
  const cycle = (now / 1000 % 1.18) / 1.18;
  const alpha = Math.sin(cycle * Math.PI);
  ctx.clearRect(0, 0, rect.width, rect.height);
  if (alpha <= 0.02) return;

  const hit = ease(Math.min(1, cycle * 1.22));
  const recoil = cycle > 0.6 ? ease((cycle - 0.6) / 0.4) : 0;
  const p0 = { x: rect.width * (0.88 + 0.008 * recoil), y: rect.height * (0.5 + 0.01 * recoil) };
  const p1 = { x: rect.width * (0.83 - 0.012 * hit), y: rect.height * (0.55 - 0.03 * hit) };
  const p2 = { x: rect.width * (0.76 - 0.012 * hit), y: rect.height * (0.47 + 0.008 * recoil) };
  const p3 = { x: rect.width * (0.84 - 0.004 * recoil), y: rect.height * (0.39 + 0.012 * recoil) };

  const points = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const p = cubic(p0, p1, p2, p3, t);
    const curl = Math.sin((t * 2.1 + hit * 0.6) * Math.PI) * 5 * s * (1 - t * 0.3);
    return { x: p.x, y: p.y + curl };
  });

  const top = [];
  const bottom = [];
  points.forEach((p, i) => {
    const t = i / 39;
    const n = tangentNormal(points, i);
    const w = (30 * Math.pow(1 - t, 0.78) + 7) * s;
    top.push({ x: p.x + n.nx * w, y: p.y + n.ny * w, t, w, n });
    bottom.push({ x: p.x - n.nx * w, y: p.y - n.ny * w, t, w, n });
  });

  ctx.save();
  ctx.globalAlpha = alpha * 0.36;
  ctx.fillStyle = "rgba(0,0,0,0.36)";
  ctx.beginPath();
  ctx.ellipse(points[16].x, points[16].y + 48 * s, 112 * s, 24 * s, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const body = ctx.createLinearGradient(p0.x, p0.y, p3.x, p3.y);
  body.addColorStop(0, "#260c10");
  body.addColorStop(0.2, "#4a171b");
  body.addColorStop(0.52, "#1a1820");
  body.addColorStop(0.8, "#343846");
  body.addColorStop(1, "#812923");

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = body;
  ctx.strokeStyle = "rgba(5,5,9,0.96)";
  ctx.lineWidth = 4 * s;
  ctx.lineJoin = "round";
  ctx.beginPath();
  top.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  bottom.slice().reverse().forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  for (let i = 3; i < points.length - 3; i += 2) {
    const p = points[i];
    const n = tangentNormal(points, i);
    const t = i / 39;
    const centerW = (8 * (1 - t) + 3) * s;
    drawScaleDiamond(p.x, p.y, n.angle + Math.PI / 2, centerW, centerW * 0.72, alpha * 0.85, i % 4 === 0);
    if (i % 4 === 1) {
      drawScaleDiamond(p.x + n.nx * (12 * (1 - t) + 4) * s, p.y + n.ny * (12 * (1 - t) + 4) * s, n.angle + Math.PI / 2, centerW * 0.75, centerW * 0.55, alpha * 0.62, false);
      drawScaleDiamond(p.x - n.nx * (12 * (1 - t) + 4) * s, p.y - n.ny * (12 * (1 - t) + 4) * s, n.angle + Math.PI / 2, centerW * 0.75, centerW * 0.55, alpha * 0.56, true);
    }
  }

  for (let i = 4; i < points.length - 4; i += 4) {
    const p = points[i];
    const n = tangentNormal(points, i);
    const t = i / 39;
    const ridgeOffset = (30 * Math.pow(1 - t, 0.78) + 7) * s * 0.92;
    drawRidgeSpike(
      p.x + n.nx * ridgeOffset,
      p.y + n.ny * ridgeOffset,
      n.angle - Math.PI / 2,
      (18 * (1 - t) + 8) * s,
      alpha
    );
  }

  const tip = points.at(-1);
  const nt = tangentNormal(points, points.length - 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(tip.x, tip.y);
  ctx.rotate(nt.angle);
  const fin = ctx.createLinearGradient(-12 * s, 0, 58 * s, 0);
  fin.addColorStop(0, "#2a1115");
  fin.addColorStop(0.45, "#8f2b28");
  fin.addColorStop(1, "#d94b39");
  ctx.fillStyle = fin;
  ctx.strokeStyle = "rgba(8,5,7,0.95)";
  ctx.lineWidth = 3 * s;
  ctx.beginPath();
  ctx.moveTo(-8 * s, -18 * s);
  ctx.bezierCurveTo(18 * s, -36 * s, 52 * s, -18 * s, 64 * s, 0);
  ctx.bezierCurveTo(52 * s, 18 * s, 18 * s, 36 * s, -8 * s, 18 * s);
  ctx.bezierCurveTo(6 * s, 8 * s, 6 * s, -8 * s, -8 * s, -18 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function frame(now) {
  drawTail(now);
  requestAnimationFrame(frame);
}

window.addEventListener("resize", setupCanvas);
setupCanvas();
requestAnimationFrame(frame);
