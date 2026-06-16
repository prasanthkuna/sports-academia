import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { AddStudentForm } from "@/components/students/add-student-form";
import { rel } from "@/lib/utils";

export default async function StudentsPage() {
  const supabase = await createClient();

  const [{ data: students }, { data: sports }, { data: batches }] = await Promise.all([
    supabase
      .from("students")
      .select("*, sports(name), batch_students(batch_id, batches(name))")
      .order("created_at", { ascending: false }),
    supabase.from("sports").select("id, name").eq("is_active", true),
    supabase.from("batches").select("id, name").eq("is_active", true),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Students</h1>
          <p className="text-sm text-muted">{students?.length ?? 0} registered</p>
        </div>
        <AddStudentForm sports={sports ?? []} batches={batches ?? []} />
      </div>

      <div className="divide-y divide-hairline-soft rounded-lg border border-hairline-soft bg-canvas">
        {(students ?? []).map((student) => {
          const bs = rel<{ batches: { name: string } | null }>(
            student.batch_students as { batches: { name: string } | null } | { batches: { name: string } | null }[] | null,
          );
          const batch = rel<{ name: string }>(bs?.batches)?.name;
          return (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                {student.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{student.name}</p>
                <p className="truncate text-xs text-muted">
                  {student.student_code} · {rel<{ name: string }>(student.sports)?.name ?? "—"}
                  {batch ? ` · ${batch}` : ""}
                </p>
              </div>
              <Badge status={student.status} />
            </Link>
          );
        })}
        {(students ?? []).length === 0 && (
          <p className="p-6 text-center text-sm text-muted">No students yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
