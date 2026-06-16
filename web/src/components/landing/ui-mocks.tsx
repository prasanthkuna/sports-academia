"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, MapPin, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/landing/motion/count-up";
import { cn } from "@/lib/utils";

export type BenefitMockId = "attendance" | "fees" | "whatsapp" | "qr";

export function PhoneFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[280px]", className)}>
      <div className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-brand/15 via-transparent to-ink/5 blur-xl" />
      <div className="relative rounded-[2rem] border border-hairline bg-ink p-1.5 shadow-xl shadow-ink/15">
        <div className="overflow-hidden rounded-[1.6rem] bg-canvas">
          <div className="flex items-center justify-between bg-surface-soft px-3 py-1.5">
            <span className="text-[9px] font-medium text-muted">9:41</span>
            <span className="text-[9px] font-semibold text-ink">{title}</span>
            <span className="h-1.5 w-5 rounded-full bg-hairline" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function BenefitAttendanceMock() {
  return (
    <div className="flex h-full min-h-[180px] flex-col justify-center p-5">
      <p className="text-[10px] font-medium text-muted">Morning Cricket U12</p>
      {["Arjun K.", "Priya M.", "Rohan S."].map((name, i) => (
        <div
          key={name}
          className="mt-2 flex items-center justify-between rounded-lg border border-hairline/60 bg-canvas px-3 py-2"
        >
          <span className="text-xs text-ink">{name}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9px] font-semibold",
              i !== 1 ? "bg-success-soft text-success" : "bg-error-soft text-error",
            )}
          >
            {i !== 1 ? "Present" : "Absent"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BenefitFeesMock() {
  return (
    <div className="flex h-full min-h-[180px] flex-col justify-center p-5">
      <p className="text-[10px] text-muted">Fee due</p>
      <p className="font-mono-amount mt-1 text-2xl font-semibold text-ink">₹2,500</p>
      <p className="mt-1 text-xs text-body">Arjun Kumar · Monthly</p>
      <div className="mt-4 rounded-md bg-ink py-2 text-center text-[10px] font-semibold text-white">
        Collect &amp; Receipt
      </div>
      <p className="mt-2 text-center text-[9px] text-muted">RCP-2026-0042</p>
    </div>
  );
}

export function BenefitWhatsappMock() {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 p-5">
      <div className="w-full rounded-lg border border-hairline bg-canvas p-3 text-[10px]">
        <p className="font-semibold text-ink">Receipt RCP-0042</p>
        <p className="mt-0.5 text-body">₹2,500 · Paid</p>
      </div>
      <div className="w-full max-w-[200px] self-end rounded-lg rounded-tr-none bg-[#DCF8C6] p-3 text-[10px] text-body">
        Fee received. Thank you!
      </div>
      <p className="text-[9px] font-medium text-[#128C7E]">Tap to send on WhatsApp</p>
    </div>
  );
}

export function BenefitQrMock() {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 p-5">
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-xl border-2 border-dashed border-brand/50 bg-brand-soft/30 p-3"
      >
        <QrCode className="h-12 w-12 text-brand" strokeWidth={1.25} />
      </motion.div>
      <p className="text-xs font-semibold text-ink">Arjun Kumar</p>
      <p className="text-[10px] text-muted">U12 Morning Cricket</p>
      <span className="mt-1 rounded-full bg-success-soft px-2 py-0.5 text-[9px] font-semibold text-success">
        Present · QR
      </span>
    </div>
  );
}

const benefitMocks: Record<BenefitMockId, React.ComponentType> = {
  attendance: BenefitAttendanceMock,
  fees: BenefitFeesMock,
  whatsapp: BenefitWhatsappMock,
  qr: BenefitQrMock,
};

export function BenefitMock({ id }: { id: BenefitMockId }) {
  const Mock = benefitMocks[id];
  return <Mock />;
}

type WalkthroughStep = "qr" | "fee" | "dashboard" | "whatsapp";

export function HeroPhoneMock() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<WalkthroughStep>("qr");

  useEffect(() => {
    if (reduced) return;
    const sequence: WalkthroughStep[] = ["qr", "fee", "dashboard", "whatsapp"];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % sequence.length;
      setStep(sequence[i]!);
    }, 3000);
    return () => clearInterval(timer);
  }, [reduced]);

  const active = reduced ? "dashboard" : step;

  return (
    <motion.div
      className="relative mx-auto w-[min(100%,280px)] sm:w-[300px]"
      animate={reduced ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-transparent to-ink/5 blur-2xl" />
      <PhoneFrame title="KCA Academy">
        <div className="min-h-[300px] space-y-3 p-4">
          <AnimatePresence mode="wait">
            {active === "qr" && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 text-center"
              >
                <div className="mx-auto w-fit rounded-xl border border-brand/30 bg-brand-soft/40 p-4">
                  <QrCode className="mx-auto h-14 w-14 text-brand" strokeWidth={1.25} />
                </div>
                <p className="text-xs font-semibold text-ink">Arjun Kumar</p>
                <p className="text-[10px] text-muted">U12 Morning Cricket</p>
                <div className="rounded-md bg-success py-2 text-xs font-semibold text-white">
                  Present · QR scan
                </div>
              </motion.div>
            )}
            {active === "fee" && (
              <motion.div
                key="fee"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-lg border border-hairline p-4">
                  <p className="text-xs font-medium text-ink">Arjun Kumar</p>
                  <p className="text-[10px] text-muted">Monthly fee</p>
                  <p className="font-mono-amount mt-2 text-2xl font-semibold text-ink">₹2,500</p>
                  <div className="mt-3 rounded-md bg-ink py-2 text-center text-[10px] font-semibold text-white">
                    Collect &amp; Receipt
                  </div>
                </div>
              </motion.div>
            )}
            {active === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-success-soft p-3">
                    <p className="text-[9px] text-muted">QR today</p>
                    <p className="font-mono-amount text-lg font-semibold text-ink">
                      <CountUp value={42} duration={0.8} />
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-soft p-3">
                    <p className="text-[9px] text-muted">Collected</p>
                    <p className="font-mono-amount text-lg font-semibold text-brand">
                      ₹<CountUp value={8240} duration={1} />
                    </p>
                  </div>
                </div>
                <p className="rounded-lg border border-hairline px-2 py-1.5 text-center text-[9px] text-body">
                  8 manual · 3 absent
                </p>
              </motion.div>
            )}
            {active === "whatsapp" && (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 p-4">
                  <p className="text-[9px] font-medium text-[#128C7E]">Tap to send</p>
                  <p className="mt-1 text-xs font-semibold text-ink">RCP-2026-0042</p>
                  <p className="text-[10px] text-body">₹2,500 · Arjun Kumar</p>
                  <p className="mt-2 rounded-lg bg-[#DCF8C6] p-2 text-[10px]">Fee received. Thank you!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhoneFrame>
    </motion.div>
  );
}

export function QrCheckInPhoneMock() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"scan" | "success">("scan");

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setPhase((p) => (p === "scan" ? "success" : "scan"));
    }, 3200);
    return () => clearInterval(timer);
  }, [reduced]);

  const active = reduced ? "success" : phase;

  return (
    <PhoneFrame title="KCA Check-in">
      <div className="relative min-h-[340px] p-5">
        <AnimatePresence mode="wait">
          {active === "scan" ? (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-brand/40 bg-brand-soft/20 p-5">
                <QrCode className="h-20 w-20 text-brand" strokeWidth={1.25} />
                {!reduced && (
                  <motion.div
                    className="absolute inset-x-2 h-0.5 bg-brand/60"
                    animate={{ top: ["10%", "85%", "10%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
              <p className="text-sm font-semibold text-ink">Scanning ID…</p>
              <p className="text-xs text-muted">U12 Morning Cricket</p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 pt-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-ink">Arjun Kumar</p>
              <p className="text-xs text-muted">Present · QR scan</p>
              <div className="w-full rounded-md bg-success py-2.5 text-center text-xs font-semibold text-white">
                Check-in complete
              </div>
              <p className="flex items-center gap-1 text-[10px] text-muted">
                <MapPin className="h-3 w-3 text-brand" />
                Within academy · PIN verified
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
