import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Receipt verification — Academy Ops",
  description: "Verify academy fee payment receipts online.",
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} min-h-screen font-sans`}>{children}</div>;
}
