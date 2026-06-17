import { landingConfig } from "@/lib/landing-config";
import type { AcademyPlan } from "@/lib/plans";

export type BillingPlanId = AcademyPlan;

export function monthlyPriceInr(plan: BillingPlanId): number {
  const match = landingConfig.pricing.plans.find((p) => p.id === plan);
  if (!match) throw new Error("Unknown plan");
  return match.price;
}

export function setupFeeInr(): number {
  return landingConfig.pricing.setup.amount;
}

/** First checkout: one-time setup + first month. */
export function activationTotalInr(plan: BillingPlanId): number {
  return setupFeeInr() + monthlyPriceInr(plan);
}

export function activationTotalPaise(plan: BillingPlanId): number {
  return activationTotalInr(plan) * 100;
}

export function activationLabel(plan: BillingPlanId): string {
  const name = plan === "pro" ? "Pro" : "Starter";
  return `Academy Ops — Setup + first month (${name})`;
}
