"use client";

import { motion } from "framer-motion";
import { SectionWrap } from "@/components/SectionWrap";

export function Leaderboard() {
  return (
    <SectionWrap className="!pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <h2 className="section-heading">Top Earners Leaderboard</h2>
        <p className="section-subheading">Latest reward claims</p>
      </motion.div>

      <motion.div
        className="section-card mt-8 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-fire-orange/5 via-transparent to-fire-blue/5 px-6 py-4">
          <p className="stat-label">Total paid out</p>
          <p className="font-display text-lg font-semibold text-fire-gold">
            — CampfireV4
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted">
                <th className="px-6 py-3.5 font-medium">Rank</th>
                <th className="px-6 py-3.5 font-medium">Holder</th>
                <th className="px-6 py-3.5 font-medium">Claimed</th>
                <th className="px-6 py-3.5 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-14 text-center text-muted"
                >
                  No claims yet — be the first to earn CampfireV4 rewards
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </SectionWrap>
  );
}
