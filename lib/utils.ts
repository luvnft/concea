import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { filesClient, ipfsClient } from "./pinata";

interface NFTMetadata {
	name: string;
	description: string;
	external_url: string;
	image: string;
	file: string;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function privateUpload(file: File): Promise<string | undefined> {
	try {
		const { cid } = await filesClient.upload.file(file);
		return cid;
	} catch (error) {
		console.log(error);
		return;
	}
}

export async function ipfsUpload(file: File): Promise<string | undefined> {
	try {
		const { IpfsHash } = await ipfsClient.upload.file(file);
		return IpfsHash;
	} catch (error) {
		console.log(error);
		return;
	}
}

export async function uploadMetadata(
	data: NFTMetadata,
): Promise<string | undefined> {
	try {
		const { IpfsHash: tokenURI } = await ipfsClient.upload.json({
			name: data.name,
			description: data.description,
			external_url: data.external_url,
			image: `ipfs://${data.image}`,
			file: data.file,
		});
		return tokenURI;
	} catch (error) {
		console.log(error);
		return;
	}
}
