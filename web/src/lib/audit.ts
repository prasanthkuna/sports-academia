import { createClient } from "@/lib/supabase/server";

export async function writeAuditLog(params: {
  academyId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
}) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    academy_id: params.academyId,
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    old_value: params.oldValue ?? null,
    new_value: params.newValue ?? null,
  });
}
