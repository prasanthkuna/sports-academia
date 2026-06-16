import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, batchId, studentCode, pin, latitude, longitude } = body as {
    slug: string;
    batchId: string;
    studentCode: string;
    pin?: string;
    latitude?: number;
    longitude?: number;
  };

  if (!latitude || !longitude) {
    return NextResponse.json({ ok: false, error: "Location required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: academy } = await supabase
    .from("academies")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!academy) return NextResponse.json({ ok: false, error: "Academy not found" });

  const { data: student } = await supabase
    .from("students")
    .select("qr_token, name")
    .eq("academy_id", academy.id)
    .eq("student_code", studentCode.trim().toUpperCase())
    .eq("status", "active")
    .single();

  if (!student?.qr_token) {
    return NextResponse.json({ ok: false, error: "Student not found" });
  }

  const { data, error } = await supabase.rpc("student_qr_check_in", {
    p_slug: slug,
    p_qr_token: student.qr_token,
    p_batch_id: batchId,
    p_pin: pin ?? null,
    p_latitude: latitude,
    p_longitude: longitude,
    p_device_hint: "kiosk",
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const result = data as { ok: boolean; error?: string; student_name?: string };
  return NextResponse.json(result);
}
