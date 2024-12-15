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
			`${process.env.INDEXER_URL}/nft?address=${user.wallet?.address}`,
			{
				method: "GET",
				headers: {
					"X-API-KEY": process.env.INDEXER_API_KEY as string,
				},
				cache: "no-store",
			},
		);
		const nftData = await nftReq.json();
		return NextResponse.json(nftData.nfts, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
