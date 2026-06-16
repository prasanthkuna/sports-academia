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
  title: "Academy Ops — QR attendance, fees & WhatsApp for sports academies",
  description:
    "QR gate check-in, fee collection, coach logins, leads, reports, and WhatsApp receipts for Indian sports academies. Try the live demo with real flows.",
  keywords: [
    "sports academy software",
    "QR attendance",
    "fee collection",
    "coach login",
    "WhatsApp receipts",
    "India cricket academy",
    "academy management",
    "trial check-in",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Academy Ops — Your academy gate, fees, and parents",
    description:
      "QR check-in, on-ground fees, coach roles, and owner digest — one platform for Indian sports academies. Live demo included.",
    url: landingConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Academy Ops — Your academy gate, fees, and parents",
    description:
      "QR check-in, on-ground fees, coach roles, and owner digest — one platform for Indian sports academies.",
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
