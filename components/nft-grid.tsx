"use client";

import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { NFTForm } from "./nft-form";

interface NFT {
	id: string;
	owner: string;
	metadata: {
		name: string;
		description: string;
		extrnal_url: string;
		image: string;
		file: string;
	};
	images: {
		original: string;
		thumbnail: string;
		sm: string;
		md: string;
		lg: string;
	};
}

export const NFTGrid = forwardRef((props, ref) => {
	const { ready, authenticated, getAccessToken } = usePrivy();
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [loading, setLoading] = useState(true);
	const [verifyingId, setVerifyingId] = useState<string | null>(null);
	const { toast } = useToast();

	useImperativeHandle(ref, () => ({
		getNFTs,
	}));

	const getNFTs = useCallback(async () => {
		try {
			setLoading(true);
			const accessToken = await getAccessToken();
			const nftReq = await fetch("/api/nfts", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const nftData = await nftReq.json();
			setNfts(nftData);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}, [getAccessToken]);

	async function accessNFTFile(id: string) {
		try {
			setVerifyingId(id);
			const accessToken = await getAccessToken();
			const accessReq = await fetch(`/api/access/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const accessData = await accessReq.json();
			if (!accessReq) {
				toast({
					title: "Unauthorized",
					variant: "destructive",
				});
			}
			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

			if (isMobile) {
				const link = document.createElement("a");
				link.href = accessData.url;
				link.target = "_blank";
				link.rel = "noopener noreferrer";

				document.body.appendChild(link);
				link.click();

				setTimeout(() => {
					document.body.removeChild(link);
				}, 100);
			} else {
				window.open(accessData.url, "_blank", "noopener,noreferrer");
			}
			setVerifyingId(null);
		} catch (error) {
			console.log(error);
			setVerifyingId(null);
		}
	}

	useEffect(() => {
		if (authenticated) {
			getNFTs();
		}
	}, [authenticated, getNFTs]);

	if (loading) {
		return <Loader2 className="animate-spin" />;
	}

	if (!loading && nfts.length === 0) {
		return (
			<div className="flex flex-col gap-4 my-12">
				<h1>No NFTs, make some now!</h1>
				<NFTForm getNFTs={getNFTs} />
			</div>
		);
	}

	return (
		<div className="flex flex-col max-w-[500px] gap-4 items-center justify-start mb-12">
			<NFTForm getNFTs={getNFTs} />
			{nfts.map((nft: NFT) => (
				<Card
					className="flex flex-col w-full gap-2 overflow-hidden"
					key={nft.id}
				>
					<img
						className="max-w-sm"
						src={nft.images.md || "/pfp.png"}
						alt={nft.metadata.name}
					/>
					<div className="flex flex-col gap-2 p-4">
						<p className="text-xl font-bold">{nft.metadata.name}</p>
						<p>{nft.metadata.description}</p>
						{verifyingId === nft.id ? (
							<Button disabled>
								<Loader2 className="animate-spin" />
								Verifying...
							</Button>
						) : (
							<Button onClick={() => accessNFTFile(nft.id)}>Access File</Button>
						)}
					</div>
				</Card>
			))}
		</div>
	);
});
