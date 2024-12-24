"use client";

import { LoginButton } from "@/components/login-button";
import { NFTForm } from "@/components/nft-form";
import { NFTGrid } from "@/components/nft-grid";
import { Suspense, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { DecryptingText } from "@/components/decrypting-text";
import { Footer } from "@/components/footer";

export default function Home() {
	const { ready, authenticated } = usePrivy();

	return (
		<main className="min-h-screen flex flex-col items-center justify-center gap-6 max-w-sm mx-auto mt-12 sm:px-0 px-2">
			<Suspense
				fallback={
					<h1 className="text-4xl font-mono font-extrabold">MINT.LUVNFT</h1>
				}
			>
				<DecryptingText
					text="MINT.LUVNFT"
					className="scroll-m-20 text-4xl font-mono font-extrabold tracking-tight lg:text-5xl"
				/>
			</Suspense>
			<p className="font-mono text-center">
				Mint and share NFTs with private files
			</p>
			<LoginButton />
			{ready && authenticated && <NFTGrid />}
			<Footer />
		</main>
	);
}
