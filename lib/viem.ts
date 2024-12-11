import type { EIP1193Provider } from "@privy-io/react-auth";
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { baseSepolia, mainnet } from "viem/chains";
import { contract } from "./contract";

export const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(),
});

export const baseClient = createPublicClient({
	chain: baseSepolia,
	transport: http(),
});

export async function mintNFT(tokenURI: string, provider: EIP1193Provider) {
	try {
		const walletClient = createWalletClient({
			chain: baseSepolia,
			transport: custom(provider),
		});
		const [address] = await walletClient.getAddresses();
		const { request } = await baseClient.simulateContract({
			account: address,
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
			abi: contract.abi,
			functionName: "safeMint",
			args: [`ipfs://${tokenURI}`],
		});
		const tx = await walletClient.writeContract(request);
		const success = await baseClient.waitForTransactionReceipt({
			hash: tx,
		});
		return success;
	} catch (error) {
		console.log(error);
	}
}
