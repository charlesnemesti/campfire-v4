"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { useFireIntensity } from "@/hooks/useFireIntensity";
import { useFireAudio } from "@/hooks/useFireAudio";
import { ClaimButton } from "@/components/ClaimButton";
import campfireTokenAbi from "@/lib/abis/CampfireToken.json";
import { CONTRACTS, isContractDeployed } from "@/lib/config";
import {
  createParticlePool,
  renderFireFrame,
  type FireParticle,
} from "@/lib/fire/renderFire";

function StaticFlame({ health }: { health: number }) {
  const opacity = 0.3 + (health / 100) * 0.7;

  return (
    <div
      className="flex h-full min-h-[360px] items-end justify-center pb-10"
      aria-hidden="true"
    >
      <svg
        width="140"
        height="180"
        viewBox="0 0 140 180"
        fill="none"
        style={{ opacity }}
      >
        <ellipse cx="70" cy="168" rx="55" ry="10" fill="#3d2010" opacity="0.8" />
        <rect x="20" y="155" width="90" height="12" rx="4" fill="#5c3317" />
        <rect x="35" y="163" width="70" height="10" rx="3" fill="#4a2812" />
        <path
          d="M70 15C70 15 22 75 22 120C22 148 42 168 70 168C98 168 118 148 118 120C118 75 70 15 70 15Z"
          fill="#ff4500"
        />
        <path
          d="M70 50C70 50 48 95 48 122C48 138 58 152 70 152C82 152 92 138 92 122C92 95 70 50 70 50Z"
          fill="#ffd166"
        />
      </svg>
    </div>
  );
}

function SoundToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition hover:border-fire-orange hover:text-fire-gold"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute campfire sound" : "Enable campfire sound"}
    >
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}

export function FireSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FireParticle[]>(createParticlePool());
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { volumePerHour, health, phaseLabel } = useFireIntensity();
  const { address, isConnected } = useAccount();
  const tokenDeployed = isContractDeployed(CONTRACTS.token);

  useFireAudio({ health, enabled: soundEnabled });

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

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      timeRef.current += 1;

      renderFireFrame(ctx, particlesRef.current, {
        width: rect.width,
        height: rect.height,
        health,
        spreadMultiplier: balanceMultiplier,
        time: timeRef.current,
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      particlesRef.current = createParticlePool();
    };
  }, [health, balanceMultiplier]);

  const glowOpacity = 0.15 + (health / 100) * 0.35;
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
        className="section-card relative mt-10 overflow-hidden fire-glow"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 85%, rgba(255, 107, 43, ${glowOpacity}), transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col lg:flex-row">
          <div className="relative min-h-[360px] flex-1 bg-gradient-to-t from-[#1a0a04] via-transparent to-transparent">
            <div className="absolute left-4 top-4 z-10">
              <p className="stat-label">CampfireV4</p>
              <p className="font-display text-xl font-semibold text-fire-orange">
                {phaseLabel}
              </p>
            </div>

            <SoundToggle
              enabled={soundEnabled}
              onToggle={() => setSoundEnabled((prev) => !prev)}
            />

            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full motion-reduce:hidden"
              aria-hidden="true"
            />
            <div className="motion-reduce:block hidden h-full">
              <StaticFlame health={health} />
            </div>
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between border-t border-border bg-background-elevated/40 p-6 backdrop-blur-sm lg:w-72 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <div>
                <p className="stat-label">VOL/H</p>
                <p className="text-2xl font-semibold tabular-nums">
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
                  <span className="text-sm font-medium tabular-nums">
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
