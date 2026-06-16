import { assets } from "@/lib/assets";

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
  sports: [
    "Cricket",
    "Football",
    "Badminton",
    "Swimming",
    "Tennis",
    "Table Tennis",
    "Kabaddi",
    "Athletics",
  ],
  hero: {
    badge: "Built for Indian sports academies",
    headline: "Scan at the gate. Collect fees. Send receipts on WhatsApp.",
    subhead:
      "One phone-first platform for academy owners and staff — QR self check-in on Pro, daily ops for everyone, no spreadsheets.",
    trustLine: "Trusted by academy owners across Hyderabad, Pune & Bangalore",
    chips: ["QR check-in on Pro", "Geofence + PIN security", "WhatsApp-ready receipts"],
  },
  howItWorks: [
    {
      key: "checkin",
      title: "Check in — scan or tap",
      body: "Pro: students scan their ID QR at the gate — attendance marks automatically. Starter: staff tap present or absent per batch.",
    },
    {
      key: "fees",
      title: "Collect fee on the spot",
      body: "Cash or UPI — record payment, generate receipt number, done before the kid leaves the net.",
    },
    {
      key: "dashboard",
      title: "Owner sees the full picture",
      body: "Live dashboard with QR vs manual counts, overdue fees, and leads. Pro owners get a one-tap daily digest for WhatsApp.",
    },
    {
      key: "whatsapp",
      title: "WhatsApp the receipt",
      body: "One tap opens a pre-filled WhatsApp message with a PDF receipt. Parents get proof — you get a clean trail.",
    },
  ],
  qrSection: {
    badge: "Pro centerpiece",
    title: "Parents scan at the gate — attendance is done",
    subtitle:
      "No app install. Students scan their ID QR on any phone, confirm their batch, and mark present. Coaches handle exceptions only.",
    steps: [
      {
        title: "Scan ID QR",
        body: "Printed on the ID card, shared on WhatsApp, or posted at the academy entrance.",
      },
      {
        title: "Confirm & check in",
        body: "Student sees their name and today's batch window. Optional PIN and geofence stop buddy scans.",
      },
      {
        title: "Owner sees it live",
        body: "Dashboard shows QR check-ins vs manual marks. Absent list updates before the next batch.",
      },
    ],
    footnote: "Includes digital ID cards, kiosk poster QR, and trial visitor check-in from your public page.",
  },
  benefitCards: [
    {
      title: "Batch attendance",
      description: "Daily roll call per batch — or let QR handle it on Pro while coaches mark exceptions.",
      imageSrc: assets.landing.featureAttendance,
    },
    {
      title: "Fee collection & receipts",
      description: "Sequential receipt numbers, partial payments, overdue tracking, and public receipt verification.",
      imageSrc: assets.landing.featureFees,
    },
    {
      title: "WhatsApp receipts",
      description: "One tap opens WhatsApp with a PDF receipt ready to send. Log every send so staff don't double-message.",
      imageSrc: assets.landing.featureWhatsapp,
    },
    {
      title: "QR gate check-in",
      description: "Students scan at arrival. Geofence and PIN optional. ID cards bulk-generated as PDF.",
      imageSrc: assets.landing.featureQr,
    },
  ],
  walkthroughSteps: [
    { title: "QR check-in", body: "Student scans ID QR — present marked before warm-up starts." },
    { title: "Collect fee", body: "Record cash or UPI — receipt number generated instantly." },
    { title: "Owner dashboard", body: "See QR vs manual attendance, fees collected, and who's overdue." },
    { title: "WhatsApp receipt", body: "One tap sends a clean PDF to the parent on WhatsApp." },
  ],
  features: [
    {
      icon: "qr" as LandingFeatureIcon,
      title: "QR self check-in",
      description: "Students scan at gate — no register, no coach chasing",
    },
    {
      icon: "attendance" as LandingFeatureIcon,
      title: "Batch attendance",
      description: "Manual tap-to-mark with daily history and coach scope",
    },
    {
      icon: "fees" as LandingFeatureIcon,
      title: "Fee collection",
      description: "Cash, UPI, partial — receipt in seconds",
    },
    {
      icon: "whatsapp" as LandingFeatureIcon,
      title: "WhatsApp receipts",
      description: "Pre-filled message with PDF receipt to parent",
    },
    {
      icon: "coach" as LandingFeatureIcon,
      title: "Coach logins",
      description: "Assigned batches only — Pro multi-staff ops",
    },
    {
      icon: "leads" as LandingFeatureIcon,
      title: "Lead management",
      description: "Enquiry → trial check-in → conversion pipeline",
    },
    {
      icon: "reports" as LandingFeatureIcon,
      title: "Reports & export",
      description: "Financial, attendance & lead reports — Excel export",
    },
    {
      icon: "excel" as LandingFeatureIcon,
      title: "Smart Excel import",
      description: "Bulk student import — adapts to your spreadsheet",
    },
    {
      icon: "dashboard" as LandingFeatureIcon,
      title: "Owner dashboard",
      description: "Revenue, QR counts, pending fees — one screen",
    },
    {
      icon: "audit" as LandingFeatureIcon,
      title: "Audit logs",
      description: "Who changed what — full accountability on Pro",
    },
  ],
  beforeAfter: {
    before: [
      "Excel registers scattered across staff phones",
      "Coach forgot to mark attendance — owner finds out late",
      "Fee follow-ups on WhatsApp with no receipt trail",
      "Owner calls staff daily for numbers",
      "Enquiries lost in personal chat threads",
    ],
    after: [
      "Students scan at gate — QR attendance on Pro",
      "One app for fees, receipts, leads, and reports",
      "Receipt sent to parent on WhatsApp in seconds",
      "Owner dashboard with QR vs manual split + export",
      "Public enquiry page with trial check-in QR",
    ],
  },
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
      q: "Is my academy data separate from others?",
      a: "Yes. Each academy is isolated. Your students, fees, and staff only see your data.",
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
    { id: "how-it-works", label: "How it works" },
    { id: "qr-attendance", label: "QR check-in" },
    { id: "features", label: "Features" },
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
