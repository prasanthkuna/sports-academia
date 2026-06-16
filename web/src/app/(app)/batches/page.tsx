import { createClient } from "@/lib/supabase/server";
import { rel } from "@/lib/utils";

export default async function BatchesPage() {
  const supabase = await createClient();
  const { data: batches } = await supabase
    .from("batches")
    .select("*, sports(name), coaches(name)")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Batches</h1>
        <p className="text-sm text-muted">{batches?.length ?? 0} batches</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {(batches ?? []).map((batch) => (
          <a
            key={batch.id}
            href={`/batches/${batch.id}`}
            className="rounded-lg bg-surface-card p-4 hover:opacity-95"
          >
            <p className="font-semibold text-ink">{batch.name}</p>
            <p className="text-sm text-muted">
              {rel<{ name: string }>(batch.sports)?.name} ·{" "}
              {rel<{ name: string }>(batch.coaches)?.name ?? "No coach"}
            </p>
            <p className="mt-2 text-xs text-muted">
              Capacity {batch.capacity ?? "—"} · {batch.start_time?.slice(0, 5)}–
              {batch.end_time?.slice(0, 5)}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
