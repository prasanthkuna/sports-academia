"use client";

import { AssetImage } from "@/components/landing/asset-image";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { assets } from "@/lib/assets";

type FeatureCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  fallback: React.ReactNode;
  delay: number;
};

function FeatureCard({ title, description, imageSrc, fallback, delay }: FeatureCardProps) {
  return (
    <MotionCard
      delay={delay}
      className="overflow-hidden rounded-xl border border-hairline bg-canvas transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] bg-surface-soft">
        <AssetImage
          src={imageSrc}
          alt={title}
          width={800}
          height={600}
          className="h-full w-full object-cover object-top"
          fallback={fallback}
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
      </div>
    </MotionCard>
  );
}

function MiniAttendanceUI() {
  return (
    <div className="flex h-full flex-col justify-center p-6">
      <p className="text-xs font-medium text-muted">Morning Cricket U12</p>
      {["Arjun R.", "Priya M.", "Rohan K."].map((name, i) => (
        <div key={name} className="mt-2 flex items-center justify-between rounded-lg bg-canvas px-3 py-2">
          <span className="text-sm text-ink">{name}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              i !== 1 ? "bg-success-soft text-success" : "bg-error-soft text-error"
            }`}
          >
            {i !== 1 ? "Present" : "Absent"}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniFeesUI() {
  return (
    <div className="flex h-full flex-col justify-center p-6">
      <p className="text-xs text-muted">Fee due</p>
      <p className="font-mono-amount mt-1 text-3xl font-semibold text-ink">₹2,500</p>
      <p className="mt-1 text-sm text-body">Arjun Reddy · Monthly</p>
      <div className="mt-4 rounded-md bg-ink py-2 text-center text-xs font-semibold text-white">
        Collect &amp; Receipt
      </div>
    </div>
  );
}

function MiniWhatsappUI() {
  return (
    <div className="flex h-full items-center justify-center gap-4 p-6">
      <div className="rounded-lg border border-hairline bg-canvas p-3 text-[10px] text-body">
        <p className="font-semibold text-ink">Receipt RCP-0042</p>
        <p className="mt-1">₹2,500 · Paid</p>
      </div>
      <div className="max-w-[140px] rounded-lg rounded-tl-none bg-[#DCF8C6] p-3 text-[10px] text-body">
        Fee received. Thank you!
      </div>
    </div>
  );
}

const features = [
  {
    title: "Batch attendance",
    description: "Daily roll call per batch with clear present/absent status and history.",
    imageSrc: assets.landing.featureAttendance,
    fallback: <MiniAttendanceUI />,
  },
  {
    title: "Fee collection & receipts",
    description: "Sequential receipt numbers, partial payments, and overdue tracking built in.",
    imageSrc: assets.landing.featureFees,
    fallback: <MiniFeesUI />,
  },
  {
    title: "WhatsApp receipts",
    description: "Log WhatsApp sends so staff know parents were notified — no duplicate messages.",
    imageSrc: assets.landing.featureWhatsapp,
    fallback: <MiniWhatsappUI />,
  },
];

export function BenefitsSection() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Features</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything your front desk needs
          </h2>
        </AnimateOnScroll>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
