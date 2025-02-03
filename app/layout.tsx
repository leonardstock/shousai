import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "@/components/layout/TopBar";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "shousai",
    description: "Reduce your AI Cost",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider afterSignOutUrl={"/"}>
            <html lang='en'>
                <body className={`${inter.className} antialiased`}>
                    <TopBar />
                    {children}
                    <Analytics />
                    <SpeedInsights />
                </body>
            </html>
        </ClerkProvider>
    );
}
