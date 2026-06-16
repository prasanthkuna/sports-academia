import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccess } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function AuditPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canAccess(ctx.role, "audit")) redirect("/dashboard");

  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Audit logs</h1>
        <p className="text-sm text-muted">Who changed what — sensitive actions</p>
      </div>
      <div className="space-y-2">
        {(logs ?? []).length === 0 ? (
          <Card className="p-6 text-center text-muted">No audit entries yet.</Card>
        ) : (
          logs?.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">
                    {log.action} · {log.entity_type}
                  </p>
                  <p className="text-xs text-muted">{formatDate(log.created_at)}</p>
                </div>
                <code className="text-xs text-muted">{log.entity_id?.slice(0, 8)}</code>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
