"use client";

import { formatUnits, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ERC20_ABI } from "@/config/chains";

interface UseTokenBalanceParams {
  chainId: number;
  tokenAddress?: `0x${string}`;
  decimals?: number;
}

export function useTokenBalance({
  chainId,
  tokenAddress,
  decimals = 6,
}: UseTokenBalanceParams) {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: tokenAddress ?? zeroAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId,
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  const balance =
    data !== undefined
      ? parseFloat(formatUnits(data as bigint, decimals)).toFixed(4)
      : "0.0000";

  return {
    balance,
    hasBalance: data !== undefined,
    isLoading,
    refetch,
  };
}
