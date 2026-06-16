"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import { requireAcademyContext } from "@/lib/auth";
import { canManageTeam, canMutateFees } from "@/lib/permissions";
import { checkPlanLimit } from "@/lib/plan-limits";
import { generateReceiptPdf, generateIdCardPdf } from "@/lib/pdf";
import { receiptVerifyUrl } from "@/lib/qr-urls";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";
import {
  getMappedValue,
  normalizeMobile,
  parseWorkbook,
  rowToObject,
  exportErrorsWorkbook,
} from "@/lib/import/excel";
import { canSelfServeImport } from "@/lib/plans";
import type { LeadStatus } from "@/types";
import * as XLSX from "xlsx";
import { rel } from "@/lib/utils";

export async function collectPayment(formData: FormData) {
  const ctx = await requireAcademyContext();
  if (!canMutateFees(ctx.role)) throw new Error("Forbidden");

  const supabase = await createClient();
  const feeId = formData.get("fee_id") as string;
  const amount = Number(formData.get("amount"));
  const mode = formData.get("payment_mode") as string;

  const { data: fee } = await supabase
    .from("student_fees")
    .select("*, students(name, parent_name, whatsapp, mobile), fee_types(name)")
    .eq("id", feeId)
    .single();

  if (!fee || amount <= 0 || amount > Number(fee.pending_amount)) {
    throw new Error("Invalid payment amount");
  }

  const { data: academyUser } = await supabase
    .from("academy_users")
    .select("id")
    .eq("user_id", ctx.user.id)
    .single();

  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .insert({
      academy_id: ctx.academyId,
      student_fee_id: feeId,
      amount,
      payment_mode: mode,
      collected_by: academyUser?.id,
    })
    .select()
    .single();

  if (payErr) throw payErr;

  const newPaid = Number(fee.paid_amount) + amount;
  const newPending = Number(fee.pending_amount) - amount;
  const status =
    newPending <= 0 ? "paid" : newPaid > 0 ? "partially_paid" : fee.status;

  await supabase
    .from("student_fees")
    .update({ paid_amount: newPaid, pending_amount: newPending, status })
    .eq("id", feeId);

  const { data: receiptNo } = await supabase.rpc("next_receipt_number", {
    p_academy_id: ctx.academyId,
  });

  const verifyToken = crypto.randomUUID().replace(/-/g, "");

  const { data: receipt } = await supabase
    .from("receipts")
    .insert({
      academy_id: ctx.academyId,
      payment_id: payment.id,
      receipt_number: receiptNo,
      verify_token: verifyToken,
    })
    .select()
    .single();

  const student = fee.students as { name: string; parent_name: string } | { name: string; parent_name: string }[] | null;
  const feeType = fee.fee_types as { name: string } | { name: string }[] | null;
  const verifyUrl = receiptVerifyUrl(verifyToken);

  try {
    const pdfBuffer = await generateReceiptPdf({
      academyName: ctx.academyUser.academies.name,
      receiptNumber: receiptNo as string,
      studentName: rel(student)?.name ?? "",
      parentName: rel(student)?.parent_name ?? "",
      feeType: rel(feeType)?.name ?? "Fee",
      amount,
      paymentMode: mode,
      paymentDate: new Date().toISOString().slice(0, 10),
      pendingBalance: newPending,
      verifyUrl,
    });
    const path = `${ctx.academyId}/receipts/${receipt!.id}.pdf`;
    await supabase.storage.from("documents").upload(path, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });
    await supabase.from("receipts").update({ pdf_url: path }).eq("id", receipt!.id);
  } catch {
    /* PDF optional if storage not configured */
  }

  await writeAuditLog({
    academyId: ctx.academyId,
    userId: ctx.user.id,
    action: "payment_collected",
    entityType: "payment",
    entityId: payment.id,
    newValue: { amount, mode, receipt_number: receiptNo },
  });

  revalidatePath("/fees");
  revalidatePath("/dashboard");
  revalidatePath("/receipts");
  return { ...receipt, verify_token: verifyToken };
}

export async function createStudentFee(formData: FormData) {
  const ctx = await requireAcademyContext();
  if (!canMutateFees(ctx.role)) throw new Error("Forbidden");

  const supabase = await createClient();
  const amount = Number(formData.get("amount"));
  const discount = Number(formData.get("discount") || 0);

  const { error } = await supabase.from("student_fees").insert({
    academy_id: ctx.academyId,
    student_id: formData.get("student_id") as string,
    fee_type_id: formData.get("fee_type_id") as string,
    amount,
    discount,
    pending_amount: amount - discount,
    due_date: formData.get("due_date") as string,
    created_by: ctx.user.id,
  });

  if (error) throw error;
  revalidatePath("/fees");
  revalidatePath("/students");
}

export async function saveAttendance(
  batchId: string,
  date: string,
  records: { student_id: string; status: string }[],
) {
  const ctx = await requireAcademyContext();
  if (ctx.role === "owner") throw new Error("Forbidden");

  const supabase = await createClient();
  const { data: academyUser } = await supabase
    .from("academy_users")
    .select("id")
    .eq("user_id", ctx.user.id)
    .single();

  const source = ctx.role === "coach" ? "coach" : "manual";

  const rows = records.map((r) => ({
    academy_id: ctx.academyId,
    batch_id: batchId,
    student_id: r.student_id,
    attendance_date: date,
    status: r.status,
    marked_by: academyUser?.id,
    marked_at: new Date().toISOString(),
    source,
  }));

  const { error } = await supabase.from("attendance").upsert(rows, {
    onConflict: "academy_id,batch_id,student_id,attendance_date",
  });

  if (error) throw error;
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function createStudent(formData: FormData) {
  const ctx = await requireAcademyContext();
  if (ctx.role === "coach" || ctx.role === "owner") throw new Error("Forbidden");

  const limit = await checkPlanLimit(ctx.academyId, ctx.plan, "students");
  if (!limit.ok) throw new Error(limit.message);

  const supabase = await createClient();
  const { data: code } = await supabase.rpc("next_student_code", {
    p_academy_id: ctx.academyId,
  });

  const { data: student, error } = await supabase
    .from("students")
    .insert({
      academy_id: ctx.academyId,
      student_code: code,
      name: formData.get("name") as string,
      parent_name: formData.get("parent_name") as string,
      mobile: formData.get("mobile") as string,
      whatsapp: (formData.get("whatsapp") as string) || (formData.get("mobile") as string),
      sport_id: (formData.get("sport_id") as string) || null,
      created_by: ctx.user.id,
    })
    .select()
    .single();

  if (error) throw error;

  const batchId = formData.get("batch_id") as string;
  if (batchId) {
    await supabase.from("batch_students").insert({
      academy_id: ctx.academyId,
      batch_id: batchId,
      student_id: student.id,
    });
  }

  revalidatePath("/students");
  return student;
}

export async function convertLead(leadId: string, batchId: string) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .eq("academy_id", ctx.academyId)
    .single();
  if (!lead) throw new Error("Lead not found");

  const fd = new FormData();
  fd.set("name", lead.name);
  fd.set("parent_name", lead.parent_name ?? lead.name);
  fd.set("mobile", lead.mobile);
  fd.set("whatsapp", lead.whatsapp ?? lead.mobile);
  fd.set("batch_id", batchId);

  const student = await createStudent(fd);

  await supabase
    .from("leads")
    .update({
      status: "converted",
      converted_student_id: student.id,
      converted_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  revalidatePath("/leads");
}

export async function updateLeadStatus(leadId: string, status: LeadStatus, trialDate?: string) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  const updates: Record<string, unknown> = { status };
  if (trialDate) updates.trial_date = trialDate;
  if (status === "trial_booked" && !trialDate) {
    updates.trial_date = new Date().toISOString().slice(0, 10);
  }
  await supabase.from("leads").update(updates).eq("id", leadId).eq("academy_id", ctx.academyId);
  revalidatePath("/leads");
}

export async function addLeadFollowup(leadId: string, note: string) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  await supabase.from("lead_followups").insert({
    academy_id: ctx.academyId,
    lead_id: leadId,
    note,
    created_by: ctx.user.id,
  });
  revalidatePath("/leads");
}

export async function generateTrialLink(leadId: string) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  const token = crypto.randomUUID().replace(/-/g, "");
  await supabase
    .from("leads")
    .update({ check_in_token: token, status: "trial_booked" })
    .eq("id", leadId)
    .eq("academy_id", ctx.academyId);
  revalidatePath("/leads");
  return `${siteConfig.appUrl}/a/${ctx.academySlug}/trial/${token}`;
}

export async function logWhatsApp(
  studentId: string | null,
  recipient: string,
  messageType: string,
  body: string,
) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  await supabase.from("whatsapp_logs").insert({
    academy_id: ctx.academyId,
    student_id: studentId,
    recipient,
    message_type: messageType,
    body,
    channel: "click_to_send",
    status: "manual_sent",
    triggered_by: ctx.user.id,
  });
}

export async function saveAcademySettings(formData: FormData) {
  const ctx = await requireAcademyContext();
  if (!canManageTeam(ctx.role)) throw new Error("Forbidden");

  const supabase = await createClient();
  const lat = formData.get("latitude");
  const lng = formData.get("longitude");

  const { error } = await supabase
    .from("academy_settings")
    .update({
      address: (formData.get("address") as string) || null,
      contact_number: (formData.get("contact_number") as string) || null,
      whatsapp_number: (formData.get("whatsapp_number") as string) || null,
      email: (formData.get("email") as string) || null,
      google_review_link: (formData.get("google_review_link") as string) || null,
      receipt_prefix: (formData.get("receipt_prefix") as string) || "KCA",
      latitude: lat ? Number(lat) : null,
      longitude: lng ? Number(lng) : null,
      geofence_radius_m: Number(formData.get("geofence_radius_m") || 200),
      geofence_required: formData.get("geofence_required") === "on",
      qr_checkin_enabled: formData.get("qr_checkin_enabled") === "on",
      checkin_pin_required: formData.get("checkin_pin_required") === "on",
      checkin_window_before_min: Number(formData.get("checkin_window_before_min") || 30),
      checkin_window_after_min: Number(formData.get("checkin_window_after_min") || 15),
      digest_time: (formData.get("digest_time") as string) || "20:00:00",
      reminders_enabled: formData.get("reminders_enabled") === "on",
    })
    .eq("academy_id", ctx.academyId);

  if (error) throw error;
  await writeAuditLog({
    academyId: ctx.academyId,
    userId: ctx.user.id,
    action: "settings_updated",
    entityType: "academy_settings",
    entityId: ctx.academyId,
  });
  revalidatePath("/settings");
}

export async function createSport(name: string) {
  const ctx = await requireAcademyContext();
  if (!canManageTeam(ctx.role)) throw new Error("Forbidden");
  const limit = await checkPlanLimit(ctx.academyId, ctx.plan, "sports");
  if (!limit.ok) throw new Error(limit.message);

  const supabase = await createClient();
  const { error } = await supabase.from("sports").insert({ academy_id: ctx.academyId, name });
  if (error) throw error;
  revalidatePath("/settings");
}

export async function createCoach(formData: FormData) {
  const ctx = await requireAcademyContext();
  if (!canManageTeam(ctx.role)) throw new Error("Forbidden");

  const supabase = await createClient();
  const { data: coach, error } = await supabase
    .from("coaches")
    .insert({
      academy_id: ctx.academyId,
      name: formData.get("name") as string,
      mobile: (formData.get("mobile") as string) || null,
      email: (formData.get("email") as string) || null,
      designation: (formData.get("designation") as string) || "Coach",
    })
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/team");
  return coach;
}

export async function inviteCoachUser(coachId: string, email: string, displayName: string) {
  const ctx = await requireAcademyContext();
  if (!canManageTeam(ctx.role)) throw new Error("Forbidden");
  if (ctx.plan !== "pro") throw new Error("Coach logins require Pro plan");

  const limit = await checkPlanLimit(ctx.academyId, ctx.plan, "users");
  if (!limit.ok) throw new Error(limit.message);

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("academy_users")
    .select("id")
    .eq("academy_id", ctx.academyId)
    .eq("coach_id", coachId)
    .maybeSingle();

  if (existing) throw new Error("Coach already has login");

  await supabase.from("academy_users").insert({
    academy_id: ctx.academyId,
    user_id: ctx.user.id,
    role: "coach",
    display_name: displayName,
    coach_id: coachId,
  });

  revalidatePath("/team");
  return { note: "Link coach to auth user via Supabase invite in admin panel", email };
}

export async function regenerateStudentQr(studentId: string) {
  const ctx = await requireAcademyContext();
  if (!canManageTeam(ctx.role)) throw new Error("Forbidden");

  const supabase = await createClient();
  const newToken = crypto.randomUUID().replace(/-/g, "");
  const { data: old } = await supabase.from("students").select("qr_token").eq("id", studentId).single();

  await supabase
    .from("students")
    .update({ qr_token: newToken, qr_token_created_at: new Date().toISOString() })
    .eq("id", studentId)
    .eq("academy_id", ctx.academyId);

  await writeAuditLog({
    academyId: ctx.academyId,
    userId: ctx.user.id,
    action: "qr_regenerated",
    entityType: "student",
    entityId: studentId,
    oldValue: { qr_token: old?.qr_token },
    newValue: { qr_token: newToken },
  });
  revalidatePath(`/students/${studentId}`);
}

export async function runSmartImport(formData: FormData) {
  const ctx = await requireAcademyContext();
  if (!canManageTeam(ctx.role)) throw new Error("Forbidden");
  if (!canSelfServeImport(ctx.plan)) throw new Error("Excel import requires Pro plan");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file");

  const buffer = await file.arrayBuffer();
  const sheets = parseWorkbook(buffer);
  const supabase = await createClient();
  const errors: { row: number; reason: string; data: Record<string, unknown> }[] = [];
  let successCount = 0;
  const entityTypes: string[] = [];

  for (const sheet of sheets) {
    entityTypes.push(sheet.entity);
    const mapping = sheet.mapping;

    for (let i = 0; i < sheet.dataRows.length; i++) {
      const rowArr = sheet.dataRows[i] as unknown[];
      const row = rowToObject(sheet.headers, rowArr);
      const rowNum = i + 2;

      try {
        if (sheet.entity === "students") {
          const name = getMappedValue(row, mapping, "name");
          const mobile = getMappedValue(row, mapping, "mobile");
          if (!name || !mobile) {
            errors.push({ row: rowNum, reason: "Missing name or mobile", data: row });
            continue;
          }
          const limit = await checkPlanLimit(ctx.academyId, ctx.plan, "students");
          if (!limit.ok) throw new Error(limit.message);

          const { data: code } = await supabase.rpc("next_student_code", {
            p_academy_id: ctx.academyId,
          });

          const { data: student, error } = await supabase
            .from("students")
            .insert({
              academy_id: ctx.academyId,
              student_code: code,
              name,
              parent_name: getMappedValue(row, mapping, "parent_name") || name,
              mobile: normalizeMobile(mobile),
              whatsapp: normalizeMobile(getMappedValue(row, mapping, "whatsapp") || mobile),
              created_by: ctx.user.id,
            })
            .select()
            .single();

          if (error) {
            errors.push({ row: rowNum, reason: error.message, data: row });
            continue;
          }

          const batchName = getMappedValue(row, mapping, "batch_name");
          if (batchName && student) {
            const { data: batch } = await supabase
              .from("batches")
              .select("id")
              .eq("academy_id", ctx.academyId)
              .ilike("name", batchName)
              .maybeSingle();
            if (batch) {
              await supabase.from("batch_students").insert({
                academy_id: ctx.academyId,
                batch_id: batch.id,
                student_id: student.id,
              });
            }
          }
          successCount++;
        } else if (sheet.entity === "batches") {
          const name = getMappedValue(row, mapping, "name") || getMappedValue(row, mapping, "batch_name");
          if (!name) {
            errors.push({ row: rowNum, reason: "Missing batch name", data: row });
            continue;
          }
          const limit = await checkPlanLimit(ctx.academyId, ctx.plan, "batches");
          if (!limit.ok) throw new Error(limit.message);

          const { error } = await supabase.from("batches").insert({
            academy_id: ctx.academyId,
            name,
            capacity: Number(getMappedValue(row, mapping, "capacity") || 20),
          });
          if (error) errors.push({ row: rowNum, reason: error.message, data: row });
          else successCount++;
        }
      } catch (e) {
        errors.push({ row: rowNum, reason: e instanceof Error ? e.message : "Unknown error", data: row });
      }
    }
  }

  await supabase.from("import_logs").insert({
    academy_id: ctx.academyId,
    user_id: ctx.user.id,
    file_name: file.name,
    entity_types: entityTypes,
    success_count: successCount,
    error_count: errors.length,
    errors: errors.slice(0, 100),
  });

  revalidatePath("/students");
  revalidatePath("/batches");
  revalidatePath("/import");

  if (errors.length > 0) {
    const errBuf = exportErrorsWorkbook(errors);
    return {
      successCount,
      errorCount: errors.length,
      errorFileBase64: Buffer.from(errBuf).toString("base64"),
    };
  }
  return { successCount, errorCount: 0 };
}

export async function buildOwnerDigest() {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: payments },
    { data: attendance },
    { data: overdue },
    { count: leadCount },
    { count: trialCount },
  ] = await Promise.all([
    supabase.from("payments").select("amount").eq("payment_date", today).eq("status", "active"),
    supabase.from("attendance").select("source, status").eq("attendance_date", today),
    supabase
      .from("student_fees")
      .select("pending_amount")
      .in("status", ["overdue"]),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "trial_attended")
      .eq("trial_date", today),
  ]);

  const collected = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const present = attendance?.filter((a) => a.status === "present").length ?? 0;
  const qrCheckIns = attendance?.filter((a) => a.source === "qr_scan" && a.status === "present").length ?? 0;
  const manualCheckIns = present - qrCheckIns;
  const overdueAmount = overdue?.reduce((s, f) => s + Number(f.pending_amount), 0) ?? 0;

  const { ownerDigestMessage } = await import("@/lib/whatsapp-messages");
  const body = ownerDigestMessage({
    academyName: ctx.academyUser.academies.name,
    date: today,
    collected,
    present,
    totalStudents: present,
    qrCheckIns,
    manualCheckIns,
    overdueAmount,
    overdueCount: overdue?.length ?? 0,
    newLeads: leadCount ?? 0,
    trialsAttended: trialCount ?? 0,
  });

  await supabase.from("owner_digest_snapshots").upsert(
    {
      academy_id: ctx.academyId,
      digest_date: today,
      payload: { collected, present, qrCheckIns, manualCheckIns, overdueAmount },
      whatsapp_body: body,
    },
    { onConflict: "academy_id,digest_date" },
  );

  revalidatePath("/dashboard");
  return body;
}

export async function buildFeeReminders() {
  const ctx = await requireAcademyContext();
  if (!canMutateFees(ctx.role)) throw new Error("Forbidden");

  const supabase = await createClient();
  const { data: fees } = await supabase
    .from("student_fees")
    .select("pending_amount, due_date, students(name, mobile, whatsapp)")
    .in("status", ["overdue", "pending"])
    .gt("pending_amount", 0);

  const { feeReminderMessage } = await import("@/lib/whatsapp-messages");
  const today = new Date().toISOString().slice(0, 10);

  for (const fee of fees ?? []) {
    const student = rel<{ name: string; mobile: string; whatsapp: string | null }>(fee.students);
    if (!student) continue;
    const body = feeReminderMessage({
      academyName: ctx.academyUser.academies.name,
      studentName: student.name,
      pendingAmount: Number(fee.pending_amount),
      dueDate: fee.due_date,
    });
    await supabase.from("reminder_queue").insert({
      academy_id: ctx.academyId,
      reminder_type: "fee_overdue",
      recipient_mobile: student.whatsapp || student.mobile,
      recipient_name: student.name,
      whatsapp_body: body,
      due_date: today,
    });
  }

  revalidatePath("/reminders");
}

export async function markReminderSent(id: string) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();
  await supabase
    .from("reminder_queue")
    .update({ sent_at: new Date().toISOString() })
    .eq("id", id)
    .eq("academy_id", ctx.academyId);
  revalidatePath("/reminders");
}

export async function qrCheckIn(
  slug: string,
  token: string,
  batchId: string,
  pin: string | null,
  lat: number,
  lng: number,
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("student_qr_check_in", {
    p_slug: slug,
    p_qr_token: token,
    p_batch_id: batchId,
    p_pin: pin,
    p_latitude: lat,
    p_longitude: lng,
    p_device_hint: null,
  });
  if (error) throw error;
  return data as { ok: boolean; error?: string; student_name?: string; batch_name?: string };
}

export async function trialCheckIn(slug: string, token: string, lat: number, lng: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("trial_lead_check_in", {
    p_slug: slug,
    p_token: token,
    p_latitude: lat,
    p_longitude: lng,
  });
  if (error) throw error;
  return data as { ok: boolean; error?: string; lead_name?: string };
}

export async function generateIdCards(batchId: string) {
  const ctx = await requireAcademyContext();
  const supabase = await createClient();

  const { data: batch } = await supabase
    .from("batches")
    .select("*, sports(name)")
    .eq("id", batchId)
    .single();

  const { data: roster } = await supabase
    .from("batch_students")
    .select("students(*)")
    .eq("batch_id", batchId)
    .eq("is_active", true);

  const cards: { name: string; base64: string }[] = [];
  for (const row of roster ?? []) {
    const student = rel<{
      name: string;
      student_code: string;
      mobile: string;
      qr_token: string;
    }>(row.students);
    if (!student?.qr_token) continue;
    const { studentCheckInUrl } = await import("@/lib/qr-urls");
    const url = studentCheckInUrl(ctx.academySlug, student.qr_token);
    const buf = await generateIdCardPdf({
      academyName: ctx.academyUser.academies.name,
      brandColor: ctx.settings?.brand_color ?? "#0F766E",
      studentName: student.name,
      studentCode: student.student_code,
      batchName: batch?.name ?? "",
      sportName: (batch?.sports as { name: string } | null)?.name ?? "",
      parentMobile: student.mobile,
      checkInUrl: url,
    });
    cards.push({ name: student.name, base64: Buffer.from(buf).toString("base64") });
  }
  return cards;
}

export async function exportReportExcel(reportType: string, from: string, to: string) {
  const ctx = await requireAcademyContext();
  if (ctx.plan !== "pro") throw new Error("Export requires Pro");
  if (ctx.role !== "admin" && ctx.role !== "owner") throw new Error("Forbidden");

  const supabase = await createClient();
  let rows: Record<string, unknown>[] = [];

  if (reportType === "financial") {
    const { data } = await supabase
      .from("payments")
      .select("amount, payment_mode, payment_date, student_fees(students(name))")
      .gte("payment_date", from)
      .lte("payment_date", to)
      .eq("status", "active");
    rows = (data ?? []).map((p) => {
      const sf = rel<{ students: { name: string } | { name: string }[] | null }>(p.student_fees);
      return {
        date: p.payment_date,
        amount: p.amount,
        mode: p.payment_mode,
        student: rel(sf?.students)?.name,
      };
    });
  } else if (reportType === "attendance") {
    const { data } = await supabase
      .from("attendance")
      .select("attendance_date, status, source, students(name), batches(name)")
      .gte("attendance_date", from)
      .lte("attendance_date", to);
    rows = (data ?? []).map((a) => ({
      date: a.attendance_date,
      student: rel<{ name: string }>(a.students)?.name,
      batch: rel<{ name: string }>(a.batches)?.name,
      status: a.status,
      source: a.source,
    }));
  } else if (reportType === "leads") {
    const { data } = await supabase
      .from("leads")
      .select("name, mobile, status, trial_date, created_at")
      .gte("created_at", `${from}T00:00:00`)
      .lte("created_at", `${to}T23:59:59`);
    rows = data ?? [];
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, reportType);
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return Buffer.from(buf).toString("base64");
}
