import type { FeePlanType } from "@/types";

export const FEE_PLAN_TYPE_LABELS: Record<FeePlanType, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  admission: "Admission (one-time)",
  session_package: "Session package",
  personal_coaching: "Personal coaching",
  summer_camp: "Summer camp",
};

export function isRecurringPlan(type: FeePlanType) {
  return type === "monthly" || type === "quarterly";
}

export function isSessionPlan(type: FeePlanType) {
  return type === "session_package" || type === "personal_coaching";
}

export function isFixedTermPlan(type: FeePlanType) {
  return type === "summer_camp" || type === "admission";
}

export function defaultBillingCycleMonths(type: FeePlanType): number | null {
  if (type === "monthly") return 1;
  if (type === "quarterly") return 3;
  return null;
}

export function computeEndDate(
  startDate: string,
  planType: FeePlanType,
  validityDays: number | null,
  _totalSessions: number | null,
): string | null {
  if (planType === "summer_camp" && validityDays) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + validityDays);
    return d.toISOString().slice(0, 10);
  }
  if (planType === "admission") return null;
  if (isSessionPlan(planType) && validityDays) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + validityDays);
    return d.toISOString().slice(0, 10);
  }
  return null;
}
