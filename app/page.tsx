import { LoginButton } from "@/components/login-button";
import Image from "next/image";

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center gap-6 w-full">
			<LoginButton />
		</main>
	);
}
