import { NextResponse, type NextRequest } from "next/server";
import { ipfsClient } from "@/lib/pinata";
import { privy } from "@/lib/privy";

export async function POST(request: NextRequest) {
	const accessToken = request.headers.get("Authorization") as string;
	const auth = await privy.verifyAuthToken(accessToken.replace("Bearer ", ""));

	if (!auth.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const file = (await request.blob()) as unknown as File;
		const { IpfsHash } = await ipfsClient.upload.file(file);
		return NextResponse.json({ cid: IpfsHash }, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
