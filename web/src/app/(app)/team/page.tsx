import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageTeam } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { TeamManager } from "@/components/team/team-manager";

export default async function TeamPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canManageTeam(ctx.role)) redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: coaches }, { data: users }] = await Promise.all([
    supabase.from("coaches").select("*").eq("is_active", true).order("name"),
    supabase.from("academy_users").select("*, coaches(name)").eq("is_active", true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Team</h1>
        <p className="text-sm text-muted">Coaches, staff logins · Pro enables coach accounts</p>
      </div>
      <TeamManager coaches={coaches ?? []} users={users ?? []} plan={ctx.plan} />
    </div>
  );
}
