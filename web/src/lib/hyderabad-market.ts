/**
 * Hyderabad sports-academy market reference (early 2026).
 * Used for landing page copy and demo DB seed — not live customer data.
 *
 * Sources (public listings & guides):
 * - Cricket monthly ₹1,800–₹5,500 typical; ₹3,000 common (CricJosh, SportsCafe, local academies)
 * - Cricket quarterly ≈ 3× monthly with ~5–15% discount → ₹8,000–₹9,000
 * - Personal coaching ₹5,000/month (Galaxy Cricket Academy, Hyderabad)
 * - Badminton beginner ₹1,500–₹3,000/month (Playgloba Hyderabad)
 * - Swimming with coaching ₹2,500–₹3,600/month (Gopichand pool / Playgloba)
 * - Summer camp 4-week cricket ₹3,500–₹5,000 (Gamepoint Academy Hyderabad)
 * - Admission / registration ₹2,000–₹5,100 (varies by academy)
 */

/** Illustrative mid-size academy in Hyderabad (Kukatpally / LB Nagar / Uppal tier). */
export const hyderabadDemoAcademy = {
  activeStudents: 94,
  batches: 6,
  sports: ["Cricket", "Badminton", "Football"] as const,
} as const;

/** Typical parent-facing fee amounts (INR). */
export const hyderabadFees = {
  cricketMonthly: 3000,
  cricketQuarterly: 8500,
  admission: 2500,
  personalCoachingMonthly: 5000,
  badmintonBeginnerMonthly: 2500,
  swimmingMonthlyWithCoach: 3000,
  /** 8 beginner badminton sessions ≈ ₹400/session */
  badminton8SessionPackage: 3200,
  /** Gamepoint-style 4-week summer cricket camp */
  summerCamp4WeekCricket: 5000,
  /** Partial balance example */
  partialBalance: 1500,
} as const;

/** One busy morning (e.g. 5th of month — due day) at a ~94-student academy. */
export const hyderabadDemoDay = {
  presentTotal: 72,
  qrCheckIns: 54,
  manualCheckIns: 18,
  absentToday: 9,
  trialsToday: 2,
  leadsAwaitingFollowUp: 3,
  remindersInQueue: 4,
  /** 3 full renewals + 1 partial catch-up */
  collectedToday: 10_500,
  paymentsToday: { upi: 2, cash: 2 },
  overdueStudents: 4,
  overdueTotal: 10_500,
  overdueExamples: [
    { name: "Rohan S.", amount: 3000 },
    { name: "Priya M.", amount: 3000 },
    { name: "Vikram T.", amount: 3000 },
    { name: "Sneha V.", amount: 1500 },
  ] as const,
  dueThisWeek: 9,
  pendingRenewals: 11,
  sessionsRemaining: 2,
  sessionsRemainingStudent: "Kavya Iyer",
  sessionsRemainingSport: "Swimming",
  expiredButAttendedToday: 1,
} as const;

export const hyderabadFeePlanExamples = [
  {
    name: "U12 Cricket Monthly",
    amount: hyderabadFees.cricketMonthly,
    type: "Monthly",
    note: "Typical HITEC City / Uppal range",
  },
  {
    name: "8-Session Badminton",
    amount: hyderabadFees.badminton8SessionPackage,
    type: "Package",
    note: "Beginner batch · Gachibowli tier",
  },
  {
    name: "4-Week Summer Cricket Camp",
    amount: hyderabadFees.summerCamp4WeekCricket,
    type: "Camp",
    note: "May–Jun camp · 5 days/week",
  },
  {
    name: "Personal Coaching",
    amount: hyderabadFees.personalCoachingMonthly,
    type: "1:1 Monthly",
    note: "Common Hyderabad 1:1 rate",
  },
] as const;

export function formatHyderabadInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
