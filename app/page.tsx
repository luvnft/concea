"use client";

import { LoginButton } from "@/components/login-button";
import { NFTForm } from "@/components/nft-form";
import { NFTGrid } from "@/components/nft-grid";
import { Suspense, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { DecryptingText } from "@/components/decrypting-text";

export default function Home() {
	const gridRef = useRef<{ getNFTs: () => Promise<void> }>();
	const { ready, authenticated } = usePrivy();

	return (
		<main className="min-h-screen flex flex-col items-center justify-center gap-6 max-w-sm mx-auto">
			<Suspense
				fallback={
					<h1 className="text-4xl font-mono font-extrabold">SAFE MINTS</h1>
				}
			>
				<DecryptingText
					text="SAFE MINTS"
					className="scroll-m-20 text-4xl font-mono font-extrabold tracking-tight lg:text-5xl"
				/>
			</Suspense>
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
