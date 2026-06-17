import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "CampfireV4",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id",
  chains: [mainnet],
  ssr: true,
});
