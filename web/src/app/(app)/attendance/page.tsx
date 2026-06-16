import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { resolveCoachScope } from "@/lib/coach-scope";
import { AttendanceMark } from "@/components/attendance/attendance-mark";
import { redirect } from "next/navigation";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const ctx = await getAcademyContext();
  if (!ctx) redirect("/login");

  const sp = await searchParams;
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const coachBatchIds = await resolveCoachScope(ctx.academyId, ctx.role, ctx.coachId);

  let batchQuery = supabase.from("batches").select("id, name").eq("is_active", true).order("name");
  if (coachBatchIds) {
    if (coachBatchIds.length === 0) {
      return (
        <div className="text-muted">No batches assigned to you yet. Contact admin.</div>
      );
    }
    batchQuery = batchQuery.in("id", coachBatchIds);
  }

  const [{ data: batches }, { data: students }, { data: existing }] = await Promise.all([
    batchQuery,
    supabase
      .from("batch_students")
      .select("batch_id, student_id, students(id, name, student_code)")
      .eq("is_active", true),
    supabase.from("attendance").select("*").eq("attendance_date", today),
  ]);

  const filteredRoster =
    coachBatchIds && students
      ? students.filter((s) => coachBatchIds.includes(s.batch_id))
      : students;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Mark attendance</h1>
        <p className="text-sm text-muted">
          Batch-wise · today first
          {ctx.role === "coach" ? " · assigned batches only" : ""}
        </p>
      </div>
      <AttendanceMark
        batches={batches ?? []}
        roster={filteredRoster ?? []}
        existing={existing ?? []}
        defaultDate={today}
        defaultBatchId={sp.batch}
      />
    </div>
  );
}
