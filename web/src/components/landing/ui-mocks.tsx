"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Check,
  FileSpreadsheet,
  MapPin,
  QrCode,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/landing/motion/count-up";
import type {
  DayTimelineMockId,
  ProductFlowId,
  QrUseCaseId,
  RoleLaneId,
} from "@/lib/landing-config";
import { cn } from "@/lib/utils";

/* ── iPhone 16 Pro frame ───────────────────────────────────────── */

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[300px]", className)}>
      <div className="absolute -inset-4 rounded-[3.25rem] bg-gradient-to-br from-brand/20 via-transparent to-ink/8 blur-2xl" />
      <div className="relative rounded-[3rem] bg-gradient-to-b from-[#3a3a3c] via-[#1c1c1e] to-[#0a0a0a] p-[3px] shadow-2xl shadow-ink/25">
        <div className="absolute -left-[2px] top-[22%] h-8 w-[3px] rounded-l-sm bg-[#3a3a3c]" />
        <div className="absolute -left-[2px] top-[34%] h-12 w-[3px] rounded-l-sm bg-[#3a3a3c]" />
        <div className="absolute -left-[2px] top-[48%] h-12 w-[3px] rounded-l-sm bg-[#3a3a3c]" />
        <div className="absolute -right-[2px] top-[32%] h-16 w-[3px] rounded-r-sm bg-[#3a3a3c]" />
        <div className="overflow-hidden rounded-[2.85rem] bg-[#0a0a0a]">
          <div className="relative bg-canvas">
            <div className="flex items-center justify-between px-6 pb-1 pt-3">
              <span className="text-[10px] font-semibold text-ink">9:41</span>
              <div className="absolute left-1/2 top-2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-ink" />
              <div className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm border border-ink/40" />
                <span className="h-2.5 w-5 rounded-sm border border-ink/40" />
              </div>
            </div>
            {children}
            <div className="flex justify-center pb-2 pt-1">
              <div className="h-1 w-24 rounded-full bg-ink/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Product flow mocks (Flow Map) ─────────────────────────────── */

function FlowQrContent() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-5 text-center">
      <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-4">
        <QrCode className="mx-auto h-14 w-14 text-brand" strokeWidth={1.25} />
      </div>
      <p className="text-sm font-semibold text-ink">Arjun Kumar</p>
      <p className="text-xs text-muted">U12 Morning Cricket</p>
      <div className="w-full rounded-lg bg-success py-2.5 text-xs font-semibold text-white">
        Present · QR scan
      </div>
      <p className="flex items-center gap-1 text-[10px] text-muted">
        <MapPin className="h-3 w-3 text-brand" />
        Geofence OK · PIN verified
      </p>
    </div>
  );
}

function FlowFeesContent() {
  return (
    <div className="min-h-[320px] p-5">
      <p className="text-xs text-muted">Collect fee</p>
      <p className="mt-1 text-sm font-medium text-ink">Arjun Kumar</p>
      <p className="font-mono-amount mt-3 text-3xl font-semibold text-ink">₹2,500</p>
      <p className="text-xs text-body">Monthly · U12 Morning</p>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between rounded-lg bg-surface-soft px-3 py-2 text-xs">
          <span className="text-muted">Paid now</span>
          <span className="font-semibold text-ink">₹1,500</span>
        </div>
        <div className="flex justify-between rounded-lg border border-hairline px-3 py-2 text-xs">
          <span className="text-muted">Balance</span>
          <span className="font-semibold text-warning">₹1,000</span>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-ink py-2.5 text-center text-xs font-semibold text-white">
        Collect &amp; Receipt
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">RCP-2026-0042</p>
    </div>
  );
}

function FlowWhatsappContent() {
  return (
    <div className="flex min-h-[320px] flex-col justify-center gap-3 p-5">
      <div className="rounded-lg border border-hairline bg-canvas p-3 text-xs">
        <p className="font-semibold text-ink">Receipt RCP-2026-0042</p>
        <p className="mt-0.5 text-body">₹2,500 · Arjun Kumar</p>
      </div>
      <div className="self-end rounded-lg rounded-tr-none bg-[#DCF8C6] p-3 text-xs text-body">
        Fee received for U12 Morning Cricket. Thank you!
      </div>
      <div className="rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 py-2.5 text-center text-xs font-semibold text-[#128C7E]">
        Open WhatsApp to send
      </div>
      <p className="text-center text-[10px] text-muted">Logged · no duplicate sends</p>
    </div>
  );
}

function FlowLeadsContent() {
  const stages = [
    { label: "Enquiry", done: true },
    { label: "Trial booked", done: true },
    { label: "Trial attended", done: true },
    { label: "Converted", done: false },
  ];
  return (
    <div className="min-h-[320px] p-5">
      <p className="text-xs font-medium text-muted">Lead pipeline</p>
      <p className="mt-1 text-sm font-semibold text-ink">Ayaan Khan</p>
      <p className="text-xs text-body">Football U10 · via public page</p>
      <div className="mt-5 space-y-2">
        {stages.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
              s.done ? "bg-success-soft text-success" : "border border-hairline text-muted",
            )}
          >
            {s.done ? <Check className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 rounded-full border border-hairline" />}
            {s.label}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[10px] text-brand">Trial QR checked in today</p>
    </div>
  );
}

function FlowDashboardContent() {
  return (
    <div className="min-h-[320px] space-y-3 p-5">
      <p className="text-xs font-semibold text-ink">Today&apos;s snapshot</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-success-soft p-3">
          <p className="text-[9px] text-muted">QR check-ins</p>
          <p className="font-mono-amount text-xl font-semibold text-ink">
            <CountUp value={42} duration={0.8} />
          </p>
        </div>
        <div className="rounded-lg bg-brand-soft p-3">
          <p className="text-[9px] text-muted">Collected</p>
          <p className="font-mono-amount text-xl font-semibold text-brand">
            ₹<CountUp value={8240} duration={1} />
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-hairline px-3 py-2 text-center text-[10px] text-body">
        8 manual · 3 absent · 2 trials today
      </div>
      <div className="rounded-lg bg-error-soft/50 px-3 py-2">
        <p className="text-[10px] font-medium text-error">Overdue</p>
        <p className="text-xs text-ink">Rohan S. · ₹2,500</p>
      </div>
    </div>
  );
}

function FlowIdCardsContent() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-5">
      <div className="w-full max-w-[200px] rounded-lg border border-hairline bg-canvas p-3 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-wider text-brand">KCA Hyderabad</p>
        <div className="mt-2 flex gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
            AK
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">Arjun Kumar</p>
            <p className="text-[9px] text-muted">U12 Morning</p>
          </div>
        </div>
        <div className="mt-2 flex justify-center rounded bg-surface-soft p-2">
          <QrCode className="h-10 w-10 text-brand" strokeWidth={1.25} />
        </div>
      </div>
      <p className="text-xs font-medium text-ink">Bulk PDF · all students</p>
      <p className="text-[10px] text-muted">Same QR powers gate check-in</p>
    </div>
  );
}

function FlowReportsContent() {
  return (
    <div className="min-h-[320px] p-5">
      <p className="text-xs font-medium text-muted">Reports · Jun 2026</p>
      <div className="mt-3 space-y-2">
        {["Financial", "Attendance", "Leads"].map((r) => (
          <div
            key={r}
            className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2.5"
          >
            <span className="text-xs font-medium text-ink">{r}</span>
            <FileSpreadsheet className="h-4 w-4 text-brand" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-brand py-2.5 text-center text-xs font-semibold text-white">
        Export Excel
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">Pro · date range picker</p>
    </div>
  );
}

function FlowRemindersContent() {
  const items = ["Priya M. · ₹2,500 overdue", "Rohan S. · session tomorrow", "Vikram T. · ₹1,200 due"];
  return (
    <div className="min-h-[320px] p-5">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-brand" />
        <p className="text-xs font-semibold text-ink">Reminder queue</p>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-lg border border-hairline px-3 py-2.5"
          >
            <span className="text-[10px] text-body">{item}</span>
            <span className="rounded-md bg-[#25D366]/15 px-2 py-1 text-[9px] font-semibold text-[#128C7E]">
              Send
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[10px] text-muted">Tap-to-send · you control every message</p>
    </div>
  );
}

const flowContent: Record<ProductFlowId, React.ComponentType> = {
  qr: FlowQrContent,
  fees: FlowFeesContent,
  whatsapp: FlowWhatsappContent,
  leads: FlowLeadsContent,
  dashboard: FlowDashboardContent,
  id_cards: FlowIdCardsContent,
  reports: FlowReportsContent,
  reminders: FlowRemindersContent,
};

export function ProductFlowPhone({ flowId }: { flowId: ProductFlowId }) {
  const Content = flowContent[flowId];
  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={flowId}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <Content />
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}

/* ── Hero phone (auto-cycle) ───────────────────────────────────── */

export function HeroPhoneMock() {
  const reduced = useReducedMotion();
  const flows: ProductFlowId[] = ["qr", "dashboard", "fees", "whatsapp"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % flows.length), 3200);
    return () => clearInterval(timer);
  }, [reduced, flows.length]);

  const flowId = reduced ? "dashboard" : flows[index]!;

  return (
    <motion.div
      animate={reduced ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <ProductFlowPhone flowId={flowId} />
    </motion.div>
  );
}

/* ── QR check-in animated mock ───────────────────────────────── */

export function QrCheckInPhoneMock() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"scan" | "success">("scan");

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setPhase((p) => (p === "scan" ? "success" : "scan")), 3200);
    return () => clearInterval(timer);
  }, [reduced]);

  const active = reduced ? "success" : phase;

  return (
    <PhoneFrame>
      <div className="relative min-h-[320px] p-5">
        <AnimatePresence mode="wait">
          {active === "scan" ? (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 pt-6"
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
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 pt-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
                <Check className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-ink">Arjun Kumar</p>
              <p className="text-xs text-muted">Present · QR scan</p>
              <div className="w-full rounded-lg bg-success py-2.5 text-center text-xs font-semibold text-white">
                Check-in complete
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}

/* ── Role lane mocks ───────────────────────────────────────────── */

function RoleOwnerContent() {
  return <FlowDashboardContent />;
}

function RoleStaffContent() {
  return (
    <div className="min-h-[320px] space-y-3 p-5">
      <p className="text-xs font-semibold text-ink">Front desk</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Collect fee", icon: "₹" },
          { label: "Leads", icon: "3" },
          { label: "Reminders", icon: "5" },
          { label: "ID cards", icon: "PDF" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-hairline p-3 text-center">
            <p className="text-lg font-semibold text-brand">{item.icon}</p>
            <p className="mt-1 text-[10px] font-medium text-ink">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-hairline p-3">
        <p className="text-xs font-medium text-ink">Arjun Kumar · ₹2,500 due</p>
        <div className="mt-2 rounded-md bg-ink py-2 text-center text-[10px] font-semibold text-white">
          Collect &amp; Receipt
        </div>
      </div>
    </div>
  );
}

function RoleCoachContent() {
  return (
    <div className="min-h-[320px] p-5">
      <p className="text-xs font-medium text-muted">My batches only</p>
      <p className="mt-1 text-sm font-semibold text-ink">U12 Morning Cricket</p>
      {["Arjun K.", "Priya M.", "Rohan S.", "Sneha V."].map((name, i) => (
        <div
          key={name}
          className="mt-2 flex items-center justify-between rounded-lg border border-hairline/60 px-3 py-2"
        >
          <span className="text-xs text-ink">{name}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9px] font-semibold",
              i === 2 ? "bg-error-soft text-error" : "bg-success-soft text-success",
            )}
          >
            {i === 2 ? "Absent" : "Present"}
          </span>
        </div>
      ))}
      <p className="mt-4 text-center text-[10px] text-muted">No fees · no academy-wide data</p>
    </div>
  );
}

const roleContent: Record<RoleLaneId, React.ComponentType> = {
  owner: RoleOwnerContent,
  staff: RoleStaffContent,
  coach: RoleCoachContent,
};

export function RolePhoneMock({ roleId }: { roleId: RoleLaneId }) {
  const Content = roleContent[roleId];
  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        <motion.div
          key={roleId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <Content />
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}

/* ── Day timeline mini mocks ─────────────────────────────────── */

const dayMocks: Record<DayTimelineMockId, React.ComponentType> = {
  qr: FlowQrContent,
  attendance: RoleCoachContent,
  fees: FlowFeesContent,
  whatsapp: FlowWhatsappContent,
  digest: () => (
    <div className="flex min-h-[200px] flex-col justify-center gap-2 p-4">
      <p className="text-xs font-semibold text-ink">Daily digest</p>
      <div className="rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 p-3 text-[10px] leading-relaxed text-body">
        KCA today: 42 present (34 QR, 8 manual), ₹8,240 collected, ₹5,000 overdue across 2 students.
      </div>
      <div className="rounded-lg bg-[#128C7E] py-2 text-center text-[10px] font-semibold text-white">
        Send on WhatsApp
      </div>
    </div>
  ),
};

export function DayTimelineMiniMock({ mockId }: { mockId: DayTimelineMockId }) {
  const Content = dayMocks[mockId];
  return (
    <div className="w-full max-w-[200px] overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-sm">
      <div className="border-b border-hairline bg-surface-soft px-3 py-1.5">
        <div className="mx-auto h-3 w-12 rounded-full bg-ink/80" />
      </div>
      <Content />
    </div>
  );
}

/* ── QR use case icons ─────────────────────────────────────────── */

const qrIcons: Record<QrUseCaseId, LucideIcon> = {
  student: QrCode,
  kiosk: Users,
  trial: UserPlus,
  receipt: Check,
  coach: Users,
};

export function QrUseCaseIcon({ id, className }: { id: QrUseCaseId; className?: string }) {
  const Icon = qrIcons[id];
  return <Icon className={className} strokeWidth={1.5} />;
}
