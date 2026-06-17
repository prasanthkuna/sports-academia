import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccess } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { IdCardsGenerator } from "@/components/id-cards/id-cards-generator";

export default async function IdCardsPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canAccess(ctx.role, "id_cards")) redirect("/dashboard");
  if (!ctx.proAccess) {
    return (
      <div className="p-6 text-muted">ID cards with QR check-in require Pro plan.</div>
    );
  }

  const supabase = await createClient();
  const { data: batches } = await supabase
    .from("batches")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">ID cards</h1>
        <p className="text-sm text-muted">Bulk PDF with QR for scan attendance</p>
      </div>
      <IdCardsGenerator batches={batches ?? []} />
    </div>
  );
}
