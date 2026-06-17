import type { AcademyPlan } from "@/lib/plans";

export type SubscriptionStatus = "trial" | "active" | "expired";

export const TRIAL_DAYS = 7;

export function isSubscriptionExpired(
  status: SubscriptionStatus,
  trialEndsAt: string | null,
): boolean {
  if (status === "expired") return true;
  if (status === "trial" && trialEndsAt) {
    return new Date(trialEndsAt) <= new Date();
  }
  return false;
}

export function isTrialActive(
  status: SubscriptionStatus,
  trialEndsAt: string | null,
): boolean {
  if (status !== "trial" || !trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
}

export function trialDaysRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const ms = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/** Pro features: active trial, or paid Pro subscription. */
export function hasProAccess(
  plan: AcademyPlan,
  status: SubscriptionStatus,
  trialEndsAt: string | null,
): boolean {
  if (isSubscriptionExpired(status, trialEndsAt)) return false;
  if (isTrialActive(status, trialEndsAt)) return true;
  return status === "active" && plan === "pro";
}

export function effectivePlan(
  plan: AcademyPlan,
  status: SubscriptionStatus,
  trialEndsAt: string | null,
): AcademyPlan {
  return hasProAccess(plan, status, trialEndsAt) ? "pro" : "starter";
}

export function subscriptionLabel(
  status: SubscriptionStatus,
  trialEndsAt: string | null,
): string {
  if (isTrialActive(status, trialEndsAt)) {
    const days = trialDaysRemaining(trialEndsAt);
    return days === 1 ? "Pro trial · 1 day left" : `Pro trial · ${days} days left`;
  }
  if (isSubscriptionExpired(status, trialEndsAt)) return "Trial expired";
  return "";
}
