import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccess } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";
import { RemindersList } from "@/components/reminders/reminders-list";
import { buildFeeReminders } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default async function RemindersPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canAccess(ctx.role, "reminders")) redirect("/dashboard");

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: queue } = await supabase
    .from("reminder_queue")
    .select("*")
    .eq("due_date", today)
    .is("sent_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Reminders</h1>
          <p className="text-sm text-muted">Click-to-send WhatsApp queue</p>
        </div>
        <form action={buildFeeReminders}>
          <Button type="submit">Build fee reminders</Button>
        </form>
      </div>
      <RemindersList items={queue ?? []} />
    </div>
  );
}
