# CampfireV4

A meme token landing site with a live fire simulator, inspired by [PendulumV4](https://www.pendulumv4.xyz/). Built with Next.js, wagmi, and RainbowKit — ready for Ethereum mainnet with placeholder contract addresses.

## Features

- Campfire-themed UI with live canvas particle fire simulator
- Wallet connect via RainbowKit (Ethereum mainnet)
- Claim rewards UI wired to hook contract (placeholder until deploy)
- Four phases: Fueling, Embers, Reigniting, Full Blaze
- Top earners leaderboard (empty state until on-chain indexing)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and add your WalletConnect project ID:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a free project ID at [WalletConnect Cloud](https://cloud.walletconnect.com/).

### 3. Run development server

```bash
npm run dev
```

On Windows PowerShell, if you see an execution policy error for `npm.ps1`, use:

```powershell
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Post-Deploy Contract Setup

After deploying your ERC20 token and Uniswap v4 hook, update addresses in `lib/config.ts`:

```typescript
export const CONTRACTS = {
  token: "0xYourTokenAddress",
  hook: "0xYourHookAddress",
  pool: "0xYourPoolAddress",
};
```

Replace ABIs in `lib/abis/` with your verified contract ABIs if they differ from the placeholders.

Required hook functions:

- `claim()`
- `pendingReward(address) view returns (uint256)`
- `accRewardPerShare() view returns (uint256)`

## Project Structure

```
app/              # Next.js App Router pages and global styles
components/       # UI sections (Hero, FireSimulator, Leaderboard, etc.)
hooks/            # useFireIntensity, useRewards
lib/              # wagmi config, contract addresses, ABIs
providers/        # Web3Provider (wagmi + RainbowKit)
```

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

### Option A — GitHub integration (recommended)

1. Push your code to [GitHub](https://github.com/charlesnemesti/campfire-v4)
2. Go to [vercel.com/new](https://vercel.com/new) and import the `campfire-v4` repo
3. Add environment variable:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` = your WalletConnect project ID
4. Click **Deploy**

Vercel will rebuild on every push to `main`.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

When prompted, link to the existing project or create a new one. Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in the Vercel dashboard under **Settings → Environment Variables**.

## Disclaimer

$CampfireV4 is a meme token concept for entertainment. Not financial advice. DYOR. NFA.
