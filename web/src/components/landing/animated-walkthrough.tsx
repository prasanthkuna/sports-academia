"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/landing/motion/count-up";

type Step = "dashboard" | "fee" | "whatsapp";

export function AnimatedWalkthrough() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>("dashboard");

  useEffect(() => {
    if (reduced) return;
    const sequence: Step[] = ["dashboard", "fee", "whatsapp"];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % sequence.length;
      setStep(sequence[i]!);
    }, 2800);
    return () => clearInterval(timer);
  }, [reduced]);

  const active = reduced ? "whatsapp" : step;

  return (
    <motion.div
      className="relative mx-auto w-[280px] sm:w-[300px]"
      animate={reduced ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-transparent to-ink/5 blur-2xl" />
      <div className="relative rounded-[2.25rem] border border-hairline bg-ink p-2 shadow-2xl shadow-ink/20">
        <div className="overflow-hidden rounded-[1.75rem] bg-canvas">
          <div className="flex items-center justify-between bg-surface-soft px-4 py-2">
            <span className="text-[10px] font-medium text-muted">9:41</span>
            <span className="text-[10px] font-semibold text-ink">KCA Dashboard</span>
            <span className="h-2 w-6 rounded-full bg-hairline" />
          </div>
          <div className="min-h-[280px] space-y-3 p-4">
            <AnimatePresence mode="wait">
              {active === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-success-soft p-3">
                      <p className="text-[10px] text-muted">Present today</p>
                      <p className="font-mono-amount text-lg font-semibold text-ink">
                        <CountUp value={142} duration={1} />
                      </p>
                    </div>
                    <div className="rounded-lg bg-brand-soft p-3">
                      <p className="text-[10px] text-muted">Collected</p>
                      <p className="font-mono-amount text-lg font-semibold text-brand">
                        ₹<CountUp value={8240} duration={1.2} />
                      </p>
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-muted">Step 1 · Mark attendance</p>
                </motion.div>
              )}
              {active === "fee" && (
                <motion.div
                  key="fee"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-3"
                >
                  <div className="rounded-lg border border-hairline p-4">
                    <p className="text-xs font-medium text-ink">Arjun Reddy</p>
                    <p className="text-[10px] text-muted">U12 Morning · Monthly fee</p>
                    <p className="font-mono-amount mt-3 text-2xl font-semibold text-ink">₹2,500</p>
                    <div className="mt-4 rounded-md bg-ink py-2.5 text-center text-xs font-semibold text-white">
                      Collect &amp; Receipt
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-muted">Step 2 · Collect fee on ground</p>
                </motion.div>
              )}
              {active === "whatsapp" && (
                <motion.div
                  key="whatsapp"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-3"
                >
                  <div className="rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 p-4">
                    <p className="text-[10px] font-medium text-[#128C7E]">Receipt sent on WhatsApp</p>
                    <p className="mt-2 text-xs font-semibold text-ink">RCP-2026-0042</p>
                    <p className="text-[10px] text-body">₹2,500 paid · Arjun Reddy</p>
                    <p className="mt-3 rounded-lg bg-[#DCF8C6] p-2 text-[10px] text-body">
                      Fee received. Thank you!
                    </p>
                  </div>
                  <p className="text-center text-[10px] text-muted">Step 3 · WhatsApp receipt to parent</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
