const VOLUME_MIN = 3;
const VOLUME_MAX = 140;

/** 0–1 normalized trading volume */
export function normalizeVolume(volumePerHour: number): number {
  return Math.min(
    1,
    Math.max(0, (volumePerHour - VOLUME_MIN) / (VOLUME_MAX - VOLUME_MIN)),
  );
}

/** Overall fire scale: bigger baseline + growth with volume */
export function getVolumeScale(volumePerHour: number): number {
  const volumeNorm = normalizeVolume(volumePerHour);
  const baseScale = 1.6;
  const volumeBoost = 0.7 + volumeNorm * 0.9;
  return baseScale * volumeBoost;
}

/** Blends health and volume into render intensity */
export function getRenderIntensity(health: number, volumePerHour: number): number {
  const healthFactor = health / 100;
  const volumeFactor = 0.45 + normalizeVolume(volumePerHour) * 0.55;
  return Math.min(1, healthFactor * volumeFactor);
}
