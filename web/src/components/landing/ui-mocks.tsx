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

/** Fixed iPhone 16 Pro mock dimensions — shell never resizes; only screen content crossfades. */
export const PHONE_WIDTH_PX = 280;
export const PHONE_SCREEN_HEIGHT_PX = 400;

/* ── iPhone 16 Pro frame (fixed size) ──────────────────────────── */

function PhoneScreen({
  screenKey,
  children,
}: {
  screenKey: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: PHONE_SCREEN_HEIGHT_PX }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screenKey}
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
  screenKey = "static",
}: {
  children: React.ReactNode;
  className?: string;
  /** When content swaps, pass a stable key so only the screen crossfades. */
  screenKey?: string;
}) {
  return (
    <div
      className={cn("relative mx-auto shrink-0", className)}
      style={{ width: PHONE_WIDTH_PX }}
    >
      <div className="pointer-events-none absolute -inset-4 rounded-[3.25rem] bg-gradient-to-br from-brand/20 via-transparent to-ink/8 blur-2xl" />
      <div className="relative rounded-[3rem] bg-gradient-to-b from-[#3a3a3c] via-[#1c1c1e] to-[#0a0a0a] p-[3px] shadow-2xl shadow-ink/25">
        <div className="absolute -left-[2px] top-[22%] z-10 h-8 w-[3px] rounded-l-sm bg-[#3a3a3c]" />
        <div className="absolute -left-[2px] top-[34%] z-10 h-12 w-[3px] rounded-l-sm bg-[#3a3a3c]" />
        <div className="absolute -left-[2px] top-[48%] z-10 h-12 w-[3px] rounded-l-sm bg-[#3a3a3c]" />
        <div className="absolute -right-[2px] top-[32%] z-10 h-16 w-[3px] rounded-r-sm bg-[#3a3a3c]" />
        <div className="overflow-hidden rounded-[2.85rem] bg-[#0a0a0a]">
          <div className="relative bg-canvas">
            <div className="relative flex h-10 shrink-0 items-center justify-between px-6 pt-2">
              <span className="text-[10px] font-semibold text-ink">9:41</span>
              <div className="absolute left-1/2 top-1.5 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-ink" />
              <div className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm border border-ink/40" />
                <span className="h-2.5 w-5 rounded-sm border border-ink/40" />
              </div>
            </div>
            <PhoneScreen screenKey={screenKey}>{children}</PhoneScreen>
            <div className="flex h-6 shrink-0 items-center justify-center pb-1">
              <div className="h-1 w-24 rounded-full bg-ink/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Wrapper for flow screen layouts — fills fixed viewport. */
function ScreenBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn("flex h-full flex-col p-5", className)}
      style={{ height: PHONE_SCREEN_HEIGHT_PX }}
    >
      {children}
    </div>
  );
}

/* ── Product flow mocks (Flow Map) ─────────────────────────────── */

function FlowDashboardContent() {
  return (
    <ScreenBody className="gap-2">
      <p className="text-xs font-semibold text-ink">Renewal snapshot</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-brand-soft p-3">
          <p className="text-[9px] text-muted">Collected today</p>
          <p className="font-mono-amount text-lg font-semibold tabular-nums text-brand">
            ₹<CountUp value={8240} duration={1} />
          </p>
        </div>
        <div className="rounded-lg bg-warning-soft/80 p-3">
          <p className="text-[9px] text-muted">Pending renewal</p>
          <p className="font-mono-amount text-lg font-semibold tabular-nums text-ink">5</p>
        </div>
      </div>
      <div className="rounded-lg bg-error-soft/50 px-3 py-2">
        <p className="text-[10px] font-medium text-error">Overdue · 2 students</p>
        <p className="text-xs text-ink">Rohan S. ₹2,500 · Priya M. ₹3,000</p>
      </div>
      <div className="rounded-lg border border-hairline px-3 py-2 text-[10px] text-body">
        42 present today · 34 QR · 8 manual
      </div>
      <p className="mt-auto text-center text-[10px] text-muted">2 trials attended today</p>
    </ScreenBody>
  );
}

function FlowRenewalsContent() {
  return (
    <ScreenBody>
      <p className="text-xs text-muted">July renewal</p>
      <p className="mt-1 text-sm font-medium text-ink">Arjun Kumar</p>
      <p className="font-mono-amount mt-2 text-3xl font-semibold text-ink">₹3,000</p>
      <p className="text-xs text-body">Monthly · U12 Morning · Due 5 Jul</p>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between rounded-lg bg-surface-soft px-3 py-2 text-xs">
          <span className="text-muted">Paid now</span>
          <span className="font-semibold text-ink">₹3,000</span>
        </div>
        <div className="flex justify-between rounded-lg border border-hairline px-3 py-2 text-xs">
          <span className="text-muted">Status</span>
          <span className="font-semibold text-success">Paid</span>
        </div>
      </div>
      <div className="mt-auto rounded-lg bg-ink py-2.5 text-center text-xs font-semibold text-white">
        Collect &amp; Receipt
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">RCP-2026-0042 · UPI</p>
    </ScreenBody>
  );
}

function FlowAttendanceContent() {
  return (
    <ScreenBody className="items-center justify-center gap-3 text-center">
      <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-4">
        <QrCode className="mx-auto h-14 w-14 text-brand" strokeWidth={1.25} />
      </div>
      <p className="text-sm font-semibold text-ink">Arjun Kumar</p>
      <p className="text-xs text-muted">U12 Morning Cricket</p>
      <div className="w-full rounded-lg bg-success py-2.5 text-xs font-semibold text-white">
        Present · attendance proof
      </div>
      <p className="flex items-center gap-1 text-[10px] text-muted">
        <MapPin className="h-3 w-3 text-brand" />
        Pro QR · geofence OK
      </p>
    </ScreenBody>
  );
}

function FlowReceiptsContent() {
  return (
    <ScreenBody className="justify-center gap-3">
      <div className="rounded-lg border border-hairline bg-canvas p-4 text-center">
        <p className="text-[10px] font-medium text-muted">Receipt verified</p>
        <p className="mt-1 font-mono-amount text-lg font-semibold text-ink">RCP-2026-0042</p>
        <p className="mt-2 text-sm text-ink">₹3,000 paid</p>
        <p className="text-xs text-body">Arjun Kumar · KCA Hyderabad</p>
        <p className="mt-2 text-[10px] text-success">Payment confirmed</p>
      </div>
      <p className="text-center text-[10px] text-muted">Public link — ends UPI disputes</p>
    </ScreenBody>
  );
}

function FlowWhatsappContent() {
  return (
    <ScreenBody className="justify-center gap-3">
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
    </ScreenBody>
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
    <ScreenBody>
      <p className="text-xs font-medium text-muted">Lead pipeline</p>
      <p className="mt-1 text-sm font-semibold text-ink">Ayaan Khan</p>
      <p className="text-xs text-body">Football U10 · via public page</p>
      <div className="mt-4 space-y-2">
        {stages.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
              s.done ? "bg-success-soft text-success" : "border border-hairline text-muted",
            )}
          >
            {s.done ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-hairline" />
            )}
            {s.label}
          </div>
        ))}
      </div>
      <p className="mt-auto text-center text-[10px] text-brand">Trial QR checked in today</p>
    </ScreenBody>
  );
}

function FlowReportsContent() {
  return (
    <ScreenBody>
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
      <div className="mt-auto rounded-lg bg-brand py-2.5 text-center text-xs font-semibold text-white">
        Export Excel
      </div>
      <p className="mt-2 text-center text-[10px] text-muted">Pro · date range picker</p>
    </ScreenBody>
  );
}

function FlowRemindersContent() {
  const items = [
    "Priya M. · July renewal overdue",
    "Rohan S. · ₹2,500 pending",
    "Vikram T. · renewal due Friday",
  ];
  return (
    <ScreenBody>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-brand" />
        <p className="text-xs font-semibold text-ink">Reminder queue</p>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between gap-2 rounded-lg border border-hairline px-3 py-2.5"
          >
            <span className="text-[10px] text-body">{item}</span>
            <span className="shrink-0 rounded-md bg-[#25D366]/15 px-2 py-1 text-[9px] font-semibold text-[#128C7E]">
              Send
            </span>
          </div>
        ))}
      </div>
      <p className="mt-auto text-center text-[10px] text-muted">
        Tap-to-send · you control every message
      </p>
    </ScreenBody>
  );
}

const flowContent: Record<ProductFlowId, React.ComponentType> = {
  dashboard: FlowDashboardContent,
  renewals: FlowRenewalsContent,
  leads: FlowLeadsContent,
  whatsapp: FlowWhatsappContent,
  reminders: FlowRemindersContent,
  attendance: FlowAttendanceContent,
  reports: FlowReportsContent,
  receipts: FlowReceiptsContent,
};

export function ProductFlowPhone({ flowId }: { flowId: ProductFlowId }) {
  const Content = flowContent[flowId];
  return (
    <PhoneFrame screenKey={flowId}>
      <Content />
    </PhoneFrame>
  );
}

/* ── Hero phone (auto-cycle, fixed shell) ──────────────────────── */

const HERO_FLOWS: ProductFlowId[] = ["dashboard", "renewals", "reminders", "whatsapp"];

export function HeroPhoneMock() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_FLOWS.length), 3200);
    return () => clearInterval(timer);
  }, [reduced]);

  const flowId = reduced ? "dashboard" : HERO_FLOWS[index]!;

  return (
    <div className="relative shrink-0" style={{ width: PHONE_WIDTH_PX }}>
      <div className="pointer-events-none absolute -inset-6 animate-pulse rounded-full bg-brand/10 blur-2xl" />
      <ProductFlowPhone flowId={flowId} />
    </div>
  );
}

/* ── QR check-in animated mock ───────────────────────────────── */

function QrScanContent() {
  const reduced = useReducedMotion();
  return (
    <ScreenBody className="items-center justify-center gap-4">
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
    </ScreenBody>
  );
}

function QrSuccessContent() {
  return (
    <ScreenBody className="items-center justify-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
        <Check className="h-7 w-7" strokeWidth={2.5} />
      </div>
      <p className="text-sm font-semibold text-ink">Arjun Kumar</p>
      <p className="text-xs text-muted">Present · attendance proof</p>
      <div className="w-full max-w-[220px] rounded-lg bg-success py-2.5 text-center text-xs font-semibold text-white">
        Check-in complete
      </div>
      <p className="flex items-center gap-1 text-[10px] text-muted">
        <MapPin className="h-3 w-3 text-brand" />
        Within academy · PIN verified
      </p>
    </ScreenBody>
  );
}

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
    <PhoneFrame screenKey={active}>
      {active === "scan" ? <QrScanContent /> : <QrSuccessContent />}
    </PhoneFrame>
  );
}

/* ── Role lane mocks ───────────────────────────────────────────── */

function RoleOwnerContent() {
  return <FlowDashboardContent />;
}

function RoleStaffContent() {
  return (
    <ScreenBody className="gap-3">
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
      <div className="mt-auto rounded-lg border border-hairline p-3">
        <p className="text-xs font-medium text-ink">Arjun Kumar · ₹2,500 due</p>
        <div className="mt-2 rounded-md bg-ink py-2 text-center text-[10px] font-semibold text-white">
          Collect &amp; Receipt
        </div>
      </div>
    </ScreenBody>
  );
}

function RoleCoachContent() {
  return (
    <ScreenBody>
      <p className="text-xs font-medium text-muted">My batches only</p>
      <p className="mt-1 text-sm font-semibold text-ink">U12 Morning Cricket</p>
      <div className="mt-3 space-y-2">
        {["Arjun K.", "Priya M.", "Rohan S.", "Sneha V."].map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border border-hairline/60 px-3 py-2"
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
      </div>
      <p className="mt-auto text-center text-[10px] text-muted">No fees · no academy-wide data</p>
    </ScreenBody>
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
    <PhoneFrame screenKey={roleId}>
      <Content />
    </PhoneFrame>
  );
}

/* ── Day timeline mini mocks (separate small frame) ────────────── */

const MINI_SCREEN_H = 200;

function MiniScreenBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col p-3", className)} style={{ height: MINI_SCREEN_H }}>
      {children}
    </div>
  );
}

function MiniDashboard() {
  return (
    <MiniScreenBody className="justify-center gap-1">
      <p className="text-[9px] font-semibold text-ink">Renewal snapshot</p>
      <p className="font-mono-amount text-sm font-semibold text-brand">₹8,240</p>
      <p className="text-[8px] text-error">2 overdue · 5 pending</p>
    </MiniScreenBody>
  );
}

function MiniAttendance() {
  return (
    <MiniScreenBody className="items-center justify-center gap-1 text-center">
      <QrCode className="h-8 w-8 text-brand" strokeWidth={1.25} />
      <p className="text-[10px] font-semibold text-ink">Arjun Kumar</p>
      <span className="rounded-full bg-success-soft px-2 py-0.5 text-[8px] font-semibold text-success">
        Present
      </span>
    </MiniScreenBody>
  );
}

function MiniRenewals() {
  return (
    <MiniScreenBody className="justify-center">
      <p className="font-mono-amount text-lg font-semibold text-ink">₹3,000</p>
      <p className="text-[9px] text-muted">July renewal · RCP-0042</p>
    </MiniScreenBody>
  );
}

function MiniDigest() {
  return (
    <MiniScreenBody className="justify-center gap-2">
      <p className="text-[10px] font-semibold text-ink">Daily digest</p>
      <div className="rounded border border-[#25D366]/30 bg-[#25D366]/5 p-2 text-[8px] leading-relaxed text-body">
        42 present · ₹8,240 collected · ₹5,000 overdue
      </div>
      <div className="rounded bg-[#128C7E] py-1.5 text-center text-[8px] font-semibold text-white">
        Send on WhatsApp
      </div>
    </MiniScreenBody>
  );
}

const dayMocks: Record<DayTimelineMockId, React.ComponentType> = {
  dashboard: MiniDashboard,
  attendance: MiniAttendance,
  renewals: MiniRenewals,
  whatsapp: () => (
    <MiniScreenBody className="justify-center">
      <div className="rounded rounded-tr-none bg-[#DCF8C6] p-2 text-[8px]">Fee received. Thank you!</div>
    </MiniScreenBody>
  ),
  digest: MiniDigest,
};

export function DayTimelineMiniMock({ mockId }: { mockId: DayTimelineMockId }) {
  const Content = dayMocks[mockId];
  return (
    <div
      className="shrink-0 overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-sm"
      style={{ width: 160 }}
    >
      <div className="flex h-6 items-center justify-center border-b border-hairline bg-surface-soft">
        <div className="h-2.5 w-10 rounded-full bg-ink/80" />
      </div>
      <div style={{ height: MINI_SCREEN_H }}>
        <Content />
      </div>
      <div className="flex h-4 items-center justify-center">
        <div className="h-0.5 w-10 rounded-full bg-ink/15" />
      </div>
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
