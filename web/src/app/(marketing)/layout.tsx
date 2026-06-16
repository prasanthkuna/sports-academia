import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";
import { assets } from "@/lib/assets";
import { landingConfig } from "@/lib/landing-config";
import { StructuredData } from "./structured-data";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(landingConfig.siteUrl),
  title: "Academy Ops — Fees, attendance & WhatsApp for sports academies",
  description:
    "Collect fees on the ground, mark batch attendance, and send receipts on WhatsApp. Built for Indian cricket, football, and multi-sport academies.",
  keywords: [
    "sports academy software",
    "fee collection",
    "attendance app",
    "WhatsApp receipts",
    "India cricket academy",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Academy Ops — Sports academy operations",
    description: "Fee recovery, attendance, and WhatsApp receipts in one phone-first app.",
    url: landingConfig.siteUrl,
    images: [{ url: assets.og.platform, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy Ops — Sports academy operations",
    description: "Fee recovery, attendance, and WhatsApp receipts in one phone-first app.",
    images: [assets.og.platform],
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} font-sans`}>
      <StructuredData />
      {children}
    </div>
  );
}
