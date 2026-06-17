import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageTeam } from "@/lib/permissions";
import { ImportWizard } from "@/components/import/import-wizard";

export default async function ImportPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canManageTeam(ctx.role)) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Excel import</h1>
        <p className="text-sm text-muted">
          {ctx.proAccess
            ? "Upload any spreadsheet — we detect students, batches, and more"
            : "Pro plan required for self-serve import. Setup includes your first import."}
        </p>
      </div>
      <ImportWizard plan={ctx.effectivePlan} proAccess={ctx.proAccess} />
    </div>
  );
}
