import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CheckInClient } from "@/components/qr/check-in-client";

export default async function StudentCheckInPage({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}) {
  const { slug, token } = await params;
  const supabase = await createClient();

  const { data: academy } = await supabase
    .from("academies")
    .select("id, name, plan")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!academy || academy.plan !== "pro") notFound();

  const { data: student } = await supabase
    .from("students")
    .select("id, name, qr_token")
    .eq("academy_id", academy.id)
    .eq("qr_token", token)
    .eq("status", "active")
    .single();

  if (!student) notFound();

  const { data: settings } = await supabase
    .from("academy_settings")
    .select("checkin_pin_required")
    .eq("academy_id", academy.id)
    .single();

  const today = new Date().getDay() || 7;
  const isoDow = today === 0 ? 7 : today;

  const { data: batchLinks } = await supabase
    .from("batch_students")
    .select("batch_id, batches(id, name, start_time, end_time, days_of_week, is_active)")
    .eq("student_id", student.id)
    .eq("is_active", true);

  const batches = (batchLinks ?? [])
    .map((l) => {
      const b = l.batches;
      const batch = Array.isArray(b) ? b[0] : b;
      return batch as {
        id: string;
        name: string;
        start_time: string | null;
        end_time: string | null;
        days_of_week: number[] | null;
        is_active: boolean;
      } | null;
    })
    .filter((b): b is NonNullable<typeof b> => !!b?.is_active)
    .filter((b) => !b.days_of_week?.length || b.days_of_week.includes(isoDow));

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-hairline-soft bg-canvas px-4 py-4 text-center">
        <p className="text-sm font-semibold text-ink">{academy.name}</p>
      </header>
      <CheckInClient
        slug={slug}
        token={token}
        studentName={student.name}
        batches={batches}
        pinRequired={settings?.checkin_pin_required ?? true}
      />
    </div>
  );
}
