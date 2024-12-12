"use client";

import { LoginButton } from "@/components/login-button";
import { NFTForm } from "@/components/nft-form";
import { NFTGrid } from "@/components/nft-grid";
import { useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
	const gridRef = useRef<{ getNFTs: () => Promise<void> }>();
	const { ready, authenticated } = usePrivy();

	return (
		<main className="min-h-screen flex flex-col items-center justify-center gap-6 max-w-sm mx-auto my-12">
			<h1 className="scroll-m-20 text-4xl font-mono font-extrabold tracking-tight lg:text-5xl">
				SAFE MINTS
			</h1>
			<p className="font-mono text-center">
				Create and share NFTs with private files
			</p>
			<LoginButton />
			{ready && authenticated && (
				<>
					<NFTForm onMintSuccess={() => gridRef.current?.getNFTs()} />
					<NFTGrid ref={gridRef} />
				</>
			)}
		</main>
	);
}
