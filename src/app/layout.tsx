import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
	title: "CKAY9",
	description: "Web Developer but I do some other things.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}
