import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RENOVIQ AI | Reimagine Every Space",
  description:
    "Upload interior or exterior photos and generate premium AI renovation concepts, before-after previews, and luxury design directions in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
