"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { publicClient } from "@/lib/viem";
import { normalize } from "viem/ens";
import { useCallback, useEffect, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function LoginButton() {
	const { ready, authenticated, login, user, logout } = usePrivy();
	const [ensData, setEnsData] = useState<{
		ensName: string | null;
		pfp: string | null;
	}>({ ensName: null, pfp: null });
	// Disable login when Privy is not ready or the user is already authenticated
	const disableLogin = !ready || (ready && authenticated);

	const getEns = useCallback(async (address: `0x${string}`) => {
		try {
			const ensName = await publicClient.getEnsName({
				address: address,
			});
			const pfp = await publicClient.getEnsAvatar({
				name: normalize(ensName as string),
			});
			return { ensName, pfp };
		} catch (error) {
			console.log(error);
			return;
		}
	}, []);

	function truncateAddress(address: string | undefined): string {
		if (!address) return "";
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}

	useEffect(() => {
		if (user?.wallet?.address) {
			getEns(user.wallet.address as `0x${string}`).then((data) => {
				if (data) {
					setEnsData(data);
				}
			});
		}
	}, [user?.wallet?.address, getEns]);

	return (
		<>
			{!authenticated && (
				<Button disabled={disableLogin} onClick={login}>
					Log in
				</Button>
			)}
			{ready && authenticated && user && (
				<Popover>
					<PopoverTrigger>
						<Button className="rounded-full" size="icon">
							<img
								src={ensData.pfp || "/pfp.png"}
								alt={ensData.ensName || "pfp"}
								className="w-6 h-6 rounded-full"
							/>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="font-sans flex flex-col gap-4 p-4 items-center">
						<p className="font-bold font-mono">
							{ensData.ensName || truncateAddress(user.wallet?.address)}
						</p>

						<Button size="sm" onClick={logout}>
							Log out
						</Button>
					</PopoverContent>
				</Popover>
			)}
		</>
	);
}
