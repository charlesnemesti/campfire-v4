"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.p
        className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-fire-orange"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Uniswap v4 Hook · Mechanics never seen before
      </motion.p>

      <motion.h1
        className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        A meme token that{" "}
        <span className="text-gradient-fire italic">burns.</span>
        <br />
        Or fades.
      </motion.h1>

      <motion.p
        className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <strong className="font-semibold text-foreground">$CampfireV4</strong>{" "}
        is a living meme token on Uniswap v4. Every swap fuels the fire — stop
        trading and the embers die. Every holder earns swap fees automatically.
        The biggest bag burns the brightest arc.
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <a
          href="#simulator"
          className="inline-flex items-center rounded-full bg-fire-orange px-6 py-3 text-sm font-semibold text-background transition hover:bg-fire-red"
        >
          Monitor $CampfireV4
        </a>
        <a
          href="#how-it-works"
          className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-fire-orange hover:text-fire-gold"
        >
          How it works
        </a>
      </motion.div>
    </section>
  );
}
