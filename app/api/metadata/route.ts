import { NextResponse, type NextRequest } from "next/server";
import { ipfsClient } from "@/lib/pinata";
import { privy } from "@/lib/privy";

interface NFTMetadata {
	name: string;
	description: string;
	external_url: string;
	image: string;
	file: string;
}

export async function POST(request: NextRequest) {
	const accessToken = request.headers.get("Authorization") as string;
	const auth = await privy.verifyAuthToken(accessToken.replace("Bearer ", ""));

	if (!auth.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const data: NFTMetadata = await request.json();
		const { IpfsHash } = await ipfsClient.upload.json({
			name: data.name,
			description: data.description,
			external_url: data.external_url,
			image: `ipfs://${data.image}`,
			file: data.file,
		});
		return NextResponse.json({ tokenURI: IpfsHash }, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
