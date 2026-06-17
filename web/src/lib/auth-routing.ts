import {
  isSubscriptionExpired,
  type SubscriptionStatus,
} from "@/lib/subscription";

export type AuthRoutingState = {
  hasAcademy: boolean;
  onboardingComplete: boolean;
  subscriptionExpired: boolean;
};

export function resolvePostAuthPath(state: AuthRoutingState): string {
  if (!state.hasAcademy) return "/onboarding";
  if (state.subscriptionExpired) return "/upgrade";
  if (!state.onboardingComplete) return "/onboarding";
  return "/dashboard";
}

export function buildAuthRoutingState(row: {
  academies: {
    subscription_status: SubscriptionStatus;
    trial_ends_at: string | null;
    onboarding_completed_at: string | null;
  } | null;
} | null): AuthRoutingState {
  if (!row?.academies) {
    return { hasAcademy: false, onboardingComplete: false, subscriptionExpired: false };
  }
  const academy = row.academies;
  return {
    hasAcademy: true,
    onboardingComplete: !!academy.onboarding_completed_at,
    subscriptionExpired: isSubscriptionExpired(
      academy.subscription_status,
      academy.trial_ends_at,
    ),
  };
}
