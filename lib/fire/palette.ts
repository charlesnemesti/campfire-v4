export const BLAZE_BLUE = {
  core: "#4da6ff",
  mid: "#6ec8ff",
  ice: "#a8e0ff",
  glow: "rgba(77, 166, 255, 0.35)",
} as const;

export const WARM_FIRE = {
  ember: "#8b2500",
  orange: "#ff6b2b",
  gold: "#ffd166",
  glow: "rgba(255, 107, 43, 0.35)",
} as const;

export type FirePalette = {
  core: string;
  mid: string;
  edge: string;
  glow: string;
  ambient: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function mixRgba(
  rgbaA: string,
  rgbaB: string,
  t: number,
): string {
  const parse = (s: string) => {
    const match = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return [255, 107, 43, 0.35];
    return [
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
      Number(match[4] ?? 1),
    ];
  };
  const a = parse(rgbaA);
  const b = parse(rgbaB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  const alpha = a[3] + (b[3] - a[3]) * t;
  return `rgba(${r}, ${g}, ${bl}, ${alpha.toFixed(2)})`;
}

export function getFirePalette(health: number): FirePalette {
  const intensity = health / 100;
  const blueT = health > 70 ? Math.min(1, (health - 70) / 30) : 0;

  const warmCore = health < 40 ? WARM_FIRE.ember : WARM_FIRE.orange;
  const core = mixHex(warmCore, BLAZE_BLUE.core, blueT);
  const mid = mixHex(WARM_FIRE.gold, BLAZE_BLUE.mid, blueT);
  const edge = mixHex(WARM_FIRE.ember, BLAZE_BLUE.ice, blueT * 0.6);
  const glow = mixRgba(WARM_FIRE.glow, BLAZE_BLUE.glow, blueT);
  const ambientAlpha = 0.15 + intensity * 0.35;
  const ambient = glow.replace(/[\d.]+\)$/, `${ambientAlpha})`);

  return { core, mid, edge, glow, ambient };
}

export function isBlazingPhase(health: number): boolean {
  return health >= 70;
}
