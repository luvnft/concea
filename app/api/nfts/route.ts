import { NextResponse, type NextRequest } from "next/server";
import { privy } from "@/lib/privy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	const accessToken = request.headers.get("Authorization") as string;
	const auth = await privy.verifyAuthToken(accessToken.replace("Bearer ", ""));

	if (!auth.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await privy.getUserById(auth.userId);
		const nftReq = await fetch(
			`https://api.simplehash.com/api/v0/nfts/owners_v2?chains=base-sepolia&wallet_addresses=${user.wallet?.address}&contract_ids=base-sepolia.${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}&order_by=transfer_time__desc`,
			{
				method: "GET",
				headers: {
					"X-API-KEY": process.env.SIMPLEHASH_API_KEY as string,
					accept: "application/json",
				},
				cache: "no-store",
			},
		);
		const nftData = await nftReq.json();
		console.log(nftData.nfts.length);
		return NextResponse.json(nftData.nfts, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
