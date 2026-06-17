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
    "Fee plans, renewal dashboard, session packages, receipts, and attendance proof for Indian sports academies.",
  keywords: [
    "sports academy software",
    "fee renewal tracking",
    "overdue fees",
    "academy management",
    "WhatsApp receipts",
    "QR attendance",
    "India cricket academy",
    "session package fees",
    "summer camp billing",
    "fee plan engine",
    "trial check-in",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Academy Ops — Renewal control + payment proof",
    description:
      "Fee plans, auto demands, renewal dashboard, session tracking, and WhatsApp follow-up for Indian sports academies.",
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
