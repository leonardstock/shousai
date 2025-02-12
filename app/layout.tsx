import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TermlyCMP from "@/components/TermlyCMP";
import { Suspense } from "react";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "shousai",
    description: "Reduce your AI Cost",
};

const WEBSITE_UUID = "ac05585f-5e52-4df4-9840-9232c3e9b67c";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider afterSignOutUrl='/'>
            <html lang='en'>
                <body
                    className={`${inter.className} antialiased flex flex-col`}>
                    <Suspense>
                        <TermlyCMP
                            websiteUUID={WEBSITE_UUID}
                            autoBlock={undefined}
                            masterConsentsOrigin={undefined}
                        />
                    </Suspense>
                    {children}
                    <Analytics />
                    <SpeedInsights />
                </body>
            </html>
        </ClerkProvider>
    );
}
