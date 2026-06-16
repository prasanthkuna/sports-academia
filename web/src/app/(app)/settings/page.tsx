import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { Card } from "@/components/ui/card";

export default async function SettingsPage() {
  const ctx = await getAcademyContext();
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("academy_settings")
    .select("*")
    .eq("academy_id", ctx?.academyId)
    .single();

  const { data: feeTypes } = await supabase.from("fee_types").select("*");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-muted">Academy profile and configuration</p>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-ink">Academy</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Name</dt>
            <dd className="font-medium">{ctx?.academyUser.academies?.name}</dd>
          </div>
          <div>
            <dt className="text-muted">Receipt prefix</dt>
            <dd className="font-mono-amount">{settings?.receipt_prefix}</dd>
          </div>
          <div>
            <dt className="text-muted">Contact</dt>
            <dd>{settings?.contact_number ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">WhatsApp</dt>
            <dd>{settings?.whatsapp_number ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted">Address</dt>
            <dd>{settings?.address ?? "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-ink">Fee types</h2>
        <ul className="space-y-1 text-sm">
          {(feeTypes ?? []).map((ft) => (
            <li key={ft.id}>{ft.name}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-ink">Public links</h2>
        <p className="text-sm text-muted">
          Enquiry form:{" "}
          <code className="rounded bg-canvas px-1">
            /a/{ctx?.academyUser.academies?.slug}/enquire
          </code>
        </p>
      </Card>
    </div>
  );
}
