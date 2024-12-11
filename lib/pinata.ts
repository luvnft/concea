import { PinataSDK as FilesSDK } from "pinata";
import { PinataSDK as IPFSSDK } from "pinata-web3";

export const filesClient = new FilesSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});

export const ipfsClient = new IPFSSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL,
});
