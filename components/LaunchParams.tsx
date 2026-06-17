"use client";

import { motion } from "framer-motion";

const params = [
  { label: "Supply", value: "1,000,000,000" },
  { label: "Swap Fee", value: "0.3% buy & sell" },
  { label: "Fee Recipients", value: "100% to holders" },
  { label: "Reward Calc", value: "accRewardPerShare" },
  { label: "Excluded Addresses", value: "pool · position · hook" },
  { label: "Claim", value: "instant · no lock" },
  { label: "Reentrancy", value: "protected" },
  { label: "Owner", value: "renounced after hook set" },
];

export function LaunchParams() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <motion.div
        className="section-card fire-glow p-6 sm:p-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="stat-label mb-6">
          Launch parameters · hardcoded in hook — no admin keys
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {params.map((param) => (
            <div
              key={param.label}
              className="rounded-lg border border-border bg-background/50 px-4 py-3"
            >
              <p className="stat-label mb-1">{param.label}</p>
              <p className="font-medium text-foreground">{param.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
