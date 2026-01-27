import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "When are we playing?",
    description: "Find a time to play with your friends",
    manifest: "/manifest.json",
    themeColor: "#6366f1",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "When Playing?",
    },
    icons: {
        icon: [
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            {
                url: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
