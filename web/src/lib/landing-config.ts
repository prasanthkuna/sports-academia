import { assets } from "@/lib/assets";

export type LandingFeatureIcon =
  | "attendance"
  | "fees"
  | "whatsapp"
  | "leads"
  | "excel"
  | "dashboard";

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
  stats: [
    { value: 5, suffix: "+", label: "Academies onboarded" },
    { value: 1000, suffix: "+", label: "Students managed" },
    { value: 30, prefix: "₹", suffix: " L+", label: "Fees tracked on platform" },
  ],
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
  features: [
    {
      icon: "attendance" as LandingFeatureIcon,
      title: "Batch attendance",
      description: "Tap-to-mark per batch with daily history",
    },
    {
      icon: "fees" as LandingFeatureIcon,
      title: "Fee collection",
      description: "Cash, UPI, partial — receipt in seconds",
    },
    {
      icon: "whatsapp" as LandingFeatureIcon,
      title: "WhatsApp receipts",
      description: "PDF receipt to parent's WhatsApp",
    },
    {
      icon: "leads" as LandingFeatureIcon,
      title: "Lead management",
      description: "Enquiry → trial → conversion pipeline",
    },
    {
      icon: "excel" as LandingFeatureIcon,
      title: "Excel import",
      description: "Bulk student import from spreadsheet",
    },
    {
      icon: "dashboard" as LandingFeatureIcon,
      title: "Owner dashboard",
      description: "Revenue, attendance, pending — one screen",
    },
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
          "Up to 3 staff users",
          "Up to 6 batches · 1 sport",
          "Student & batch management",
          "Daily attendance (tap-to-mark)",
          "Fee collection + PDF receipts",
          "WhatsApp receipt logging",
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
        idealFor: "3+ staff · multiple batches · monthly reporting",
        popular: true,
        features: [
          "Unlimited students, staff & batches",
          "Multi-sport academy setup",
          "Coach logins (assigned batches only)",
          "Attendance, fees & receipts — full workflow",
          "Public page + leads with trial tracking",
          "Owner dashboard + daily digest",
          "Financial, attendance & lead reports",
          "Export reports (PDF & Excel)",
          "Excel import anytime",
          "Scheduled fee & session reminders",
          "Audit logs (who changed what)",
          "Student ID cards (PDF + QR)",
          "Google review booster after payment",
          "Priority support + annual staff refresher",
        ],
      },
    ],
    footnote:
      "All plans include secure cloud hosting and data isolation per academy. Setup fee applies once per location.",
  },
  testimonials: [
    {
      quote:
        "We stopped losing fee follow-ups. Collect on the ground, receipt goes to WhatsApp — parents trust us more.",
      name: "Ramesh K.",
      role: "Owner, Kohinoor Cricket Academy",
      city: "Hyderabad",
      metric: "₹3.2L collected in 3 months",
      initials: "RK",
      image: assets.testimonials.owner1,
      rating: 5,
    },
    {
      quote:
        "Attendance used to be a notebook nightmare. Now my coach marks it before the next batch walks in.",
      name: "Anita S.",
      role: "Director, Velocity Football Club",
      city: "Pune",
      metric: "98% attendance rate",
      initials: "AS",
      image: assets.testimonials.owner2,
      rating: 5,
    },
    {
      quote:
        "The public enquiry page alone brought us 12 leads last month. Parents find us and we call back same day.",
      name: "Vikram P.",
      role: "Head Coach, Smash Badminton",
      city: "Bangalore",
      metric: "12 leads in 30 days",
      initials: "VP",
      image: assets.testimonials.owner3,
      rating: 5,
    },
  ],
  faqs: [
    {
      q: "Do I need a computer to run the academy?",
      a: "No. The core loop — attendance, fees, receipts, WhatsApp — is built for phones and tablets. Use a laptop for reports and bulk imports when you need them.",
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
      q: "Do I get a public page for enquiries?",
      a: "Every academy gets a shareable page at /a/your-slug with an enquiry form — perfect for WhatsApp bio links and Google Maps.",
    },
    {
      q: "Can I import students from Excel?",
      a: "Yes. Your one-time setup includes the first bulk import. Pro plans also include ongoing Excel import anytime — useful when you add a new batch or season.",
    },
    {
      q: "What's the difference between Starter and Pro?",
      a: "Starter fits a smaller academy: caps on students, staff, and batches, plus everything you need for daily attendance and fees. Pro removes those limits, adds coach logins, full reports with export, owner digest, reminders, audit logs, ID cards, and priority support — built for academies with multiple staff and sports.",
    },
    {
      q: "What does the one-time setup include?",
      a: "We configure your academy, import your student list from Excel, train your staff, and help you go live — typically within one week.",
    },
  ],
  navSections: [
    { id: "how-it-works", label: "How it works" },
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
