"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

function FlameLogo() {
  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 28 32"
      fill="none"
      aria-hidden="true"
      className="text-fire-orange"
    >
      <path
        d="M14 2C14 2 6 12 6 20C6 26.627 9.373 30 14 30C18.627 30 22 26.627 22 20C22 12 14 2 14 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M14 10C14 10 10 16 10 20.5C10 23.537 11.791 25.5 14 25.5C16.209 25.5 18 23.537 18 20.5C18 16 14 10 14 10Z"
        fill="#ffd166"
      />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <motion.a
          href="#"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FlameLogo />
          <span>CampfireV4</span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ConnectButton
            chainStatus="icon"
            accountStatus="address"
            showBalance={false}
          />
        </motion.div>
      </div>
    </header>
  );
}
