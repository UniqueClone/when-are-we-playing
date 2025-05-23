import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "When are we playing?",
  description: "Find a time to play with your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
