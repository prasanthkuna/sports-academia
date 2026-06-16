import { KioskCheckInClient } from "@/components/qr/trial-check-in-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function BatchKioskPage({
  params,
}: {
  params: Promise<{ slug: string; batchId: string }>;
}) {
  const { slug, batchId } = await params;
  const supabase = await createClient();

  const { data: academy } = await supabase
    .from("academies")
    .select("id, plan")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!academy || academy.plan !== "pro") notFound();

  const { data: batch } = await supabase
    .from("batches")
    .select("id, name")
    .eq("id", batchId)
    .eq("academy_id", academy.id)
    .single();

  if (!batch) notFound();

  return (
    <div className="min-h-screen bg-canvas">
      <KioskCheckInClient slug={slug} batchId={batchId} batchName={batch.name} />
    </div>
  );
}
