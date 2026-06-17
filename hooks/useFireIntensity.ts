"use client";

import { useEffect, useState } from "react";

export type FirePhase = "DYING" | "EMBERS" | "BURNING" | "BLAZING";

export type FireIntensityState = {
  volumePerHour: number;
  health: number;
  phase: FirePhase;
  phaseLabel: string;
};

function getPhase(health: number): { phase: FirePhase; label: string } {
  if (health < 20) return { phase: "DYING", label: "FADING" };
  if (health < 40) return { phase: "EMBERS", label: "EMBERS" };
  if (health < 70) return { phase: "BURNING", label: "BURNING" };
  return { phase: "BLAZING", label: "BLAZING" };
}

function smoothRandomWalk(current: number, min: number, max: number, bias = 0) {
  const delta = (Math.random() - 0.5 + bias) * 10;
  return Math.min(max, Math.max(min, current + delta));
}

export function useFireIntensity(): FireIntensityState {
  const [volumePerHour, setVolumePerHour] = useState(42);
  const [health, setHealth] = useState(55);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolumePerHour((current) => {
        const next = smoothRandomWalk(current, 3, 140, 0.02);
        setHealth((prevHealth) => {
          const target = Math.min(98, 12 + (next / 140) * 88);
          const drift = (target - prevHealth) * 0.25;
          const noise = (Math.random() - 0.5) * 4;
          return Math.min(98, Math.max(5, prevHealth + drift + noise));
        });
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const { phase, label } = getPhase(health);

  return {
    volumePerHour,
    health,
    phase,
    phaseLabel: label,
  };
}
