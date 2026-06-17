import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ConvertLeadButton } from "@/components/leads/convert-lead-button";
import { LeadActions } from "@/components/leads/lead-actions";
import { redirect } from "next/navigation";
import { canAccess } from "@/lib/permissions";

export default async function LeadsPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canAccess(ctx.role, "leads")) redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: leads }, { data: batches }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("batches").select("id, name").eq("is_active", true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Leads</h1>
        <p className="text-sm text-muted">Enquiries · trial tracking · conversion</p>
      </div>
      <div className="space-y-2">
        {(leads ?? []).map((lead) => (
          <div
            key={lead.id}
            className="rounded-lg border border-hairline-soft bg-canvas p-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{lead.name}</p>
                  <p className="text-sm text-muted">
                    {lead.parent_name} · {lead.mobile} · {lead.sport_interested ?? "—"}
                  </p>
                  {lead.trial_date && (
                    <p className="text-xs text-muted">Trial: {lead.trial_date}</p>
                  )}
                  <Badge status={lead.status} className="mt-2" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {lead.status !== "converted" && lead.status !== "lost" && (
                    <>
                      <LeadActions leadId={lead.id} status={lead.status} plan={ctx.effectivePlan} slug={ctx.academySlug} />
                      <ConvertLeadButton leadId={lead.id} batches={batches ?? []} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {(leads ?? []).length === 0 && (
          <p className="text-center text-sm text-muted">No leads yet.</p>
        )}
      </div>
    </div>
  );
}
