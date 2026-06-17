"use client";

import { useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import campfireHookAbi from "@/lib/abis/CampfireHook.json";
import { CONTRACTS, isContractDeployed } from "@/lib/config";

export function useRewards() {
  const { address, isConnected } = useAccount();
  const hookDeployed = isContractDeployed(CONTRACTS.hook);

  const { data: pendingRewardRaw, refetch: refetchPendingReward } =
    useReadContract({
      address: CONTRACTS.hook,
      abi: campfireHookAbi,
      functionName: "pendingReward",
      args: address ? [address] : undefined,
      query: {
        enabled: hookDeployed && isConnected && Boolean(address),
      },
    });

  const {
    writeContract,
    data: claimTxHash,
    isPending: isClaimPending,
    error: claimError,
    reset: resetClaim,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isClaimSuccess } =
    useWaitForTransactionReceipt({
      hash: claimTxHash,
    });

  const pendingReward = useMemo(() => {
    if (!hookDeployed || pendingRewardRaw === undefined) return null;
    return formatUnits(pendingRewardRaw as bigint, 18);
  }, [hookDeployed, pendingRewardRaw]);

  const hasRewards =
    hookDeployed &&
    pendingRewardRaw !== undefined &&
    (pendingRewardRaw as bigint) > BigInt(0);

  function claim() {
    if (!hookDeployed) return;

    writeContract({
      address: CONTRACTS.hook,
      abi: campfireHookAbi,
      functionName: "claim",
    });
  }

  return {
    hookDeployed,
    isConnected,
    pendingReward,
    hasRewards,
    claim,
    isClaimPending,
    isConfirming,
    isClaimSuccess,
    claimError,
    resetClaim,
    refetchPendingReward,
  };
}
