import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ConvertLeadButton } from "@/components/leads/convert-lead-button";

export default async function LeadsPage() {
  const supabase = await createClient();
  const [{ data: leads }, { data: batches }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("batches").select("id, name").eq("is_active", true),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Leads</h1>
        <p className="text-sm text-muted">Enquiries and trial follow-ups</p>
      </div>
      <div className="space-y-2">
        {(leads ?? []).map((lead) => (
          <div
            key={lead.id}
            className="rounded-lg border border-hairline-soft bg-canvas p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">{lead.name}</p>
                <p className="text-sm text-muted">
                  {lead.parent_name} · {lead.mobile} · {lead.sport_interested ?? "—"}
                </p>
                <Badge status={lead.status} className="mt-2" />
              </div>
              {lead.status !== "converted" && lead.status !== "lost" && (
                <ConvertLeadButton leadId={lead.id} batches={batches ?? []} />
              )}
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
