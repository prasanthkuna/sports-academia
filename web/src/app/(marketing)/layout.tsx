import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";
import { landingConfig } from "@/lib/landing-config";
import { StructuredData } from "./structured-data";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(landingConfig.siteUrl),
  title: "Academy Ops — Renewal control for sports academies",
  description:
    "Know who paid, who expired, who attended, and who needs a WhatsApp reminder. Fee tracking, receipts, attendance proof, and leads for Indian sports academies.",
  keywords: [
    "sports academy software",
    "fee renewal tracking",
    "overdue fees",
    "academy management",
    "WhatsApp receipts",
    "QR attendance",
    "India cricket academy",
    "fee collection",
    "trial check-in",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Academy Ops — Renewal control + payment proof",
    description:
      "Track renewals, collect fees on ground, prove attendance, and follow up on WhatsApp — one platform for Indian sports academies.",
    url: landingConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy Ops — Renewal control + payment proof",
    description:
      "Track renewals, collect fees, prove attendance, and follow up on WhatsApp for Indian sports academies.",
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
