import { createClient } from "@/lib/supabase/server";
import type { AcademyPlan } from "@/lib/plans";
import { STARTER_LIMITS } from "@/lib/plans";

export async function checkPlanLimit(
  academyId: string,
  plan: AcademyPlan,
  entity: "students" | "users" | "batches" | "sports",
) {
  if (plan === "pro") return { ok: true as const };

  const supabase = await createClient();
  let count = 0;

  if (entity === "students") {
    const { count: c } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("academy_id", academyId)
      .eq("status", "active");
    count = c ?? 0;
    if (count >= STARTER_LIMITS.students) {
      return { ok: false as const, message: `Starter plan limited to ${STARTER_LIMITS.students} students. Upgrade to Pro.` };
    }
  } else if (entity === "users") {
    const { count: c } = await supabase
      .from("academy_users")
      .select("*", { count: "exact", head: true })
      .eq("academy_id", academyId)
      .eq("is_active", true);
    count = c ?? 0;
    if (count >= STARTER_LIMITS.users) {
      return { ok: false as const, message: `Starter plan limited to ${STARTER_LIMITS.users} staff users.` };
    }
  } else if (entity === "batches") {
    const { count: c } = await supabase
      .from("batches")
      .select("*", { count: "exact", head: true })
      .eq("academy_id", academyId)
      .eq("is_active", true);
    count = c ?? 0;
    if (count >= STARTER_LIMITS.batches) {
      return { ok: false as const, message: `Starter plan limited to ${STARTER_LIMITS.batches} batches.` };
    }
  } else if (entity === "sports") {
    const { count: c } = await supabase
      .from("sports")
      .select("*", { count: "exact", head: true })
      .eq("academy_id", academyId)
      .eq("is_active", true);
    count = c ?? 0;
    if (count >= STARTER_LIMITS.sports) {
      return { ok: false as const, message: `Starter plan limited to ${STARTER_LIMITS.sports} sport.` };
    }
  }

  return { ok: true as const };
}
