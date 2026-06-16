import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

export async function getCoachBatchIds(academyId: string, coachId: string | null) {
  if (!coachId) return [] as string[];
  const supabase = await createClient();
  const { data } = await supabase
    .from("batches")
    .select("id")
    .eq("academy_id", academyId)
    .eq("coach_id", coachId)
    .eq("is_active", true);
  return (data ?? []).map((b) => b.id);
}

export function filterByCoachBatches<T extends { batch_id?: string; id?: string }>(
  items: T[],
  batchIds: string[],
  batchKey: "batch_id" | "id" = "batch_id",
) {
  if (batchIds.length === 0) return items;
  return items.filter((item) => {
    const id = batchKey === "batch_id" ? item.batch_id : item.id;
    return id && batchIds.includes(id);
  });
}

export async function resolveCoachScope(
  academyId: string,
  role: UserRole,
  coachId: string | null,
) {
  if (role !== "coach") return null;
  return getCoachBatchIds(academyId, coachId);
}
