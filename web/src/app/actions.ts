"use server";

import { createClient } from "@/lib/supabase/server";
import { getAcademyContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function collectPayment(formData: FormData) {
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");

  const supabase = await createClient();
  const feeId = formData.get("fee_id") as string;
  const amount = Number(formData.get("amount"));
  const mode = formData.get("payment_mode") as string;

  const { data: fee } = await supabase
    .from("student_fees")
    .select("*")
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
    .update({
      paid_amount: newPaid,
      pending_amount: newPending,
      status,
    })
    .eq("id", feeId);

  const { data: receiptNo } = await supabase.rpc("next_receipt_number", {
    p_academy_id: ctx.academyId,
  });

  const { data: receipt } = await supabase
    .from("receipts")
    .insert({
      academy_id: ctx.academyId,
      payment_id: payment.id,
      receipt_number: receiptNo,
    })
    .select()
    .single();

  revalidatePath("/fees");
  revalidatePath("/dashboard");
  revalidatePath("/receipts");
  return receipt;
}

export async function createStudentFee(formData: FormData) {
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");

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
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data: academyUser } = await supabase
    .from("academy_users")
    .select("id")
    .eq("user_id", ctx.user.id)
    .single();

  const rows = records.map((r) => ({
    academy_id: ctx.academyId,
    batch_id: batchId,
    student_id: r.student_id,
    attendance_date: date,
    status: r.status,
    marked_by: academyUser?.id,
    marked_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("attendance").upsert(rows, {
    onConflict: "academy_id,batch_id,student_id,attendance_date",
  });

  if (error) throw error;
  revalidatePath("/attendance");
  revalidatePath("/dashboard");
}

export async function createStudent(formData: FormData) {
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");

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
  const ctx = await getAcademyContext();
  if (!ctx) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();
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

export async function logWhatsApp(
  studentId: string | null,
  recipient: string,
  messageType: string,
  body: string,
) {
  const ctx = await getAcademyContext();
  if (!ctx) return;

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
