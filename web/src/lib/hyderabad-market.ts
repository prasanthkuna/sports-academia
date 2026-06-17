/**
 * Academy market reference for demo seed and landing mocks (early 2026).
 * Internal research notes only — no city names in user-facing UI.
 */

/** Illustrative mid-size academy profile for marketing copy. */
export const hyderabadDemoAcademy = {
  activeStudents: 12,
  batches: 5,
  sports: ["Cricket", "Badminton", "Football", "Swimming"] as const,
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

/** Day-level stats aligned with the live demo seed (12 students). */
export const hyderabadDemoDay = {
  presentTotal: 10,
  qrCheckIns: 4,
  manualCheckIns: 3,
  absentToday: 2,
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

/** Morning vs end-of-day views for the landing day-timeline section. */
export const demoDayTimeline = {
  morning: {
    overdueStudents: hyderabadDemoDay.overdueStudents,
    overdueTotal: hyderabadDemoDay.overdueTotal,
    dueThisWeek: hyderabadDemoDay.dueThisWeek,
    pendingRenewals: hyderabadDemoDay.pendingRenewals,
  },
  endOfDay: {
    presentToday: hyderabadDemoDay.presentTotal,
    studentCount: hyderabadDemoAcademy.activeStudents,
    qrCheckIns: hyderabadDemoDay.qrCheckIns,
    manualCheckIns: hyderabadDemoDay.manualCheckIns,
    collectedToday: hyderabadDemoDay.collectedToday,
    overdueTotal: hyderabadDemoDay.overdueTotal,
    overdueStudents: hyderabadDemoDay.overdueStudents,
  },
} as const;

export const hyderabadFeePlanExamples = [
  {
    name: "U12 Cricket Monthly",
    amount: hyderabadFees.cricketMonthly,
    type: "Monthly",
  },
  {
    name: "8-Session Badminton",
    amount: hyderabadFees.badminton8SessionPackage,
    type: "Package",
  },
  {
    name: "4-Week Summer Cricket Camp",
    amount: hyderabadFees.summerCamp4WeekCricket,
    type: "Camp",
  },
  {
    name: "Personal Coaching",
    amount: hyderabadFees.personalCoachingMonthly,
    type: "1:1 Monthly",
  },
] as const;

export function formatHyderabadInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
