"use client";

import { useAccount, useReadContracts } from "wagmi";
import { arcTestnet, TOKEN_ADDRESSES, ERC20_ABI } from "@/config/chains";
import { formatUnits } from "viem";

export function useArcBalances() {
  const { address, chainId } = useAccount();

  const isArcNetwork = chainId === arcTestnet.id;

  const { data: tokenBalances, refetch: refetchTokens } = useReadContracts({
    contracts: [
      {
        address: TOKEN_ADDRESSES.arcTestnet.USDC,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        chainId: arcTestnet.id,
      },
      {
        address: TOKEN_ADDRESSES.arcTestnet.EURC,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        chainId: arcTestnet.id,
      },
      {
        address: TOKEN_ADDRESSES.arcTestnet.USYC,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        chainId: arcTestnet.id,
      },
    ],
    query: { enabled: !!address },
  });

  const usdcBalance =
    tokenBalances?.[0]?.result !== undefined
      ? parseFloat(formatUnits(tokenBalances[0].result as bigint, 6)).toFixed(4)
      : "0.0000";

  const eurcBalance =
    tokenBalances?.[1]?.result !== undefined
      ? parseFloat(formatUnits(tokenBalances[1].result as bigint, 6)).toFixed(4)
      : "0.0000";

  const usycBalance =
    tokenBalances?.[2]?.result !== undefined
      ? parseFloat(formatUnits(tokenBalances[2].result as bigint, 18)).toFixed(4)
      : "0.0000";

  const refetch = () => {
    refetchTokens();
  };

  return {
    usdcBalance,
    eurcBalance,
    usycBalance,
    isArcNetwork,
    refetch,
  };
}
