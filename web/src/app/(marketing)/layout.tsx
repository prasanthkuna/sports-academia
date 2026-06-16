import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";
import { assets } from "@/lib/assets";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Academy Ops — Fees, attendance & WhatsApp for sports academies",
  description:
    "Collect fees on the ground, mark batch attendance, and send receipts on WhatsApp. Built for Indian cricket, football, and multi-sport academies.",
  openGraph: {
    title: "Academy Ops — Sports academy operations",
    description: "Fee recovery, attendance, and WhatsApp receipts in one phone-first app.",
    images: [{ url: assets.og.platform, width: 1200, height: 630 }],
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} font-sans`}>{children}</div>;
}
