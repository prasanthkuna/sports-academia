import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageTeam } from "@/lib/permissions";
import { SettingsForm } from "@/components/settings/settings-form";
import { SportsManager } from "@/components/settings/sports-manager";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { planLabel } from "@/lib/plans";
import { subscriptionLabel } from "@/lib/subscription";

export default async function SettingsPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canManageTeam(ctx.role)) redirect("/dashboard");

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("academy_settings")
    .select("*")
    .eq("academy_id", ctx.academyId)
    .single();

  const { data: sports } = await supabase.from("sports").select("*").eq("is_active", true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-muted">
          Academy profile ·{" "}
          {subscriptionLabel(ctx.subscriptionStatus, ctx.trialEndsAt) ||
            `${planLabel(ctx.effectivePlan)} plan`}
        </p>
      </div>

      <SettingsForm settings={settings} academyName={ctx.academyUser.academies.name} slug={ctx.academySlug} />

      <Card className="p-6">
        <SportsManager sports={sports ?? []} plan={ctx.effectivePlan} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 font-semibold text-ink">Public links</h2>
        <p className="text-sm text-muted">
          Enquiry: <code className="rounded bg-canvas px-1">/a/{ctx.academySlug}/enquire</code>
        </p>
      </Card>
    </div>
  );
}
