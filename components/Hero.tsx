"use client";

import { motion } from "framer-motion";
import { SectionWrap } from "@/components/SectionWrap";

export function Hero() {
  return (
    <SectionWrap className="!pt-12 sm:!pt-20 !pb-8 sm:!pb-12">
      <motion.p
        className="relative mb-4 text-sm font-medium uppercase tracking-[0.2em] text-fire-orange/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Uniswap v4 Hook · Mechanics never seen before
      </motion.p>

      <motion.h1
        className="relative font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl"
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
        className="relative mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
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
        className="relative mt-10 flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <a href="#simulator" className="btn-primary text-sm">
          Monitor $CampfireV4
        </a>
        <a href="#how-it-works" className="btn-secondary text-sm">
          How it works
        </a>
      </motion.div>
    </SectionWrap>
  );
}
