"use client";

import { LoginButton } from "@/components/login-button";
import { NFTForm } from "@/components/nft-form";
import { NFTGrid } from "@/components/nft-grid";
import { useRef } from "react";

export default function Home() {
	const gridRef = useRef<{ getNFTs: () => Promise<void> }>();

	return (
		<main className="min-h-screen flex flex-col items-center justify-start gap-6 w-full mt-12">
			<LoginButton />
			<NFTForm onMintSuccess={() => gridRef.current?.getNFTs()} />
			<NFTGrid ref={gridRef} />
		</main>
	);
}
