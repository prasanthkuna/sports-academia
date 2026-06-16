import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { landingConfig, whatsappUrl } from "@/lib/landing-config";

export function MarketingFooter() {
  const { contact } = landingConfig;

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
          <p className="mt-4 text-xs">Made in India 🇮🇳</p>
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
              <a href="#pricing" className="hover:text-white">
                Pricing
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
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp sales
              </a>
            </li>
            <li>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </a>
            </li>
            <li>
              <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                YouTube
              </a>
            </li>
            <li>
              <Link href="/a/kca-hyderabad" className="hover:text-white">
                Demo academy page
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-8 text-center text-xs">
        © {new Date().getFullYear()} Academy Ops · Made for academy owners
      </p>
    </footer>
  );
}
