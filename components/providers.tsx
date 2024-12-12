"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<PrivyProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
			config={{
				// Customize Privy's appearance in your app
				appearance: {
					theme: "light",
					accentColor: "#676FFF",
					logo: "https://your-logo-url",
				},
				loginMethods: ["wallet"],
			}}
		>
			{children}
		</PrivyProvider>
	);
}
