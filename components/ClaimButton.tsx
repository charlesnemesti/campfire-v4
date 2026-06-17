"use client";

import { useRewards } from "@/hooks/useRewards";

type ClaimButtonProps = {
  className?: string;
};

export function ClaimButton({ className = "" }: ClaimButtonProps) {
  const {
    hookDeployed,
    isConnected,
    pendingReward,
    hasRewards,
    claim,
    isClaimPending,
    isConfirming,
    isClaimSuccess,
    claimError,
  } = useRewards();

  if (!isConnected) {
    return (
      <button
        type="button"
        disabled
        className={`w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm font-semibold text-muted ${className}`}
        title="Connect your wallet to claim rewards"
      >
        Connect wallet to claim
      </button>
    );
  }

  if (!hookDeployed) {
    return (
      <button
        type="button"
        disabled
        className={`w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm font-semibold text-muted ${className}`}
        title="Contract not deployed yet"
      >
        Contract not deployed yet
      </button>
    );
  }

  if (isClaimSuccess) {
    return (
      <button
        type="button"
        disabled
        className={`w-full rounded-lg bg-fire-gold/20 px-4 py-3 text-sm font-semibold text-fire-gold ${className}`}
      >
        Rewards claimed!
      </button>
    );
  }

  const isLoading = isClaimPending || isConfirming;
  const rewardDisplay =
    pendingReward !== null ? `${Number(pendingReward).toFixed(4)} CAMPFIRE` : "—";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => claim()}
        disabled={!hasRewards || isLoading}
        className="w-full rounded-lg bg-fire-orange px-4 py-3 text-sm font-semibold text-background transition hover:bg-fire-red disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Claiming..."
          : hasRewards
            ? `Claim ${rewardDisplay}`
            : "Claim Rewards"}
      </button>
      {claimError && (
        <p className="mt-2 text-center text-xs text-fire-red">
          Claim failed. Try again.
        </p>
      )}
      {!hasRewards && pendingReward !== null && (
        <p className="mt-2 text-center text-xs text-muted">
          No pending rewards yet
        </p>
      )}
    </div>
  );
}
