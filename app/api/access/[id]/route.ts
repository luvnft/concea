import { NextResponse, type NextRequest } from "next/server";
import { privy } from "@/lib/privy";
import { baseClient } from "@/lib/viem";
import { contract } from "@/lib/contract";
import { isAddressEqual } from "viem";
import { filesClient, ipfsClient } from "@/lib/pinata";

interface NFT {
	token_id: string;
	image_url: string;
	name: string;
	description: string;
	file: string;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const accessToken = request.headers.get("Authorization") as string;
	const auth = await privy.verifyAuthToken(accessToken.replace("Bearer ", ""));

	if (!auth.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await privy.getUserById(auth.userId);

		const ownerData = await baseClient.readContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x`,
			abi: contract.abi,
			functionName: "ownerOf",
			args: [params.id],
		});

		const authorized = isAddressEqual(
			ownerData as `0x`,
			user.wallet?.address as `0x`,
		);
		if (!authorized) {
			console.log("Unauthorized");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const tokenURI = await baseClient.readContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x`,
			abi: contract.abi,
			functionName: "tokenURI",
			args: [params.id],
		});

		const { data: nftData } = await ipfsClient.gateways.get(tokenURI as string);

		const nft = nftData as unknown as NFT;

		const url = await filesClient.gateways.createSignedURL({
			cid: nft.file,
			expires: 180,
		});

		return NextResponse.json({ url: url }, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
