export type AcademyPlan = "starter" | "pro";

export const STARTER_LIMITS = {
  students: 150,
  users: 3,
  batches: 6,
  sports: 1,
} as const;

export function isPro(plan: AcademyPlan) {
  return plan === "pro";
}

export function canUseQrCheckIn(plan: AcademyPlan) {
  return isPro(plan);
}

export function canSelfServeImport(plan: AcademyPlan) {
  return isPro(plan);
}

export function canExportReports(plan: AcademyPlan) {
  return isPro(plan);
}

export function planLabel(plan: AcademyPlan) {
  return plan === "pro" ? "Pro" : "Starter";
}
