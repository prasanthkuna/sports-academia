import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const admin = createClient(url, key);
  const today = new Date().toISOString().slice(0, 10);

  await admin.rpc("mark_overdue_fees");
  await admin.rpc("sync_assignment_status");
  await admin.rpc("generate_recurring_demands");

  const { data: academies } = await admin.from("academies").select("id, name, slug").eq("is_active", true);

  for (const academy of academies ?? []) {
    const { data: payments } = await admin
      .from("payments")
      .select("amount")
      .eq("academy_id", academy.id)
      .eq("payment_date", today)
      .eq("status", "active");

    const { data: attendance } = await admin
      .from("attendance")
      .select("source, status")
      .eq("academy_id", academy.id)
      .eq("attendance_date", today);

    const { data: overdue } = await admin
      .from("student_fees")
      .select("pending_amount")
      .eq("academy_id", academy.id)
      .in("status", ["overdue"]);

    const collected = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
    const present = attendance?.filter((a) => a.status === "present").length ?? 0;
    const qrCheckIns =
      attendance?.filter((a) => a.source === "qr_scan" && a.status === "present").length ?? 0;

    const body = `${academy.name} — ${today}
Collected: ₹${collected.toLocaleString("en-IN")} | Present: ${present}
QR check-ins: ${qrCheckIns} | Manual: ${present - qrCheckIns}
Overdue: ₹${(overdue?.reduce((s, f) => s + Number(f.pending_amount), 0) ?? 0).toLocaleString("en-IN")} (${overdue?.length ?? 0} students)`;

    await admin.from("owner_digest_snapshots").upsert(
      {
        academy_id: academy.id,
        digest_date: today,
        payload: { collected, present, qrCheckIns },
        whatsapp_body: body,
      },
      { onConflict: "academy_id,digest_date" },
    );
  }

  await admin.from("job_logs").insert({
    job_name: "send-owner-digest",
    success_count: academies?.length ?? 0,
    fail_count: 0,
  });

  return NextResponse.json({ ok: true, academies: academies?.length ?? 0 });
}
