"use client";

import { useEffect, useRef } from "react";
import {
  createMinimalParticlePool,
  renderMinimalFireFrame,
  type MinimalParticle,
} from "@/lib/fire/renderMinimalFire";

type MinimalCampfireProps = {
  health: number;
  volumePerHour: number;
  scaleMultiplier?: number;
  frozen?: boolean;
};

export function MinimalCampfire({
  health,
  volumePerHour,
  scaleMultiplier = 1,
  frozen = false,
}: MinimalCampfireProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<MinimalParticle[]>(createMinimalParticlePool());
  const frameRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
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

    if (frozen) {
      const rect = canvas.getBoundingClientRect();
      renderMinimalFireFrame(ctx, particlesRef.current, {
        width: rect.width,
        height: rect.height,
        health,
        volumePerHour,
        spreadMultiplier: scaleMultiplier,
        time: 0,
        frozen: true,
      });
      return () => window.removeEventListener("resize", resize);
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      timeRef.current += 1;

      renderMinimalFireFrame(ctx, particlesRef.current, {
        width: rect.width,
        height: rect.height,
        health,
        volumePerHour,
        spreadMultiplier: scaleMultiplier,
        time: timeRef.current,
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      particlesRef.current = createMinimalParticlePool();
    };
  }, [health, volumePerHour, scaleMultiplier, frozen]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
