import { landingConfig } from "@/lib/landing-config";
import type { AcademyPlan } from "@/lib/plans";

export type BillingPlanId = AcademyPlan;

export function monthlyPriceInr(plan: BillingPlanId): number {
  const match = landingConfig.pricing.plans.find((p) => p.id === plan);
  if (!match) throw new Error("Unknown plan");
  return match.price;
}

/** One-time setup + first month included, per plan. */
export function activationTotalInr(plan: BillingPlanId): number {
  const match = landingConfig.pricing.plans.find((p) => p.id === plan);
  if (!match) throw new Error("Unknown plan");
  return match.activationAmount;
}

export function activationTotalPaise(plan: BillingPlanId): number {
  return activationTotalInr(plan) * 100;
}

export function activationLabel(plan: BillingPlanId): string {
  const name = plan === "pro" ? "Pro" : "Starter";
  return `Academy Ops — Setup (${name}, month 1 included)`;
}

/** @deprecated Use activationTotalInr(plan) */
export function setupFeeInr(plan: BillingPlanId = "pro"): number {
  return activationTotalInr(plan);
}
