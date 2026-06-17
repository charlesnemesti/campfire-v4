"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { useFireIntensity } from "@/hooks/useFireIntensity";
import { useFireAudio } from "@/hooks/useFireAudio";
import { ClaimButton } from "@/components/ClaimButton";
import { MinimalCampfire } from "@/components/MinimalCampfire";
import { SectionWrap } from "@/components/SectionWrap";
import { getFirePalette, isBlazingPhase } from "@/lib/fire/palette";
import { normalizeVolume } from "@/lib/fire/volumeScale";
import campfireTokenAbi from "@/lib/abis/CampfireToken.json";
import { CONTRACTS, isContractDeployed } from "@/lib/config";

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
      className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition hover:border-fire-orange/40 hover:text-fire-gold"
      aria-pressed={enabled}
      aria-label={enabled ? "Mute campfire sound" : "Enable campfire sound"}
    >
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}

export function FireSimulator() {
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
    ? Math.min(1.35, 1 + Number(balanceRaw as bigint) / 2e21)
    : 1;

  const palette = getFirePalette(health);
  const blazing = isBlazingPhase(health);
  const volumeNorm = normalizeVolume(volumePerHour);
  const glowStrength = 0.2 + (health / 100) * 0.3 + volumeNorm * 0.25;
  const claimsCount = "—";

  return (
    <SectionWrap id="simulator">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <h2 className="section-heading">Campfire motion</h2>
        <p className="section-subheading">
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
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse 75% 55% at 50% 88%, ${palette.glow.replace(/[\d.]+\)$/, `${glowStrength.toFixed(2)})`)}, transparent 75%)`,
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col lg:flex-row">
          <div className="relative min-h-[440px] flex-1 bg-gradient-to-t from-[#140804]/80 via-transparent to-transparent">
            <div className="absolute left-5 top-5 z-10">
              <p className="stat-label">CampfireV4</p>
              <p
                className={`font-display text-xl font-semibold transition-colors duration-1000 ${
                  blazing ? "text-fire-cyan" : "text-fire-orange"
                }`}
              >
                {phaseLabel}
              </p>
            </div>

            <SoundToggle
              enabled={soundEnabled}
              onToggle={() => setSoundEnabled((prev) => !prev)}
            />

            <div className="motion-reduce:hidden absolute inset-0">
              <MinimalCampfire
                health={health}
                volumePerHour={volumePerHour}
                scaleMultiplier={balanceMultiplier}
              />
            </div>
            <div className="motion-reduce:block hidden absolute inset-0">
              <MinimalCampfire
                health={health}
                volumePerHour={volumePerHour}
                frozen
              />
            </div>
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between border-t border-border/60 bg-gradient-to-b from-background-elevated/50 to-background/30 p-6 backdrop-blur-md lg:w-72 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <div>
                <p className="stat-label">VOL/H</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {volumePerHour.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="stat-label">Health</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-background/80">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        blazing
                          ? "bg-gradient-to-r from-fire-blue via-fire-cyan to-fire-ice"
                          : "bg-gradient-to-r from-fire-ember via-fire-orange to-fire-gold"
                      }`}
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
    </SectionWrap>
  );
}
