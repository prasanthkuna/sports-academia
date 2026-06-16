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
  title: "Academy Ops — QR attendance, fees & WhatsApp for sports academies",
  description:
    "QR gate check-in, fee collection, coach logins, and WhatsApp receipts for Indian cricket, football, and multi-sport academies. Phone-first ops for owners and staff.",
  keywords: [
    "sports academy software",
    "QR attendance",
    "fee collection",
    "coach login",
    "WhatsApp receipts",
    "India cricket academy",
    "academy management",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Academy Ops — QR attendance & academy operations",
    description:
      "Students scan at the gate. Collect fees, export reports, and send WhatsApp receipts — one platform for Indian sports academies.",
    url: landingConfig.siteUrl,
    images: [{ url: assets.og.platform, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy Ops — QR attendance & academy operations",
    description:
      "Students scan at the gate. Collect fees, export reports, and send WhatsApp receipts — one platform for Indian sports academies.",
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
