import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={assets.brand.logoIcon} alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-base font-semibold tracking-tight text-ink">
            Academy Ops
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-body md:flex">
          <a href="#how-it-works" className="hover:text-ink">
            How it works
          </a>
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#faq" className="hover:text-ink">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-body hover:text-ink sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-active"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
