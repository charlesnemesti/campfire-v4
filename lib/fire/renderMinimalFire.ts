import { getFirePalette } from "@/lib/fire/palette";
import {
  getRenderIntensity,
  getVolumeScale,
} from "@/lib/fire/volumeScale";

export type MinimalParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  wobble: number;
  wobbleSpeed: number;
};

export type MinimalFireParams = {
  width: number;
  height: number;
  health: number;
  volumePerHour: number;
  spreadMultiplier: number;
  time: number;
  frozen?: boolean;
};

const MAX_PARTICLES = 100;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function createMinimalParticlePool(): MinimalParticle[] {
  return [];
}

function applyPaletteAlpha(color: string, alpha: number): string {
  if (color.startsWith("rgba")) {
    return color.replace(/[\d.]+\)$/, `${alpha})`);
  }
  if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }
  return color;
}

function drawMinimalLogs(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: MinimalFireParams,
) {
  const baseY = height - 28;
  const logScale = getVolumeScale(params.volumePerHour) * params.spreadMultiplier;
  const logs = [
    { x: width / 2 - 58 * logScale, y: baseY, w: 116 * logScale, h: 12, rot: -0.06 },
    { x: width / 2 - 40 * logScale, y: baseY + 12, w: 88 * logScale, h: 10, rot: 0.1 },
  ];

  for (const log of logs) {
    ctx.save();
    ctx.translate(log.x + log.w / 2, log.y + log.h / 2);
    ctx.rotate(log.rot);

    const grad = ctx.createLinearGradient(-log.w / 2, 0, log.w / 2, 0);
    grad.addColorStop(0, "#2a1508");
    grad.addColorStop(0.5, "#4a2812");
    grad.addColorStop(1, "#2a1508");

    ctx.beginPath();
    ctx.roundRect(-log.w / 2, -log.h / 2, log.w, log.h, 3);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

function drawHeatGlow(
  ctx: CanvasRenderingContext2D,
  params: MinimalFireParams,
  palette: ReturnType<typeof getFirePalette>,
) {
  const intensity = getRenderIntensity(params.health, params.volumePerHour);
  if (intensity <= 0.05) return;

  const volumeScale = getVolumeScale(params.volumePerHour) * params.spreadMultiplier;
  const pulse = 1 + Math.sin(params.time * 0.003) * 0.06;
  const cx = params.width / 2;
  const cy = params.height - 20;
  const radius = (90 + intensity * 110) * volumeScale * pulse;

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  glow.addColorStop(0, applyPaletteAlpha(palette.glow, intensity * 0.45));
  glow.addColorStop(0.5, applyPaletteAlpha(palette.glow, intensity * 0.18));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, params.width, params.height);
}

function spawnParticles(
  particles: MinimalParticle[],
  params: MinimalFireParams,
) {
  const intensity = getRenderIntensity(params.health, params.volumePerHour);
  if (intensity <= 0.05 || params.frozen) return;

  const volumeScale = getVolumeScale(params.volumePerHour) * params.spreadMultiplier;
  const baseX = params.width / 2;
  const baseY = params.height - 32;
  const spread = (36 + intensity * 55) * volumeScale;
  const spawnCount = Math.floor(intensity * 4 * volumeScale) + 2;

  for (let i = 0; i < spawnCount && particles.length < MAX_PARTICLES; i++) {
    particles.push({
      x: baseX + rand(-spread, spread),
      y: baseY + rand(-6, 3),
      vx: rand(-0.6, 0.6) * volumeScale,
      vy: rand(-3.6, -1.6) * (0.55 + intensity) * (0.85 + volumeScale * 0.15),
      life: 0,
      maxLife: rand(45, 90) * (0.55 + intensity * 0.55),
      size: rand(10, 26) * (0.55 + intensity * 0.75) * (0.8 + volumeScale * 0.2),
      wobble: rand(0, Math.PI * 2),
      wobbleSpeed: rand(0.04, 0.12),
    });
  }
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: MinimalParticle,
  palette: ReturnType<typeof getFirePalette>,
  intensity: number,
) {
  particle.life += 1;
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.wobble += particle.wobbleSpeed;
  particle.vy -= 0.015 * intensity;
  particle.vx += Math.sin(particle.wobble) * 0.04;
  particle.vx *= 0.985;

  const lifeRatio = 1 - particle.life / particle.maxLife;
  if (lifeRatio <= 0) return false;

  const alpha = lifeRatio * intensity * 0.85;
  const size = particle.size * lifeRatio;
  const px = particle.x + Math.sin(particle.wobble) * 2;

  const grad = ctx.createRadialGradient(px, particle.y, 0, px, particle.y, size);
  grad.addColorStop(0, applyPaletteAlpha(palette.core, alpha));
  grad.addColorStop(0.45, applyPaletteAlpha(palette.mid, alpha * 0.6));
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.beginPath();
  ctx.arc(px, particle.y, size, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  return true;
}

export function renderMinimalFireFrame(
  ctx: CanvasRenderingContext2D,
  particles: MinimalParticle[],
  params: MinimalFireParams,
) {
  const intensity = getRenderIntensity(params.health, params.volumePerHour);
  const palette = getFirePalette(params.health);
  const volumeScale = getVolumeScale(params.volumePerHour) * params.spreadMultiplier;

  ctx.clearRect(0, 0, params.width, params.height);

  const bgGrad = ctx.createLinearGradient(0, params.height, 0, 0);
  bgGrad.addColorStop(0, "rgba(20, 8, 4, 0.5)");
  bgGrad.addColorStop(0.4, "rgba(10, 6, 4, 0.1)");
  bgGrad.addColorStop(1, "transparent");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, params.width, params.height);

  drawMinimalLogs(ctx, params.width, params.height, params);
  drawHeatGlow(ctx, params, palette);

  if (!params.frozen) {
    spawnParticles(particles, params);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const alive = drawParticle(ctx, particles[i], palette, intensity);
    if (!alive) particles.splice(i, 1);
  }

  if (params.frozen && particles.length === 0 && intensity > 0.1) {
    const cx = params.width / 2;
    const cy = params.height - 55;
    const frozenRadius = 55 * volumeScale;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, frozenRadius);
    grad.addColorStop(0, applyPaletteAlpha(palette.core, intensity * 0.55));
    grad.addColorStop(0.5, applyPaletteAlpha(palette.mid, intensity * 0.28));
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, frozenRadius * 0.75, frozenRadius * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
