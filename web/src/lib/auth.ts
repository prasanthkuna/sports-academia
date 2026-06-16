import { createClient } from "@/lib/supabase/server";
import type { AcademyUser } from "@/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAcademyContext() {
  const supabase = await createClient();
  const user = await getSessionUser();
  if (!user) return null;

  const { data: academyUser } = await supabase
    .from("academy_users")
    .select("*, academies(id, name, slug)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!academyUser) return null;

  const { data: academySettings } = await supabase
    .from("academy_settings")
    .select("*")
    .eq("academy_id", academyUser.academy_id)
    .single();

  return {
    user,
    academyUser: {
      ...academyUser,
      academy_settings: academySettings,
    } as AcademyUser & {
      academies: { id: string; name: string; slug: string };
      academy_settings: Record<string, unknown> | null;
    },
    academyId: academyUser.academy_id as string,
    role: academyUser.role as AcademyUser["role"],
  };
}
