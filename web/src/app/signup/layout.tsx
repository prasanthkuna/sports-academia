import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sign up — Academy Ops",
  description: "Start your 7-day Pro trial — create your academy and import your student Excel.",
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} min-h-screen font-sans`}>{children}</div>;
}
