import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LaunchParams } from "@/components/LaunchParams";
import { Phases } from "@/components/Phases";
import { FireSimulator } from "@/components/FireSimulator";
import { Leaderboard } from "@/components/Leaderboard";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LaunchParams />
        <Phases />
        <FireSimulator />
        <Leaderboard />
      </main>
      <Footer />
    </>
  );
}
