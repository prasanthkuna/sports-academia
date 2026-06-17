import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Activate subscription — Academy Ops",
  robots: { index: false, follow: false },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} min-h-screen font-sans`}>{children}</div>;
}
