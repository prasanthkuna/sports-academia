import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rel } from "@/lib/utils";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: batch } = await supabase
    .from("batches")
    .select("*, sports(name), coaches(name)")
    .eq("id", id)
    .single();

  if (!batch) notFound();

  const { data: roster } = await supabase
    .from("batch_students")
    .select("students(id, name, student_code, status)")
    .eq("batch_id", id)
    .eq("is_active", true);

  return (
    <div className="space-y-6">
      <Link href="/batches" className="text-sm text-muted">
        ← Batches
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-ink">{batch.name}</h1>
        <p className="text-sm text-muted">
          {rel<{ name: string }>(batch.sports)?.name} · Coach{" "}
          {rel<{ name: string }>(batch.coaches)?.name ?? "—"}
        </p>
      </div>
      <div className="rounded-lg border border-hairline-soft">
        <div className="border-b border-hairline-soft px-4 py-2 text-sm font-semibold">
          Students ({roster?.length ?? 0})
        </div>
        {(roster ?? []).map((r) => {
          const s = rel<{ id: string; name: string; student_code: string }>(r.students);
          if (!s) return null;
          return (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className="block border-b border-hairline-soft px-4 py-3 text-sm last:border-0 hover:bg-surface-soft"
            >
              {s.name} <span className="text-muted">· {s.student_code}</span>
            </Link>
          );
        })}
      </div>
      <Link
        href={`/attendance`}
        className="inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
      >
        Mark attendance
      </Link>
    </div>
  );
}
