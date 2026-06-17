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

function smoothRandomWalk(current: number, min: number, max: number): number {
  const delta = (Math.random() - 0.48) * 8;
  return Math.min(max, Math.max(min, current + delta));
}

export function useFireIntensity(): FireIntensityState {
  const [volumePerHour, setVolumePerHour] = useState(42);
  const [health, setHealth] = useState(55);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolumePerHour((current) => smoothRandomWalk(current, 5, 120));
      setHealth((current) => smoothRandomWalk(current, 8, 95));
    }, 2000);

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
