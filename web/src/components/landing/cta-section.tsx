"use client";

import Link from "next/link";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-2xl bg-ink px-8 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.35),transparent_55%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Stop renewal leakage before the next batch
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#a1a1aa] sm:text-base">
                Log in with demo credentials — see overdue fees, collect a renewal, verify a receipt,
                or try live attendance flows above.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-surface-soft"
                >
                  Open demo academy
                </Link>
                <a
                  href="#demo"
                  className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Try live flows
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
