"use client";

import { motion } from "framer-motion";

const phases = [
  {
    title: "Fueling",
    description:
      "Every swap is fuel. The hook fires on every trade via beforeSwap, calling notifySwap() and distributing fees to all holders instantly.",
    code: "beforeSwap → notifySwap()",
  },
  {
    title: "Embers",
    description:
      "No trades — no fees flow. The fire goes silent. Holder balances don't shrink, but accRewardPerShare stops climbing. The campfire waits.",
    code: "accRewardPerShare paused",
  },
  {
    title: "Reigniting",
    description:
      "A new buyer enters the pool, volume returns, and fees resume distribution. Any holder can claim() accumulated rewards at any point — no staking required.",
    code: "claim() anytime",
  },
  {
    title: "Full Blaze",
    description:
      "High volume — maximum fees per block. The largest holders collect the most heat. The hook never sleeps: every swap, forever, keeps every fire in the chain burning.",
    code: "max fees / block",
  },
];

export function Phases() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Four phases of the campfire
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {phases.map((phase, index) => (
          <motion.article
            key={phase.title}
            className="section-card p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fire-orange/20 text-sm font-bold text-fire-orange">
                {index + 1}
              </span>
              <h3 className="font-display text-xl font-semibold">
                {phase.title}
              </h3>
            </div>
            <p className="leading-relaxed text-muted">{phase.description}</p>
            <code className="mt-4 inline-block rounded bg-background px-2 py-1 font-mono text-xs text-fire-gold">
              {phase.code}
            </code>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
