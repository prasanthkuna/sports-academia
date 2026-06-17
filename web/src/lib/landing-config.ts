export type LandingFeatureIcon =
  | "attendance"
  | "fees"
  | "whatsapp"
  | "leads"
  | "excel"
  | "dashboard"
  | "qr"
  | "reports"
  | "coach"
  | "audit";

export type ProductFlowId =
  | "dashboard"
  | "fee_plans"
  | "renewals"
  | "leads"
  | "whatsapp"
  | "reminders"
  | "attendance"
  | "reports"
  | "receipts";

export type QrUseCaseId = "student" | "kiosk" | "trial" | "receipt" | "coach";

export type RoleLaneId = "owner" | "staff" | "coach";

export type DayTimelineMockId =
  | "dashboard"
  | "attendance"
  | "renewals"
  | "whatsapp"
  | "digest";

import {
  hyderabadDemoAcademy,
  hyderabadDemoDay,
  hyderabadFees,
  formatHyderabadInr,
} from "./hyderabad-market";

const fmt = formatHyderabadInr;
const DAY = hyderabadDemoDay;

export const landingConfig = {
  siteUrl: "https://sports-academia.vercel.app",
  contact: {
    email: "prasanth@academyops.in",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  whatsapp: {
    number: "919008393030",
    message: "Hi, I'm interested in Academy Ops for my sports academy.",
  },
  demo: {
    slug: "kca-hyderabad",
    logins: [
      { role: "Owner", email: "owner@demo.academy" },
      { role: "Staff", email: "staff@demo.academy" },
      { role: "Coach", email: "coach@demo.academy" },
    ],
    password: "Demo@123456",
    tryLinks: [
      {
        label: "Owner renewal dashboard",
        href: "/login?role=owner",
        hint: "owner@demo.academy — overdue, sessions left, expired-but-attended",
      },
      {
        label: "Open demo dashboard",
        href: "/login?role=staff",
        hint: "staff@demo.academy — fee plans, collect fees, reminders",
      },
      {
        label: "Verify a receipt",
        href: "/verify/receipt/demo_receipt_verify_0001",
        hint: "Payment proof for parents",
      },
      {
        label: "Trial visitor check-in",
        href: "/a/kca-hyderabad/trial/demo_trial_ayaan_khan",
        hint: undefined,
      },
      {
        label: "Student QR check-in",
        href: "/a/kca-hyderabad/check-in/demo_qr_arjun_kumar_0001",
        hint: "PIN: 6655 · Pro attendance proof",
      },
      {
        label: "Public enquiry page",
        href: "/a/kca-hyderabad/enquire",
        hint: undefined,
      },
    ] as const,
  },
  hero: {
    badge: "Built for sports academy owners",
    headline:
      "Know who paid, who expired, who attended, and who needs a WhatsApp reminder — before the next batch.",
    subhead:
      "Renewal control, payment proof, and attendance visibility in one phone-first app. QR check-in on Pro gives owners proof — not another register to chase.",
    trustLine: `Live demo · ${hyderabadDemoAcademy.activeStudents} students · cricket fees from ${fmt(hyderabadFees.cricketMonthly)}/month`,
    chips: ["Fee plans & auto demands", "Sessions remaining", "Renewal dashboard", "Receipt verify"],
  },
  ownerQuestions: [
    {
      question: "Who paid — and who got a receipt?",
      answer: "Every cash or UPI payment gets a numbered receipt. Parents can verify online. Staff actions logged.",
      flowId: "receipts" as ProductFlowId,
    },
    {
      question: "Who is overdue or due for renewal?",
      answer:
        "Renewal dashboard shows overdue, due this week, paid today, and renewal pending. Monthly and quarterly plans auto-generate demands.",
      flowId: "renewals" as ProductFlowId,
    },
    {
      question: "How many sessions are left on the package?",
      answer:
        "Session packages and personal coaching track sessions used vs remaining. Attendance marks consume a session — coaches see warnings, not blocked yet.",
      flowId: "fee_plans" as ProductFlowId,
    },
    {
      question: "Who actually attended today?",
      answer:
        "Batch attendance plus QR check-in on Pro. Fee overdue and package expiry warnings show at roll call — attendance proof linked to renewal control.",
      flowId: "attendance" as ProductFlowId,
    },
    {
      question: "Who paid by UPI but wasn't marked?",
      answer: "Record payment on the spot, send WhatsApp receipt immediately. No screenshot lost in chat.",
      flowId: "whatsapp" as ProductFlowId,
    },
    {
      question: "Which trial never got followed up?",
      answer: "Enquiry → trial booked → attended → converted. Trial QR check-in moves the pipeline automatically.",
      flowId: "leads" as ProductFlowId,
    },
  ],
  problemSolutions: [
    {
      problem: "Renewal leakage",
      solution: "Pending, overdue & partial fees · reminder queue · owner digest",
    },
    {
      problem: "Payment proof chaos",
      solution: "PDF receipts · public verify link · collected-by tracking",
    },
    {
      problem: "Attendance unclear",
      solution: "Batch roll call · QR gate check-in on Pro · coach-scoped access",
    },
    {
      problem: "WhatsApp thread mess",
      solution: "Tap-to-send receipts & reminders · every send logged",
    },
    {
      problem: "Trial enquiries lost",
      solution: "Public page · lead pipeline · trial check-in QR",
    },
    {
      problem: "Package expiry invisible",
      solution: "Sessions remaining · expired-but-attended alerts · summer camp validity",
    },
    {
      problem: "Excel & register chaos",
      solution: "Fee plan assignments · smart Excel import · audit logs",
    },
  ],
  roadmapNote:
    "Coming next: online payment gateway, UPI auto-match, and configurable attendance blocking for expired packages.",
  feePlanTypes: [
    {
      type: "Monthly",
      example: `${fmt(hyderabadFees.cricketMonthly)}/month cricket · U12 batch`,
    },
    {
      type: "Quarterly",
      example: `${fmt(hyderabadFees.cricketQuarterly)}/quarter · ~5% off 3× monthly`,
    },
    {
      type: "Admission",
      example: `${fmt(hyderabadFees.admission)} one-time registration`,
    },
    {
      type: "Session package",
      example: `8 sessions ${fmt(hyderabadFees.badminton8SessionPackage)} · beginner badminton`,
    },
    {
      type: "Personal coaching",
      example: `${fmt(hyderabadFees.personalCoachingMonthly)}/month · 1:1 cricket`,
    },
    {
      type: "Summer camp",
      example: `4-week cricket ${fmt(hyderabadFees.summerCamp4WeekCricket)} · May–Jun camp`,
    },
  ],
  feePlanBullets: [
    "Assign a plan once — demands generate for monthly & quarterly",
    "Session packages decrement when student is marked present",
    "Owner renewal dashboard: paid today, overdue, expiring, sessions left",
    "Expired package + still attending — flagged before you lose money",
  ],
  renewalDashboardWidgets: [
    {
      label: "Paid today",
      value: fmt(hyderabadDemoDay.collectedToday),
      hint: `${hyderabadDemoDay.paymentsToday.upi} UPI · ${hyderabadDemoDay.paymentsToday.cash} cash`,
    },
    {
      label: "Overdue",
      value: `${hyderabadDemoDay.overdueStudents} students`,
      hint: `${fmt(hyderabadDemoDay.overdueTotal)} pending`,
    },
    {
      label: "Due this week",
      value: `${hyderabadDemoDay.dueThisWeek} renewals`,
      hint: "5th-of-month cricket cycle",
    },
    {
      label: "Sessions left",
      value: `${hyderabadDemoDay.sessionsRemaining} remaining`,
      hint: `${hyderabadDemoDay.sessionsRemainingStudent} · ${hyderabadDemoDay.sessionsRemainingSport}`,
    },
  ],
  productFlows: [
    {
      id: "dashboard" as ProductFlowId,
      label: "Dashboard",
      title: "Owner money view",
      description:
        "Today's collection, overdue fees, pending renewals, attendance split, and trials — one screen before you call staff.",
    },
    {
      id: "fee_plans" as ProductFlowId,
      label: "Fee plans",
      title: "Plan engine for every billing model",
      description:
        "Monthly, quarterly, admission, session packages, personal coaching, and summer camps. Assign to a student — demands and session tracking follow.",
    },
    {
      id: "renewals" as ProductFlowId,
      label: "Renewals",
      title: "Owner renewal dashboard",
      description:
        "Paid today, overdue, due this week, sessions remaining, expired-but-attended, and renewal pending — the money screen owners open first.",
    },
    {
      id: "leads" as ProductFlowId,
      label: "Leads",
      title: "Enquiry to enrolment",
      description: "Public page captures leads. Trial visitors check in by QR. Track every stage to conversion.",
    },
    {
      id: "whatsapp" as ProductFlowId,
      label: "WhatsApp",
      title: "Parent follow-up",
      description: "One tap opens WhatsApp with PDF receipt or reminder pre-filled. You review and send — logged every time.",
    },
    {
      id: "reminders" as ProductFlowId,
      label: "Reminders",
      title: "Renewal reminder queue",
      description: "Build today's queue for overdue or due fees. Staff tap to send on WhatsApp — no auto blast.",
    },
    {
      id: "attendance" as ProductFlowId,
      label: "Attendance",
      title: "Proof students showed up",
      description: "Manual batch roll call on Starter. Pro adds QR gate check-in plus fee and package warnings at roll call.",
    },
    {
      id: "reports" as ProductFlowId,
      label: "Reports",
      title: "Export to Excel",
      description: "Financial, attendance, and lead reports by date range — Pro export for month-end.",
    },
    {
      id: "receipts" as ProductFlowId,
      label: "Receipts",
      title: "Payment proof",
      description: "Sequential receipt numbers, PDF for WhatsApp, and a public verify page parents can check.",
    },
  ],
  qrUseCases: [
    {
      id: "student" as QrUseCaseId,
      title: "Student ID scan",
      description: "Attendance proof at the gate — connects to owner dashboard QR vs manual counts.",
      demoHref: "/a/kca-hyderabad/check-in/demo_qr_arjun_kumar_0001",
    },
    {
      id: "trial" as QrUseCaseId,
      title: "Trial check-in",
      description: "Trial visitor scans from enquiry link. Pipeline moves to trial attended automatically.",
      demoHref: "/a/kca-hyderabad/trial/demo_trial_ayaan_khan",
    },
    {
      id: "receipt" as QrUseCaseId,
      title: "Receipt verify",
      description: "Parents confirm payment details — ends UPI screenshot arguments.",
      demoHref: "/verify/receipt/demo_receipt_verify_0001",
    },
    {
      id: "kiosk" as QrUseCaseId,
      title: "Entrance kiosk",
      description: "Batch poster QR for week-one before ID cards arrive.",
      demoHref: null,
    },
    {
      id: "coach" as QrUseCaseId,
      title: "Coach batch shortcut",
      description: "Coach opens today's attendance sheet by scanning batch QR.",
      demoHref: null,
    },
  ],
  roleLanes: [
    {
      id: "owner" as RoleLaneId,
      title: "Owner",
      subtitle: "Renewal & visibility",
      bullets: [
        "Renewal dashboard — overdue, expiring, sessions remaining",
        "One-tap daily digest for WhatsApp",
        "Expired-but-attended alerts before money leaks",
        "QR vs manual attendance split on Pro",
      ],
    },
    {
      id: "staff" as RoleLaneId,
      title: "Staff",
      subtitle: "Front desk ops",
      bullets: [
        "Create fee plans and assign to students",
        "Collect fees, partial pay, and send receipts",
        "Build and send renewal reminder queue",
        "Manage leads and Excel import",
      ],
    },
    {
      id: "coach" as RoleLaneId,
      title: "Coach",
      subtitle: "Batches only",
      bullets: [
        "Mark attendance for assigned batches only",
        "See fee & package warnings — not full fee data",
        "Session packages auto-consume on present mark",
        "QR check-in reduces manual roll call",
      ],
    },
  ],
  dayTimeline: [
    {
      time: "07:30",
      title: "Owner opens renewal snapshot",
      body: `${DAY.overdueStudents} overdue · ${fmt(DAY.overdueTotal)} pending · ${DAY.dueThisWeek} due this week — before the first batch.`,
      mock: "dashboard" as DayTimelineMockId,
    },
    {
      time: "08:00",
      title: "Coach marks roll call",
      body: `${DAY.sessionsRemainingStudent} shows ${DAY.sessionsRemaining} sessions left. Overdue fees flagged — present still allowed.`,
      mock: "attendance" as DayTimelineMockId,
    },
    {
      time: "08:15",
      title: "Staff collects renewal at desk",
      body: `${fmt(hyderabadFees.cricketMonthly)} July renewal — UPI or cash. Balance and receipt updated on the spot.`,
      mock: "renewals" as DayTimelineMockId,
    },
    {
      time: "08:20",
      title: "WhatsApp receipt sent",
      body: `Parent gets PDF proof for ${fmt(hyderabadFees.cricketMonthly)}. Logged — no duplicate reminders later.`,
      mock: "whatsapp" as DayTimelineMockId,
    },
    {
      time: "20:00",
      title: "Owner sends daily digest",
      body: `${DAY.presentTotal}/${hyderabadDemoAcademy.activeStudents} present · ${fmt(DAY.collectedToday)} collected · ${fmt(DAY.overdueTotal)} overdue — one tap to WhatsApp.`,
      mock: "digest" as DayTimelineMockId,
    },
  ],
  planMatrix: [
    { feature: "Fee plans (monthly, quarterly, camp)", starter: true, pro: true, highlight: true },
    { feature: "Auto recurring fee demands", starter: true, pro: true, highlight: true },
    { feature: "Renewal dashboard (owner view)", starter: true, pro: true, highlight: true },
    { feature: "Session packages + sessions remaining", starter: true, pro: true, highlight: true },
    { feature: "Attendance fee/package warnings", starter: true, pro: true, highlight: false },
    { feature: "Partial payments + receipts", starter: true, pro: true, highlight: false },
    { feature: "Renewal reminder queue (WhatsApp)", starter: false, pro: true, highlight: true },
    { feature: "Owner daily digest", starter: false, pro: true, highlight: false },
    { feature: "Receipt verify link", starter: true, pro: true, highlight: false },
    { feature: "QR attendance proof", starter: false, pro: true, highlight: false },
    { feature: "Lead & trial pipeline", starter: true, pro: true, highlight: false },
    { feature: "Coach logins (scoped)", starter: false, pro: true, highlight: false },
    { feature: "Reports + Excel export", starter: false, pro: true, highlight: false },
    { feature: "Audit logs", starter: false, pro: true, highlight: false },
    { feature: "Online payment gateway", starter: false, pro: false, highlight: false, soon: true },
  ],
  pricing: {
    setup: {
      amount: 19999,
      title: "One-time setup",
      subtitle: "Single location · go-live in about a week",
      includes: [
        "Academy configuration & go-live support",
        "First Excel student import",
        "Staff training session",
        "Public academy page configured",
      ],
    },
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: 4999,
        period: "month",
        description: "Renewal tracking for a single-location academy",
        idealFor: "Owner on the ground · up to 150 students",
        popular: false,
        features: [
          "Up to 150 students",
          "Up to 3 staff users (no coach login)",
          "Up to 6 batches · 1 sport",
          "Fee plans — monthly, quarterly, packages, camps",
          "Auto recurring demands + renewal dashboard",
          "Session packages with sessions remaining",
          "Attendance fee & package warnings",
          "Fee collection + PDF receipts",
          "WhatsApp receipt (tap-to-send)",
          "Public academy page + lead pipeline",
          "Manual attendance",
          "Standard email & chat support",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: 9999,
        period: "month",
        description: "Full renewal control for growing academies",
        idealFor: "3+ staff · QR attendance proof · month-end reporting",
        popular: true,
        features: [
          "Everything in Starter",
          "Unlimited students, staff & batches",
          "Multi-sport academy setup",
          "QR attendance — proof at the gate",
          "Coach logins (assigned batches only)",
          "Owner digest + renewal reminder queue",
          "Expired-but-attended alerts",
          "Financial, attendance & lead reports",
          "Export reports to Excel",
          "Receipt verify + audit logs",
          "Trial check-in QR + ID cards",
          "Smart Excel import anytime",
          "Priority support + annual staff refresher",
        ],
      },
    ],
    footnote:
      "All plans include fee plans, renewal dashboard, and secure cloud hosting per academy. WhatsApp is tap-to-send — you stay in control. Online payment gateway coming next.",
  },
  faqs: [
    {
      q: "Is this fee collection software or renewal tracking?",
      a: "Both — but the point is renewal control. You see who paid, who is overdue, who got a receipt, and who needs a WhatsApp reminder. Collecting on the ground is one step in that loop, not the whole product.",
    },
    {
      q: "What fee amounts should I set?",
      a: `Most cricket academies charge ${fmt(2500)}–${fmt(5000)}/month. Quarterly plans run ${fmt(8000)}–${fmt(9000)}. Swimming with coaching is often ${fmt(2500)}–${fmt(3600)}/month. Summer cricket camps are typically ${fmt(3500)}–${fmt(5000)} for 4 weeks. You configure your own plans — the demo uses common mid-tier amounts.`,
    },
    {
      q: "Do you support swimming session packages or summer camps?",
      a: `Yes. For example: 8-session badminton at ${fmt(hyderabadFees.badminton8SessionPackage)}, swimming monthly at ${fmt(hyderabadFees.swimmingMonthlyWithCoach)}, or a 4-week summer cricket camp at ${fmt(hyderabadFees.summerCamp4WeekCricket)}. Assign any plan — sessions remaining, expiry, and auto-demands follow.`,
    },
    {
      q: "What is the renewal dashboard?",
      a: "Owners open /renewals to see paid today, overdue fees, renewals due this week, sessions remaining on packages, and students who attended today on an expired package. Staff use /fees to collect on the ground.",
    },
    {
      q: "How do session packages work?",
      a: "Create an 8-session or 12-session plan, assign to the student. Each present attendance mark consumes one session. The renewal dashboard shows sessions remaining. Coaches see a warning at roll call — attendance is not blocked yet.",
    },
    {
      q: "How do fee reminders work?",
      a: "Pro builds a queue of overdue or due fees for today. Staff tap to open WhatsApp with a pre-filled message for each parent. Nothing sends without your approval.",
    },
    {
      q: "Can parents verify they paid?",
      a: "Yes. Every receipt has a number and a public verify link — useful when parents say they paid by UPI but staff forgot to update.",
    },
    {
      q: "How does QR attendance fit in?",
      a: "On Pro, students scan at the gate for attendance proof. It connects to your dashboard (QR vs manual counts). It supports renewal control — you know who showed up, not just who paid.",
    },
    {
      q: "What's the difference between Starter and Pro?",
      a: "Both include fee plans, renewal dashboard, session packages, and attendance warnings. Pro adds QR gate check-in, coach logins, owner digest, reminder queue, reports export, audit logs, and trial check-in QR.",
    },
    {
      q: "How does the owner daily digest work?",
      a: "Pro generates a summary of today's attendance, fees collected, and overdue amounts. You tap once to open WhatsApp with the message pre-filled — you review and send.",
    },
    {
      q: "Can coaches see fee data?",
      a: "No. Coaches on Pro see only their assigned batches and attendance. Fees and academy-wide numbers stay with owner and staff.",
    },
    {
      q: "Can I import students from Excel?",
      a: "Yes. Setup includes the first bulk import. Pro includes smart Excel import anytime when you add a new batch or season.",
    },
    {
      q: "Can parents pay online through the app?",
      a: "You record cash or UPI payments and send a receipt. Online payment gateway is on the roadmap.",
    },
    {
      q: "Do parents need to install an app?",
      a: "No. Staff use the web app on phones. Parents interact through WhatsApp and public receipt verify links.",
    },
    {
      q: "What does setup include?",
      a: "We configure your academy, import your student list, train staff, and help you go live — typically within one week.",
    },
  ],
  navSections: [
    { id: "owner-questions", label: "Why" },
    { id: "fee-plans", label: "Fee plans" },
    { id: "product", label: "Product" },
    { id: "day-timeline", label: "A day" },
    { id: "attendance-proof", label: "Attendance" },
    { id: "demo", label: "Live demo" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ],
} as const;

export function whatsappUrl() {
  const { number, message } = landingConfig.whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
