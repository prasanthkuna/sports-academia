import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";

export function MarketingFooter() {
  return (
    <footer className="bg-[#101010] px-4 py-14 text-sm text-[#a1a1aa]">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={assets.brand.logoIcon} alt="" width={28} height={28} />
            <span className="font-display font-semibold text-white">Academy Ops</span>
          </Link>
          <p className="mt-4 max-w-sm leading-relaxed">
            Fee recovery, attendance, and WhatsApp receipts for sports academies across India.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Product</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="#features" className="hover:text-white">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-white">
                How it works
              </a>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Demo</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/a/kca-hyderabad" className="hover:text-white">
                Kohinoor Cricket Academy
              </Link>
            </li>
            <li>
              <Link href="/a/kca-hyderabad/enquire" className="hover:text-white">
                Enquiry form
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-8 text-center text-xs">
        © {new Date().getFullYear()} Sports Academy Ops · Made for academy owners
      </p>
    </footer>
  );
}
