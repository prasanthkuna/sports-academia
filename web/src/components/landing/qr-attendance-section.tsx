"use client";

import { QrCode, MapPin, ShieldCheck } from "lucide-react";
import { AssetImage } from "@/components/landing/asset-image";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { assets } from "@/lib/assets";
import { landingConfig } from "@/lib/landing-config";

function MiniQrCheckInUI() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <div className="rounded-xl border-2 border-dashed border-brand/40 bg-canvas p-4">
        <QrCode className="h-16 w-16 text-brand" strokeWidth={1.25} />
      </div>
      <p className="text-center text-sm font-semibold text-ink">Arjun Kumar</p>
      <p className="text-center text-xs text-muted">U12 Morning Cricket</p>
      <div className="w-full rounded-md bg-success py-2 text-center text-xs font-semibold text-white">
        Mark present
      </div>
      <p className="flex items-center gap-1 text-[10px] text-muted">
        <MapPin className="h-3 w-3" />
        Within academy · PIN verified
      </p>
    </div>
  );
}

export function QrAttendanceSection() {
  const { qrSection } = landingConfig;

  return (
    <section id="qr-attendance" className="border-b border-hairline bg-surface-soft py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <AnimateOnScroll>
          <p className="text-sm font-medium uppercase tracking-wider text-brand">{qrSection.badge}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {qrSection.title}
          </h2>
          <p className="mt-4 text-body">{qrSection.subtitle}</p>
          <ol className="mt-8 space-y-5">
            {qrSection.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-display font-semibold text-ink">{step.title}</p>
                  <p className="mt-0.5 text-sm text-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {qrSection.footnote}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.15} className="flex justify-center lg:justify-end">
          <MotionCard className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-lg">
            <div className="aspect-[4/5] bg-surface-soft">
              <AssetImage
                src={assets.landing.featureQr}
                alt="Student scanning QR code for academy check-in"
                width={800}
                height={1000}
                className="h-full w-full object-cover object-top"
                fallback={<MiniQrCheckInUI />}
              />
            </div>
            <div className="border-t border-hairline bg-brand-soft/50 px-4 py-3">
              <p className="text-center text-xs font-medium text-brand">
                42 QR check-ins today · 8 manual by coaches
              </p>
            </div>
          </MotionCard>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
