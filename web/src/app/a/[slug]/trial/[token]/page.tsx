import { TrialCheckInClient } from "@/components/qr/trial-check-in-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function TrialCheckInPage({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}) {
  const { slug, token } = await params;
  const supabase = await createClient();

  const { data: academy } = await supabase
    .from("academies")
    .select("id, name")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!academy) notFound();

  const { data: lead } = await supabase
    .from("leads")
    .select("id, name")
    .eq("academy_id", academy.id)
    .eq("check_in_token", token)
    .maybeSingle();

  if (!lead) notFound();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline-soft px-4 py-4 text-center">
        <p className="text-sm font-semibold text-ink">{academy.name}</p>
        <p className="text-xs text-muted">Trial check-in for {lead.name}</p>
      </header>
      <TrialCheckInClient slug={slug} token={token} />
    </div>
  );
}
