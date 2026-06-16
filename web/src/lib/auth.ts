import { createClient } from "@/lib/supabase/server";
import type { AcademyPlan } from "@/lib/plans";
import type { AcademySettings, AcademyUser, UserRole } from "@/types";

export type AcademyContext = {
  user: { id: string; email?: string };
  academyUser: AcademyUser & {
    academies: { id: string; name: string; slug: string; plan: AcademyPlan };
    academy_settings: AcademySettings | null;
  };
  academyId: string;
  academySlug: string;
  plan: AcademyPlan;
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

  const { data: academyUser } = await supabase
    .from("academy_users")
    .select("*, academies(id, name, slug, plan)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!academyUser) return null;

  const academy = academyUser.academies as {
    id: string;
    name: string;
    slug: string;
    plan: AcademyPlan;
  };

  const { data: academySettings } = await supabase
    .from("academy_settings")
    .select("*")
    .eq("academy_id", academyUser.academy_id)
    .single();

  const settings = (academySettings ?? null) as AcademySettings | null;

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
    role: academyUser.role as UserRole,
    coachId: (academyUser.coach_id as string | null) ?? null,
    settings,
  };
}

export async function requireAcademyContext() {
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");
  return ctx;
}
