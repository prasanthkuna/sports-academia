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
      { role: "Admin", email: "admin@demo.academy" },
      { role: "Staff", email: "staff@demo.academy" },
      { role: "Coach", email: "coach@demo.academy" },
    ],
    password: "Demo@123456",
    tryLinks: [
      {
        label: "Open demo dashboard",
        href: "/login",
        hint: "owner@demo.academy — see overdue & today's collection",
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
    badge: "Built for Hyderabad sports academies",
    headline:
      "Know who paid, who expired, who attended, and who needs a WhatsApp reminder — before the next batch.",
    subhead:
      "Renewal control, payment proof, and attendance visibility in one phone-first app. QR check-in on Pro gives owners proof — not another register to chase.",
    trustLine: "Live demo with overdue fees, trials & receipts · No parent app required",
    chips: ["Overdue & pending fees", "Receipt verify", "Tap-to-send WhatsApp"],
  },
  ownerQuestions: [
    {
      question: "Who paid — and who got a receipt?",
      answer: "Every cash or UPI payment gets a numbered receipt. Parents can verify online. Staff actions logged.",
      flowId: "receipts" as ProductFlowId,
    },
    {
      question: "Who is overdue or due for renewal?",
      answer: "Pending and overdue fees on one screen. Partial payments tracked. Reminder queue for follow-up.",
      flowId: "renewals" as ProductFlowId,
    },
    {
      question: "Who actually attended today?",
      answer: "Batch attendance plus QR check-in on Pro. Owner sees QR vs manual split on the dashboard.",
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
      problem: "Excel & register chaos",
      solution: "Smart Excel import · audit logs · one dashboard",
    },
  ],
  roadmapNote:
    "Coming next: fee plans for monthly, quarterly, session packages & summer camps — with expiry alerts and sessions remaining.",
  productFlows: [
    {
      id: "dashboard" as ProductFlowId,
      label: "Dashboard",
      title: "Owner money view",
      description:
        "Today's collection, overdue fees, pending renewals, attendance split, and trials — one screen before you call staff.",
    },
    {
      id: "renewals" as ProductFlowId,
      label: "Renewals",
      title: "Track who owes what",
      description:
        "Pending, overdue, and partially paid fees with due dates. Collect on ground, generate receipt, balance updates instantly.",
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
      description: "Manual batch roll call on Starter. Pro adds QR self check-in at the gate with geofence and PIN.",
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
        "Overdue fees and today's collection at a glance",
        "One-tap daily digest for WhatsApp",
        "QR vs manual attendance split on Pro",
        "Reports, audit logs, and trial conversions",
      ],
    },
    {
      id: "staff" as RoleLaneId,
      title: "Staff",
      subtitle: "Front desk ops",
      bullets: [
        "Collect fees, partial pay, and send receipts",
        "Build and send renewal reminder queue",
        "Manage leads and Excel import",
        "Cannot change team or academy settings",
      ],
    },
    {
      id: "coach" as RoleLaneId,
      title: "Coach",
      subtitle: "Batches only",
      bullets: [
        "Mark attendance for assigned batches only",
        "See student roster — no fee data",
        "QR check-in reduces manual roll call",
        "Owner still sees the full picture",
      ],
    },
  ],
  dayTimeline: [
    {
      time: "07:30",
      title: "Owner checks renewal snapshot",
      body: "Dashboard shows overdue, pending, and today's collection before batches start.",
      mock: "dashboard" as DayTimelineMockId,
    },
    {
      time: "08:00",
      title: "Students check in",
      body: "QR scan or coach roll call — attendance proof, not a separate register.",
      mock: "attendance" as DayTimelineMockId,
    },
    {
      time: "08:15",
      title: "Fee collected on ground",
      body: "₹3,000 July renewal recorded — UPI or cash. Balance and receipt updated.",
      mock: "renewals" as DayTimelineMockId,
    },
    {
      time: "08:20",
      title: "WhatsApp receipt sent",
      body: "Parent gets PDF proof. Logged — no duplicate reminders later.",
      mock: "whatsapp" as DayTimelineMockId,
    },
    {
      time: "20:00",
      title: "Owner sends daily digest",
      body: "Attendance, collection, and overdue summary — one tap to WhatsApp.",
      mock: "digest" as DayTimelineMockId,
    },
  ],
  planMatrix: [
    { feature: "Overdue & pending fee tracking", starter: true, pro: true, highlight: true },
    { feature: "Partial payments + receipts", starter: true, pro: true, highlight: true },
    { feature: "Renewal reminder queue (WhatsApp)", starter: false, pro: true, highlight: true },
    { feature: "Owner daily digest", starter: false, pro: true, highlight: false },
    { feature: "Receipt verify link", starter: true, pro: true, highlight: false },
    { feature: "QR attendance proof", starter: false, pro: true, highlight: false },
    { feature: "Lead & trial pipeline", starter: true, pro: true, highlight: false },
    { feature: "Coach logins (scoped)", starter: false, pro: true, highlight: false },
    { feature: "Reports + Excel export", starter: false, pro: true, highlight: false },
    { feature: "Audit logs", starter: false, pro: true, highlight: false },
    { feature: "Session packages & camp plans", starter: false, pro: false, highlight: false, soon: true },
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
          "Pending, overdue & partial fee tracking",
          "Fee collection + PDF receipts",
          "WhatsApp receipt (tap-to-send)",
          "Public academy page + lead pipeline",
          "Manual attendance",
          "Owner dashboard (today's snapshot)",
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
          "Unlimited students, staff & batches",
          "Multi-sport academy setup",
          "QR attendance — proof at the gate",
          "Coach logins (assigned batches only)",
          "Owner dashboard + one-tap daily digest",
          "Renewal reminder queue (tap-to-send)",
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
      "All plans include secure cloud hosting per academy. WhatsApp is tap-to-send — you stay in control. Session packages & camp billing rolling out next.",
  },
  faqs: [
    {
      q: "Is this fee collection software or renewal tracking?",
      a: "Both — but the point is renewal control. You see who paid, who is overdue, who got a receipt, and who needs a WhatsApp reminder. Collecting on the ground is one step in that loop, not the whole product.",
    },
    {
      q: "Do you support swimming session packages or summer camps?",
      a: "Not yet as dedicated plan types. Today you track fees with due dates, partial payments, and overdue status. Session packages, quarterly plans, and camp billing are next on our roadmap with expiry alerts and sessions remaining.",
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
      a: "Starter covers renewal tracking, fees, receipts, leads, and manual attendance for smaller academies. Pro adds QR attendance proof, coach logins, owner digest, reminder queue, reports export, audit logs, and trial check-in.",
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
