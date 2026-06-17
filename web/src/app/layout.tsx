import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { assets } from "@/lib/assets";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Academy Ops",
    template: "%s · Academy Ops",
  },
  description: "Renewal control, fee plans, attendance proof, and WhatsApp follow-up for sports academies",
  icons: {
    icon: [{ url: assets.brand.logoIconPng, sizes: "512x512", type: "image/png" }],
    apple: assets.brand.logoIconPng,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
