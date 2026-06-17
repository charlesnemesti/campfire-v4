"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { useFireIntensity } from "@/hooks/useFireIntensity";
import { ClaimButton } from "@/components/ClaimButton";
import campfireTokenAbi from "@/lib/abis/CampfireToken.json";
import { CONTRACTS, isContractDeployed } from "@/lib/config";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

function StaticFlame({ health }: { health: number }) {
  const opacity = 0.3 + (health / 100) * 0.7;

  return (
    <div
      className="flex h-full min-h-[280px] items-end justify-center pb-8"
      aria-hidden="true"
    >
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        fill="none"
        style={{ opacity }}
      >
        <ellipse cx="60" cy="150" rx="50" ry="10" fill="#8b2500" opacity="0.5" />
        <path
          d="M60 20C60 20 25 70 25 110C25 135 40 150 60 150C80 150 95 135 95 110C95 70 60 20 60 20Z"
          fill="#ff4500"
        />
        <path
          d="M60 55C60 55 42 90 42 115C42 128 50 138 60 138C70 138 78 128 78 115C78 90 60 55 60 55Z"
          fill="#ffd166"
        />
      </svg>
    </div>
  );
}

export function FireSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const { volumePerHour, health, phaseLabel } = useFireIntensity();
  const { address, isConnected } = useAccount();
  const tokenDeployed = isContractDeployed(CONTRACTS.token);

  const { data: balanceRaw } = useReadContract({
    address: CONTRACTS.token,
    abi: campfireTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: tokenDeployed && isConnected && Boolean(address),
    },
  });

  const balanceMultiplier = balanceRaw
    ? Math.min(2.5, 1 + Number(balanceRaw as bigint) / 1e21)
    : 1;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const spawnParticle = (width: number, height: number) => {
      const spread = (health / 100) * 40 * balanceMultiplier;
      const intensity = health / 100;

      particlesRef.current.push({
        x: width / 2 + (Math.random() - 0.5) * spread,
        y: height - 20,
        vx: (Math.random() - 0.5) * 1.2 * balanceMultiplier,
        vy: -(1.5 + Math.random() * 2.5) * (0.5 + intensity),
        life: 0,
        maxLife: 40 + Math.random() * 50 * intensity,
        size: (2 + Math.random() * 4) * (0.6 + intensity * 0.8),
        hue: 20 + Math.random() * 30,
      });
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, "rgba(139, 37, 0, 0.15)");
      gradient.addColorStop(0.5, "rgba(255, 69, 0, 0.05)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const spawnRate = Math.floor((health / 100) * 4 * balanceMultiplier) + 1;
      for (let i = 0; i < spawnRate; i++) {
        if (particlesRef.current.length < 120) {
          spawnParticle(width, height);
        }
      }

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.02;
        particle.vx *= 0.99;

        const lifeRatio = 1 - particle.life / particle.maxLife;
        if (lifeRatio <= 0) return false;

        const alpha = lifeRatio * (health / 100);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 55%, ${alpha})`;
        ctx.fill();

        return true;
      });

      if (health > 15) {
        ctx.beginPath();
        ctx.ellipse(width / 2, height - 8, 60 * balanceMultiplier, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 43, ${(health / 100) * 0.4})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      particlesRef.current = [];
    };
  }, [health, balanceMultiplier]);

  const claimsCount = "—";

  return (
    <section id="simulator" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Campfire motion
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          Live hook simulator for $CampfireV4. Activity drives the blaze — every
          swap sends fees straight into the accRewardPerShare accumulator.
          Holders claim whenever they want. The more CampfireV4 you hold, the
          wider your arc on every trade that passes through the pool.
        </p>
      </motion.div>

      <motion.div
        className="section-card mt-10 overflow-hidden fire-glow"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="relative min-h-[320px] flex-1 bg-gradient-to-t from-fire-ember/20 to-transparent">
            <div className="absolute left-4 top-4 z-10">
              <p className="stat-label">CampfireV4</p>
              <p className="font-display text-xl font-semibold text-fire-orange">
                {phaseLabel}
              </p>
            </div>

            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full motion-reduce:hidden"
              aria-hidden="true"
            />
            <div className="motion-reduce:block hidden h-full">
              <StaticFlame health={health} />
            </div>
          </div>

          <div className="flex w-full flex-col justify-between border-t border-border p-6 lg:w-72 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <div>
                <p className="stat-label">VOL/H</p>
                <p className="text-2xl font-semibold">
                  {volumePerHour.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="stat-label">Health</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fire-ember via-fire-orange to-fire-gold transition-all duration-1000"
                      style={{ width: `${health}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {health.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="stat-label">Sell Fee</p>
                <p className="font-medium">0.3%</p>
              </div>
              <div>
                <p className="stat-label">Buy Fee</p>
                <p className="font-medium">0.3%</p>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="stat-label">Claims</p>
                <p className="font-medium">{claimsCount}</p>
              </div>
            </div>

            <ClaimButton className="mt-6" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
