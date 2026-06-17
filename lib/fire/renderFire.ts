export type FireParticleKind = "flame" | "ember" | "spark" | "smoke";

export type FireParticle = {
  kind: FireParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
  wobble: number;
  wobbleSpeed: number;
};

export type FireRenderParams = {
  width: number;
  height: number;
  health: number;
  spreadMultiplier: number;
  time: number;
};

const MAX_PARTICLES = 200;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function spawnFireParticles(
  particles: FireParticle[],
  params: FireRenderParams,
) {
  const intensity = params.health / 100;
  if (intensity <= 0.05) return;

  const baseX = params.width / 2;
  const baseY = params.height - 36;
  const spread = (30 + intensity * 55) * params.spreadMultiplier;

  const flameCount = Math.floor(intensity * 5 * params.spreadMultiplier) + 1;
  for (let i = 0; i < flameCount && particles.length < MAX_PARTICLES; i++) {
    particles.push({
      kind: "flame",
      x: baseX + rand(-spread, spread),
      y: baseY + rand(-6, 4),
      vx: rand(-0.8, 0.8) * params.spreadMultiplier,
      vy: rand(-3.2, -1.4) * (0.4 + intensity),
      life: 0,
      maxLife: rand(35, 70) * (0.5 + intensity * 0.6),
      size: rand(4, 14) * (0.5 + intensity),
      hue: rand(15, 40),
      saturation: rand(85, 100),
      lightness: rand(48, 62),
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.06, 0.14),
    });
  }

  if (intensity > 0.25 && Math.random() < intensity * 0.35) {
    particles.push({
      kind: "ember",
      x: baseX + rand(-spread * 1.2, spread * 1.2),
      y: baseY + rand(-20, 0),
      vx: rand(-1.5, 1.5),
      vy: rand(-2.5, -0.8),
      life: 0,
      maxLife: rand(60, 140),
      size: rand(1, 2.5),
      hue: rand(10, 30),
      saturation: 100,
      lightness: rand(55, 70),
      wobble: 0,
      wobbleSpeed: 0,
    });
  }

  if (intensity > 0.5 && Math.random() < intensity * 0.12) {
    particles.push({
      kind: "spark",
      x: baseX + rand(-spread * 0.6, spread * 0.6),
      y: baseY - rand(0, 30),
      vx: rand(-3, 3),
      vy: rand(-5, -2),
      life: 0,
      maxLife: rand(15, 35),
      size: rand(1, 2),
      hue: 45,
      saturation: 100,
      lightness: 80,
      wobble: 0,
      wobbleSpeed: 0,
    });
  }

  if (intensity > 0.65 && Math.random() < 0.08) {
    particles.push({
      kind: "smoke",
      x: baseX + rand(-spread * 0.5, spread * 0.5),
      y: baseY - rand(40, 80),
      vx: rand(-0.4, 0.4),
      vy: rand(-1.2, -0.4),
      life: 0,
      maxLife: rand(80, 160),
      size: rand(8, 18),
      hue: 0,
      saturation: 0,
      lightness: 30,
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.02, 0.05),
    });
  }
}

function drawLogs(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const baseY = height - 28;
  const logs = [
    { x: width / 2 - 55, y: baseY, w: 90, h: 14, rot: -0.08 },
    { x: width / 2 - 10, y: baseY + 8, w: 80, h: 12, rot: 0.12 },
    { x: width / 2 - 40, y: baseY + 16, w: 70, h: 11, rot: -0.2 },
  ];

  for (const log of logs) {
    ctx.save();
    ctx.translate(log.x + log.w / 2, log.y + log.h / 2);
    ctx.rotate(log.rot);

    const grad = ctx.createLinearGradient(-log.w / 2, 0, log.w / 2, 0);
    grad.addColorStop(0, "#3d2010");
    grad.addColorStop(0.3, "#5c3317");
    grad.addColorStop(0.7, "#4a2812");
    grad.addColorStop(1, "#2a1508");

    ctx.beginPath();
    ctx.roundRect(-log.w / 2, -log.h / 2, log.w, log.h, 4);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

function drawHeatGlow(
  ctx: CanvasRenderingContext2D,
  params: FireRenderParams,
) {
  const intensity = params.health / 100;
  if (intensity <= 0.05) return;

  const pulse = 1 + Math.sin(params.time * 0.003) * 0.08;
  const cx = params.width / 2;
  const cy = params.height - 20;
  const radius = (80 + intensity * 100) * params.spreadMultiplier * pulse;

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  glow.addColorStop(0, `rgba(255, 120, 40, ${intensity * 0.35})`);
  glow.addColorStop(0.4, `rgba(255, 69, 0, ${intensity * 0.15})`);
  glow.addColorStop(1, "rgba(255, 69, 0, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, params.width, params.height);
}

function updateAndDrawParticle(
  ctx: CanvasRenderingContext2D,
  particle: FireParticle,
  intensity: number,
) {
  particle.life += 1;
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.wobble += particle.wobbleSpeed;

  const lifeRatio = 1 - particle.life / particle.maxLife;
  if (lifeRatio <= 0) return false;

  if (particle.kind === "flame") {
    particle.vy -= 0.025 * intensity;
    particle.vx += Math.sin(particle.wobble) * 0.08;
    particle.vx *= 0.985;

    const alpha = lifeRatio * intensity * 0.85;
    const size = particle.size * lifeRatio;

    const grad = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      size,
    );
    grad.addColorStop(0, `hsla(${particle.hue + 15}, ${particle.saturation}%, ${particle.lightness + 15}%, ${alpha})`);
    grad.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${alpha * 0.7})`);
    grad.addColorStop(1, `hsla(${particle.hue - 10}, 90%, 40%, 0)`);

    ctx.beginPath();
    ctx.ellipse(
      particle.x + Math.sin(particle.wobble) * 3,
      particle.y,
      size * 0.7,
      size,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = grad;
    ctx.fill();
  } else if (particle.kind === "ember") {
    particle.vy += 0.01;
    particle.vx *= 0.99;

    const alpha = lifeRatio * intensity;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, ${alpha})`;
    ctx.fill();

    if (lifeRatio > 0.5) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsla(25, 100%, 50%, ${alpha * 0.5})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  } else if (particle.kind === "spark") {
    particle.vy += 0.04;
    const alpha = lifeRatio;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2);
    ctx.strokeStyle = `hsla(50, 100%, 75%, ${alpha})`;
    ctx.lineWidth = particle.size;
    ctx.stroke();
  } else if (particle.kind === "smoke") {
    particle.vx += Math.sin(particle.wobble) * 0.03;
    particle.vy -= 0.005;
    const alpha = lifeRatio * 0.12 * intensity;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * (1 + (1 - lifeRatio) * 0.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(80, 70, 65, ${alpha})`;
    ctx.fill();
  }

  return true;
}

export function renderFireFrame(
  ctx: CanvasRenderingContext2D,
  particles: FireParticle[],
  params: FireRenderParams,
) {
  const intensity = params.health / 100;

  ctx.clearRect(0, 0, params.width, params.height);

  const bgGrad = ctx.createLinearGradient(0, params.height, 0, 0);
  bgGrad.addColorStop(0, "rgba(60, 20, 5, 0.4)");
  bgGrad.addColorStop(0.35, "rgba(30, 10, 3, 0.15)");
  bgGrad.addColorStop(1, "transparent");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, params.width, params.height);

  drawLogs(ctx, params.width, params.height);
  drawHeatGlow(ctx, params);

  spawnFireParticles(particles, params);

  for (let i = particles.length - 1; i >= 0; i--) {
    const alive = updateAndDrawParticle(ctx, particles[i], intensity);
    if (!alive) particles.splice(i, 1);
  }

  if (intensity > 0.1) {
    const cx = params.width / 2;
    const cy = params.height - 14;
    const coalGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50 * params.spreadMultiplier);
    coalGrad.addColorStop(0, `rgba(255, 80, 20, ${intensity * 0.5})`);
    coalGrad.addColorStop(0.5, `rgba(200, 40, 0, ${intensity * 0.25})`);
    coalGrad.addColorStop(1, "rgba(100, 20, 0, 0)");
    ctx.fillStyle = coalGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 45 * params.spreadMultiplier, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function createParticlePool(): FireParticle[] {
  return [];
}
