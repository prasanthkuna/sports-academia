"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { assets } from "@/lib/assets";
import { landingConfig } from "@/lib/landing-config";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = landingConfig.navSections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -50% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={assets.brand.logoIcon} alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-base font-semibold tracking-tight text-ink">
            Academy Ops
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-body md:flex">
          {landingConfig.navSections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "transition-colors hover:text-ink",
                active === id && "font-medium text-brand",
              )}
            >
              {label}
            </a>
          ))}
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
            className="hidden rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-active sm:inline"
          >
            Get started
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-hairline bg-canvas px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {landingConfig.navSections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-body hover:bg-surface-soft"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              href="/login"
              className="mt-2 rounded-md bg-ink px-3 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
