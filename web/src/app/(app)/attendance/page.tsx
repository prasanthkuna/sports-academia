import { createClient } from "@/lib/supabase/server";
import { AttendanceMark } from "@/components/attendance/attendance-mark";

export default async function AttendancePage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: batches }, { data: students }, { data: existing }] = await Promise.all([
    supabase.from("batches").select("id, name").eq("is_active", true).order("name"),
    supabase
      .from("batch_students")
      .select("batch_id, student_id, students(id, name, student_code)")
      .eq("is_active", true),
    supabase.from("attendance").select("*").eq("attendance_date", today),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Mark attendance</h1>
        <p className="text-sm text-muted">Batch-wise · today first</p>
      </div>
      <AttendanceMark
        batches={batches ?? []}
        roster={students ?? []}
        existing={existing ?? []}
        defaultDate={today}
      />
    </div>
  );
}
