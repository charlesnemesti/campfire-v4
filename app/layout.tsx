import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { PageBackdrop } from "@/components/PageBackdrop";
import { Web3Provider } from "@/providers/Web3Provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampfireV4 — the meme token that never stops burning",
  description:
    "CampfireV4 is a living meme token on Uniswap v4. Every swap fuels the fire — stop trading and the embers die. Holders earn swap fees automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <PageBackdrop />
        <div className="relative z-10">
          <Web3Provider>{children}</Web3Provider>
        </div>
      </body>
    </html>
  );
}
