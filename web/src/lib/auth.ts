import { createClient } from "@/lib/supabase/server";
import {
  effectivePlan,
  hasProAccess,
  isSubscriptionExpired,
  type SubscriptionStatus,
} from "@/lib/subscription";
import type { AcademyPlan } from "@/lib/plans";
import type { AcademySettings, AcademyUser, UserRole } from "@/types";

export type AcademyContext = {
  user: { id: string; email?: string };
  academyUser: AcademyUser & {
    academies: {
      id: string;
      name: string;
      slug: string;
      plan: AcademyPlan;
      subscription_status: SubscriptionStatus;
      trial_ends_at: string | null;
      onboarding_completed_at: string | null;
    };
    academy_settings: AcademySettings | null;
  };
  academyId: string;
  academySlug: string;
  plan: AcademyPlan;
  effectivePlan: AcademyPlan;
  proAccess: boolean;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string | null;
  onboardingCompleted: boolean;
  subscriptionExpired: boolean;
  role: UserRole;
  coachId: string | null;
  settings: AcademySettings | null;
};

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAcademyContext(): Promise<AcademyContext | null> {
  const supabase = await createClient();
  const user = await getSessionUser();
  if (!user) return null;

  await supabase.rpc("expire_overdue_trials");

  const { data: academyUser } = await supabase
    .from("academy_users")
    .select(
      "*, academies(id, name, slug, plan, subscription_status, trial_ends_at, onboarding_completed_at)",
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!academyUser) return null;

  const academy = academyUser.academies as {
    id: string;
    name: string;
    slug: string;
    plan: AcademyPlan;
    subscription_status: SubscriptionStatus;
    trial_ends_at: string | null;
    onboarding_completed_at: string | null;
  };

  const { data: academySettings } = await supabase
    .from("academy_settings")
    .select("*")
    .eq("academy_id", academyUser.academy_id)
    .single();

  const settings = (academySettings ?? null) as AcademySettings | null;
  const subscriptionStatus = academy.subscription_status ?? "active";
  const trialEndsAt = academy.trial_ends_at ?? null;
  const proAccess = hasProAccess(academy.plan ?? "starter", subscriptionStatus, trialEndsAt);
  const effPlan = effectivePlan(academy.plan ?? "starter", subscriptionStatus, trialEndsAt);

  return {
    user: { id: user.id, email: user.email },
    academyUser: {
      ...academyUser,
      academies: academy,
      academy_settings: settings,
    } as AcademyContext["academyUser"],
    academyId: academyUser.academy_id as string,
    academySlug: academy.slug,
    plan: academy.plan ?? "starter",
    effectivePlan: effPlan,
    proAccess,
    subscriptionStatus,
    trialEndsAt,
    onboardingCompleted: !!academy.onboarding_completed_at,
    subscriptionExpired: isSubscriptionExpired(subscriptionStatus, trialEndsAt),
    role: academyUser.role as UserRole,
    coachId: (academyUser.coach_id as string | null) ?? null,
    settings,
  };
}

export async function requireAcademyContext() {
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");
  if (ctx.subscriptionExpired) throw new Error("Subscription expired");
  return ctx;
}
