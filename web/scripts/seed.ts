/**
 * Demo seed — run: bun run seed
 * Requires SUPABASE_SERVICE_ROLE_KEY in web/.env.local
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_EMAIL = "admin@demo.academy";
const DEMO_PASSWORD = "Demo@123456";

async function main() {
  console.log("🌱 Seeding sports-academia demo…");

  // Auth user
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  let userId = existingUsers?.users.find((u) => u.email === DEMO_EMAIL)?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("✓ Created auth user", DEMO_EMAIL);
  } else {
    await admin.auth.admin.updateUserById(userId, { password: DEMO_PASSWORD });
    console.log("✓ Auth user exists, password reset");
  }

  // Clean prior demo academy
  const { data: old } = await admin.from("academies").select("id").eq("slug", "kca-hyderabad").maybeSingle();
  if (old) {
    await admin.from("academies").delete().eq("id", old.id);
    console.log("✓ Cleared previous demo academy");
  }

  const { data: academy, error: acErr } = await admin
    .from("academies")
    .insert({ name: "Kohinoor Cricket Academy", slug: "kca-hyderabad" })
    .select()
    .single();
  if (acErr) throw acErr;

  await admin.from("academy_settings").insert({
    academy_id: academy.id,
    receipt_prefix: "KCA",
    address: "Madhapur, Hyderabad, Telangana",
    contact_number: "9876543210",
    whatsapp_number: "9876543210",
    email: "info@kca.demo",
    brand_color: "#0F766E",
  });

  await admin.from("academy_users").insert({
    academy_id: academy.id,
    user_id: userId,
    role: "admin",
    display_name: "Demo Admin",
  });

  const sports = await admin
    .from("sports")
    .insert([
      { academy_id: academy.id, name: "Cricket" },
      { academy_id: academy.id, name: "Football" },
    ])
    .select();
  const cricket = sports.data!.find((s) => s.name === "Cricket")!;

  const { data: coach } = await admin
    .from("coaches")
    .insert({
      academy_id: academy.id,
      name: "Coach Arjun",
      mobile: "9876501234",
      designation: "Head Coach",
    })
    .select()
    .single();

  const { data: batchMorning } = await admin
    .from("batches")
    .insert({
      academy_id: academy.id,
      name: "Morning Cricket U12",
      sport_id: cricket.id,
      coach_id: coach!.id,
      capacity: 20,
      start_time: "06:00",
      end_time: "08:00",
      session_type: "morning",
    })
    .select()
    .single();

  const { data: batchEvening } = await admin
    .from("batches")
    .insert({
      academy_id: academy.id,
      name: "Evening Cricket U14",
      sport_id: cricket.id,
      coach_id: coach!.id,
      capacity: 18,
      start_time: "17:00",
      end_time: "19:00",
      session_type: "evening",
    })
    .select()
    .single();

  const feeTypes = await admin
    .from("fee_types")
    .insert([
      { academy_id: academy.id, name: "Monthly fee" },
      { academy_id: academy.id, name: "Admission fee" },
    ])
    .select();
  const monthlyFee = feeTypes.data!.find((f) => f.name === "Monthly fee")!;

  const studentRows = [
    { name: "Arjun Kumar", parent: "Ravi Kumar", mobile: "9988776655" },
    { name: "Priya Sharma", parent: "Anita Sharma", mobile: "9988776644" },
    { name: "Rohan Reddy", parent: "Suresh Reddy", mobile: "9988776633" },
    { name: "Sneha Patel", parent: "Meena Patel", mobile: "9988776622" },
    { name: "Vikram Singh", parent: "Raj Singh", mobile: "9988776611" },
  ];

  const today = new Date();
  const dueSoon = new Date(today);
  dueSoon.setDate(dueSoon.getDate() + 5);
  const overdue = new Date(today);
  overdue.setDate(overdue.getDate() - 10);

  for (let i = 0; i < studentRows.length; i++) {
    const s = studentRows[i];
    const code = `KCA-${String(i + 1).padStart(4, "0")}`;
    const { data: student } = await admin
      .from("students")
      .insert({
        academy_id: academy.id,
        student_code: code,
        name: s.name,
        parent_name: s.parent,
        mobile: s.mobile,
        whatsapp: s.mobile,
        sport_id: cricket.id,
        status: "active",
      })
      .select()
      .single();

    await admin.from("batch_students").insert({
      academy_id: academy.id,
      batch_id: i % 2 === 0 ? batchMorning!.id : batchEvening!.id,
      student_id: student!.id,
    });

    const dueDate = i < 2 ? overdue.toISOString().slice(0, 10) : dueSoon.toISOString().slice(0, 10);
    const status = i < 2 ? "overdue" : "pending";
    const amount = 2500;

    await admin.from("student_fees").insert({
      academy_id: academy.id,
      student_id: student!.id,
      fee_type_id: monthlyFee.id,
      amount,
      pending_amount: amount,
      due_date: dueDate,
      status,
    });

    // Mark today's attendance
    await admin.from("attendance").insert({
      academy_id: academy.id,
      batch_id: i % 2 === 0 ? batchMorning!.id : batchEvening!.id,
      student_id: student!.id,
      attendance_date: today.toISOString().slice(0, 10),
      status: i === 4 ? "absent" : "present",
    });
  }

  // One paid student with receipt
  const { data: paidStudent } = await admin
    .from("students")
    .select("id")
    .eq("student_code", "KCA-0001")
    .single();

  const { data: paidFee } = await admin
    .from("student_fees")
    .select("id")
    .eq("student_id", paidStudent!.id)
    .single();

  const { data: academyUser } = await admin
    .from("academy_users")
    .select("id")
    .eq("academy_id", academy.id)
    .single();

  const { data: payment } = await admin
    .from("payments")
    .insert({
      academy_id: academy.id,
      student_fee_id: paidFee!.id,
      amount: 1500,
      payment_mode: "upi",
      collected_by: academyUser!.id,
    })
    .select()
    .single();

  await admin
    .from("student_fees")
    .update({
      paid_amount: 1500,
      pending_amount: 1000,
      status: "partially_paid",
    })
    .eq("id", paidFee!.id);

  await admin.from("receipt_sequences").upsert({
    academy_id: academy.id,
    financial_year: 2026,
    last_sequence: 1,
  });

  await admin.from("receipts").insert({
    academy_id: academy.id,
    payment_id: payment!.id,
    receipt_number: "KCA-2026-0001",
  });

  await admin.from("leads").insert([
    {
      academy_id: academy.id,
      name: "Ayaan Khan",
      parent_name: "Imran Khan",
      mobile: "9876512345",
      sport_interested: "Cricket",
      status: "trial_booked",
      source: "Instagram",
    },
    {
      academy_id: academy.id,
      name: "Diya Nair",
      parent_name: "Lakshmi Nair",
      mobile: "9876523456",
      sport_interested: "Cricket",
      status: "new_enquiry",
      source: "WhatsApp",
    },
  ]);

  await admin.from("whatsapp_templates").insert({
    academy_id: academy.id,
    name: "Fee reminder",
    message_type: "fee_due",
    body: "Hello {parent_name}, fee of {pending_amount} is due for {student_name}. - {academy_name}",
  });

  console.log("\n✅ Demo seed complete!");
  console.log("   Login:", DEMO_EMAIL);
  console.log("   Password:", DEMO_PASSWORD);
  console.log("   Public page: /a/kca-hyderabad");
  console.log("   Enquiry form: /a/kca-hyderabad/enquire\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
