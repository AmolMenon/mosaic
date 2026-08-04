import type { Metadata } from "next";
import "@mosaic/ui/styles/globals.css"; // We will add this later when building UI

export const metadata: Metadata = {
  title: "Mosaic | The Evidence Layer",
  description: "Evidence intelligence for investment teams",
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
