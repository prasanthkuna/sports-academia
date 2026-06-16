"use client";

import {
  ClipboardCheck,
  FileBarChart,
  FileSpreadsheet,
  IndianRupee,
  LayoutDashboard,
  MessageCircle,
  QrCode,
  Shield,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { landingConfig, type LandingFeatureIcon } from "@/lib/landing-config";
import { MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { AnimateOnScroll } from "@/components/landing/motion/animate-on-scroll";

const iconMap: Record<LandingFeatureIcon, LucideIcon> = {
  attendance: ClipboardCheck,
  fees: IndianRupee,
  whatsapp: MessageCircle,
  leads: UserPlus,
  excel: FileSpreadsheet,
  dashboard: LayoutDashboard,
  qr: QrCode,
  reports: FileBarChart,
  coach: Users,
  audit: Shield,
};

export function FeaturesGrid() {
  return (
    <section id="features" className="border-b border-hairline bg-canvas py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll>
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Full platform</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything in one app
          </h2>
          <p className="mt-3 max-w-2xl text-body">
            Starter covers daily ops. Pro unlocks QR check-in, coach logins, reports, and audit.
          </p>
        </AnimateOnScroll>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingConfig.features.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <MotionCard
                key={feature.title}
                delay={i * 0.06}
                className="rounded-xl border border-hairline bg-surface-soft p-5 transition-shadow hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-brand" strokeWidth={1.5} />
                <h3 className="mt-3 font-display text-base font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{feature.description}</p>
              </MotionCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
