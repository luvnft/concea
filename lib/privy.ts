import { PrivyClient } from "@privy-io/server-auth";

export const privy = new PrivyClient(
	process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
	process.env.PRIVY_SECRET as string,
);
