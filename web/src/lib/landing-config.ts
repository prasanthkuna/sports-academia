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
  | "qr"
  | "fees"
  | "whatsapp"
  | "leads"
  | "dashboard"
  | "id_cards"
  | "reports"
  | "reminders";

export type QrUseCaseId = "student" | "kiosk" | "trial" | "receipt" | "coach";

export type RoleLaneId = "owner" | "staff" | "coach";

export type DayTimelineMockId = "qr" | "attendance" | "fees" | "whatsapp" | "digest";

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
      { role: "Admin", email: "admin@demo.academy" },
      { role: "Owner", email: "owner@demo.academy" },
      { role: "Staff", email: "staff@demo.academy" },
      { role: "Coach", email: "coach@demo.academy" },
    ],
    password: "Demo@123456",
    tryLinks: [
      {
        label: "Student QR check-in",
        href: "/a/kca-hyderabad/check-in/demo_qr_arjun_kumar_0001",
        hint: "PIN: 6655",
      },
      {
        label: "Trial visitor check-in",
        href: "/a/kca-hyderabad/trial/demo_trial_ayaan_khan",
        hint: undefined,
      },
      {
        label: "Verify receipt",
        href: "/verify/receipt/demo_receipt_verify_0001",
        hint: undefined,
      },
      {
        label: "Public academy page",
        href: "/a/kca-hyderabad",
        hint: undefined,
      },
      {
        label: "Enquiry form",
        href: "/a/kca-hyderabad/enquire",
        hint: undefined,
      },
    ] as const,
  },
  hero: {
    badge: "Built for Indian sports academies",
    headline: "Your academy gate, fees, and parents — one platform.",
    subhead:
      "QR check-in at the gate, on-ground fee collection, coach logins, and WhatsApp receipts — built for how Indian sports academies actually run.",
    trustLine: "Live demo with sample data · Hyderabad, Pune & Bangalore academies",
    chips: ["QR check-in on Pro", "4 staff roles", "Tap-to-send WhatsApp"],
  },
  productFlows: [
    {
      id: "qr" as ProductFlowId,
      label: "QR check-in",
      title: "Students scan at the gate",
      description: "No app install. ID QR → confirm batch → present marked. Geofence and PIN optional.",
    },
    {
      id: "fees" as ProductFlowId,
      label: "Fees",
      title: "Collect on the ground",
      description: "Cash or UPI, partial payments, sequential receipt numbers, overdue tracking.",
    },
    {
      id: "whatsapp" as ProductFlowId,
      label: "WhatsApp",
      title: "Receipt to parent",
      description: "One tap opens WhatsApp with PDF receipt pre-filled. Every send logged.",
    },
    {
      id: "leads" as ProductFlowId,
      label: "Leads",
      title: "Enquiry to enrolment",
      description: "Public page captures leads. Trial visitors check in by QR. Track every stage.",
    },
    {
      id: "dashboard" as ProductFlowId,
      label: "Dashboard",
      title: "Owner snapshot",
      description: "QR vs manual split, today's collection, trials attended, overdue fees.",
    },
    {
      id: "id_cards" as ProductFlowId,
      label: "ID cards",
      title: "Bulk PDF with QR",
      description: "Generate printable ID cards for every student — same QR powers gate check-in.",
    },
    {
      id: "reports" as ProductFlowId,
      label: "Reports",
      title: "Export to Excel",
      description: "Financial, attendance, and lead reports by date range — Pro export.",
    },
    {
      id: "reminders" as ProductFlowId,
      label: "Reminders",
      title: "Fee & session queue",
      description: "Overdue and upcoming reminders queued. Staff tap to send on WhatsApp.",
    },
  ],
  qrUseCases: [
    {
      id: "student" as QrUseCaseId,
      title: "Student ID scan",
      description: "Personal QR on ID card or WhatsApp link. Primary gate check-in flow.",
      demoHref: "/a/kca-hyderabad/check-in/demo_qr_arjun_kumar_0001",
    },
    {
      id: "kiosk" as QrUseCaseId,
      title: "Entrance kiosk",
      description: "Batch poster QR at the ground — for week-one before ID cards arrive.",
      demoHref: null,
    },
    {
      id: "trial" as QrUseCaseId,
      title: "Trial check-in",
      description: "Trial visitor scans from enquiry link. Status moves to trial attended automatically.",
      demoHref: "/a/kca-hyderabad/trial/demo_trial_ayaan_khan",
    },
    {
      id: "receipt" as QrUseCaseId,
      title: "Receipt verify",
      description: "Parents scan receipt QR to confirm payment — ends 'I already paid' arguments.",
      demoHref: "/verify/receipt/demo_receipt_verify_0001",
    },
    {
      id: "coach" as QrUseCaseId,
      title: "Coach batch shortcut",
      description: "Coach scans batch QR while logged in — attendance sheet opens for today.",
      demoHref: null,
    },
  ],
  roleLanes: [
    {
      id: "owner" as RoleLaneId,
      title: "Owner",
      subtitle: "Full visibility",
      bullets: [
        "Dashboard with QR vs manual counts",
        "One-tap daily digest for WhatsApp",
        "Reports export and audit logs",
        "Overdue fees and trial conversions",
      ],
    },
    {
      id: "staff" as RoleLaneId,
      title: "Staff",
      subtitle: "Front desk ops",
      bullets: [
        "Collect fees and send receipts",
        "Manage leads and reminders queue",
        "Excel import and ID card generation",
        "No access to team or settings",
      ],
    },
    {
      id: "coach" as RoleLaneId,
      title: "Coach",
      subtitle: "Batches only",
      bullets: [
        "See only assigned batches",
        "Mark manual attendance",
        "View student roster per batch",
        "Cannot see fees or academy-wide data",
      ],
    },
  ],
  dayTimeline: [
    {
      time: "07:00",
      title: "Students scan at gate",
      body: "42 QR check-ins before warm-up. Coaches only handle exceptions.",
      mock: "qr" as DayTimelineMockId,
    },
    {
      time: "07:30",
      title: "Coach marks absentees",
      body: "3 students didn't scan — coach taps absent on the batch sheet.",
      mock: "attendance" as DayTimelineMockId,
    },
    {
      time: "08:00",
      title: "Fee collected on ground",
      body: "₹2,500 recorded — cash or UPI. Receipt RCP-2026-0042 generated.",
      mock: "fees" as DayTimelineMockId,
    },
    {
      time: "08:05",
      title: "WhatsApp receipt sent",
      body: "Staff taps send — parent gets PDF proof. Logged so no duplicate messages.",
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
    { feature: "QR gate check-in", starter: false, pro: true, highlight: true },
    { feature: "Coach logins (scoped batches)", starter: false, pro: true, highlight: true },
    { feature: "Reports + Excel export", starter: false, pro: true, highlight: true },
    { feature: "Manual attendance", starter: true, pro: true, highlight: false },
    { feature: "Fee collection + PDF receipts", starter: true, pro: true, highlight: false },
    { feature: "WhatsApp tap-to-send", starter: true, pro: true, highlight: false },
    { feature: "Public page + leads", starter: true, pro: true, highlight: false },
    { feature: "Owner dashboard", starter: true, pro: true, highlight: false },
    { feature: "ID cards + trial QR", starter: false, pro: true, highlight: false },
    { feature: "Digest + reminders queue", starter: false, pro: true, highlight: false },
    { feature: "Audit logs", starter: false, pro: true, highlight: false },
    { feature: "Multi-sport + unlimited scale", starter: false, pro: true, highlight: false },
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
        description: "Daily ops for a single-location academy",
        idealFor: "Owner on the ground · up to 150 students",
        popular: false,
        features: [
          "Up to 150 students",
          "Up to 3 staff users (no coach login)",
          "Up to 6 batches · 1 sport",
          "Manual attendance only — no QR check-in",
          "Student & batch management",
          "Fee collection + PDF receipts",
          "WhatsApp receipt (tap-to-send)",
          "Public academy page + enquiries",
          "Leads pipeline",
          "Owner dashboard (today's snapshot)",
          "Standard email & chat support",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: 9999,
        period: "month",
        description: "Full operations for growing academies",
        idealFor: "3+ staff · QR at gate · monthly reporting",
        popular: true,
        features: [
          "Unlimited students, staff & batches",
          "Multi-sport academy setup",
          "QR attendance — students scan at gate",
          "Coach logins (assigned batches only)",
          "Digital ID cards with check-in QR",
          "Public page + leads with trial check-in",
          "Owner dashboard + one-tap daily digest",
          "Financial, attendance & lead reports",
          "Export reports to Excel",
          "Smart Excel import anytime",
          "Geofenced check-in + PIN security",
          "Fee & session reminder queue (tap-to-send)",
          "Audit logs (who changed what)",
          "Google review booster after payment",
          "Priority support + annual staff refresher",
        ],
      },
    ],
    footnote:
      "All plans include secure cloud hosting and data isolation per academy. Setup fee applies once per location. WhatsApp messages are tap-to-send — no API blast.",
  },
  faqs: [
    {
      q: "How does QR attendance work?",
      a: "Each student gets a unique QR on their ID card or WhatsApp link. They scan it on any phone — no app install — confirm their name and today's batch, and mark present. Attendance records as a QR scan with optional PIN and geofence to stop remote or buddy check-ins.",
    },
    {
      q: "What is the entrance kiosk QR?",
      a: "A batch poster QR at the academy entrance. Students without ID cards yet (first week of season) can scan the poster and check in the same way. Pro academies use this alongside personal ID QRs.",
    },
    {
      q: "What's the difference between Starter and Pro?",
      a: "Starter fits a smaller academy with caps on students, staff, and batches — manual attendance and daily fees only. Pro removes limits and adds QR gate check-in, coach logins, ID cards, full reports with Excel export, owner digest, reminder queue, audit logs, and priority support.",
    },
    {
      q: "What is geofenced check-in?",
      a: "On Pro, you can require students to be within about 200 metres of your academy pin when they scan. Combined with an optional PIN (last 4 digits of registered mobile), it stops fake check-ins from home.",
    },
    {
      q: "Can coaches log in separately?",
      a: "Yes, on Pro. Coaches see only their assigned batches — mark manual attendance, view their students, and nothing else. Owners and admins retain full access.",
    },
    {
      q: "How does the owner daily digest work?",
      a: "Pro generates a summary of today's attendance, fees collected, and overdue amounts. You tap once to open WhatsApp with the message pre-filled — you review and send. No automatic blast without your approval.",
    },
    {
      q: "How do fee reminders work?",
      a: "Pro builds a queue of overdue or upcoming session reminders. Staff tap to open WhatsApp with a pre-filled message for each parent — you stay in control of every send.",
    },
    {
      q: "Can parents verify receipts?",
      a: "Yes. Every receipt gets a unique number and a public verify link you can share — parents confirm payment details without calling the office.",
    },
    {
      q: "Do I need a computer to run the academy?",
      a: "No. Attendance, fees, QR check-in, and WhatsApp receipts work on phones and tablets. Use a laptop for reports and bulk Excel imports when you need them.",
    },
    {
      q: "Can parents pay online?",
      a: "You record cash or UPI payments in the app and send a receipt. Online payment gateway integration is on the roadmap; today the focus is fast on-ground collection.",
    },
    {
      q: "Can I import students from Excel?",
      a: "Yes. Your one-time setup includes the first bulk import. Pro plans include smart Excel import anytime — the system adapts to common column layouts when you add a new batch or season.",
    },
    {
      q: "What does the one-time setup include?",
      a: "We configure your academy, import your student list from Excel, train your staff, and help you go live — typically within one week.",
    },
  ],
  navSections: [
    { id: "product", label: "Product" },
    { id: "qr-platform", label: "QR platform" },
    { id: "roles", label: "Roles" },
    { id: "day-timeline", label: "A day" },
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
