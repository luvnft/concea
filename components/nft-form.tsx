"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { mintNFT } from "@/lib/viem";
import { baseSepolia } from "viem/chains";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	name: z.string().min(2).max(50),
	description: z.string().min(2).max(250),
	externalUrl: z.string().url(),
});

interface NFTFormProps {
	onMintSuccess?: () => void;
}

export function NFTForm({ onMintSuccess }: NFTFormProps) {
	const { getAccessToken } = usePrivy();
	const { wallets } = useWallets();
	const [file, setFile] = useState<File | undefined>();
	const [image, setImage] = useState<File | undefined>();
	const [loading, setLoading] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target?.files?.[0]);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setImage(e.target?.files?.[0]);
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			externalUrl: "",
		},
	});

	async function mint(values: z.infer<typeof formSchema>) {
		if (!file || !image) {
			console.log("Image or File missing");
			return;
		}
		try {
			setLoading(true);
			const accessToken = await getAccessToken();
			const fileUploadReq = await fetch("/api/file", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: file,
			});
			const fileUpload = await fileUploadReq.json();

			const imageUploadReq = await fetch("/api/image", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: image,
			});
			const imageUpload = await imageUploadReq.json();

			const metadataUploadReq = await fetch("/api/metadata", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					name: values.name,
					description: values.description,
					external_url: values.externalUrl,
					image: imageUpload.cid,
					file: fileUpload.cid,
				}),
			});
			const metadataUpload = await metadataUploadReq.json();
			console.log(metadataUpload);

			const wallet = wallets[0]; // Replace this with your desired wallet
			await wallet.switchChain(baseSepolia.id);
			const provider = await wallet.getEthereumProvider();
			const mint = await mintNFT(metadataUpload.tokenURI, provider);
			console.log(mint);
			setLoading(false);
			onMintSuccess?.();
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}
	return (
		<Dialog>
			<Button asChild>
				<DialogTrigger>Create NFT</DialogTrigger>
			</Button>
			<DialogContent>
				<DialogTitle>Create Your NFT</DialogTitle>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(mint)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="My NFT" {...field} />
									</FormControl>
									<FormDescription>Name of your NFT</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="This is a great NFT" {...field} />
									</FormControl>
									<FormDescription>Your NFT Description</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="externalUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Website URL</FormLabel>
									<FormControl>
										<Input placeholder="https://pinata.cloud" {...field} />
									</FormControl>
									<FormDescription>
										Your Website or Portfolio URL
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="image">Cover Image</Label>
							<Input id="image" type="file" onChange={handleImageChange} />
						</div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="file">Private File</Label>
							<Input id="file" type="file" onChange={handleFileChange} />
						</div>

						{loading ? (
							<Button disabled>
								<Loader2 className="animate-spin" />
								Minting...
							</Button>
						) : (
							<Button type="submit">Submit</Button>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
