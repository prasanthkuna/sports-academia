/**
 * Rich demo seed — run: cd web && bun run seed
 * Requires SUPABASE_SERVICE_ROLE_KEY in web/.env.local
 *
 * Fee amounts and day-level stats align with Hyderabad market data in
 * src/lib/hyderabad-market.ts (same source as the landing page).
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import {
  hyderabadDemoDay,
  hyderabadFees,
  formatHyderabadInr,
} from "../src/lib/hyderabad-market";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SLUG = "kca-hyderabad";
const DEMO_PASSWORD = "Demo@123456";

const FEES = hyderabadFees;
const DAY = hyderabadDemoDay;
const fmt = formatHyderabadInr;

const USERS = {
  owner: { email: "owner@demo.academy", role: "owner" as const, name: "Ramesh Owner" },
  staff: { email: "staff@demo.academy", role: "staff" as const, name: "Anita Staff" },
  coach: { email: "coach@demo.academy", role: "coach" as const, name: "Coach Arjun" },
};

function token() {
  return randomBytes(18).toString("hex");
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function ensureAuthUser(email: string) {
  const { data: existingUsers } = await admin.auth.admin.listUsers({ perPage: 200 });
  let userId = existingUsers?.users.find((u) => u.email === email)?.id;
  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("  ✓ Auth:", email);
  } else {
    await admin.auth.admin.updateUserById(userId, { password: DEMO_PASSWORD });
    console.log("  ✓ Auth reset:", email);
  }
  return userId!;
}

async function insertPaymentWithReceipt(opts: {
  academyId: string;
  studentFeeId: string;
  amount: number;
  mode: "upi" | "cash";
  paymentDate: string;
  collectedBy: string;
  receiptNumber: string;
  verifyToken?: string;
}) {
  const { data: payment } = await admin
    .from("payments")
    .insert({
      academy_id: opts.academyId,
      student_fee_id: opts.studentFeeId,
      amount: opts.amount,
      payment_mode: opts.mode,
      payment_date: opts.paymentDate,
      collected_by: opts.collectedBy,
    })
    .select()
    .single();

  if (opts.verifyToken) {
    await admin.from("receipts").insert({
      academy_id: opts.academyId,
      payment_id: payment!.id,
      receipt_number: opts.receiptNumber,
      verify_token: opts.verifyToken,
    });
  }

  return payment!;
}

async function main() {
  console.log("🌱 Seeding Hyderabad-aligned Pro demo data…\n");

  const authIds: Record<string, string> = {};
  for (const [key, u] of Object.entries(USERS)) {
    authIds[key] = await ensureAuthUser(u.email);
  }

  const { data: old } = await admin.from("academies").select("id").eq("slug", SLUG).maybeSingle();
  if (old) {
    await admin.from("academies").delete().eq("id", old.id);
    console.log("✓ Cleared previous demo academy\n");
  }

  const today = new Date();
  const todayStr = isoDate(today);

  const { data: academy, error: acErr } = await admin
    .from("academies")
    .insert({ name: "Kohinoor Cricket Academy", slug: SLUG, plan: "pro" })
    .select()
    .single();
  if (acErr) throw acErr;

  await admin.from("academy_settings").insert({
    academy_id: academy.id,
    receipt_prefix: "KCA",
    address: "Plot 12, Madhapur, Hyderabad, Telangana 500081",
    contact_number: "9876543210",
    whatsapp_number: "919876543210",
    email: "info@kohinoor.demo",
    brand_color: "#0F766E",
    google_review_link: "https://g.page/r/demo-kohinoor-cricket/review",
    latitude: 17.4486,
    longitude: 78.3908,
    geofence_radius_m: 200,
    geofence_required: true,
    qr_checkin_enabled: true,
    checkin_pin_required: true,
    checkin_window_before_min: 120,
    checkin_window_after_min: 60,
    digest_time: "20:00:00",
    reminders_enabled: true,
  });

  const { data: sports } = await admin
    .from("sports")
    .insert([
      { academy_id: academy.id, name: "Cricket" },
      { academy_id: academy.id, name: "Football" },
      { academy_id: academy.id, name: "Badminton" },
      { academy_id: academy.id, name: "Swimming" },
    ])
    .select();
  const sport = Object.fromEntries(sports!.map((s) => [s.name, s]));

  const { data: coaches } = await admin
    .from("coaches")
    .insert([
      {
        academy_id: academy.id,
        name: "Coach Arjun",
        mobile: "9876501234",
        email: "coach@demo.academy",
        designation: "Head Coach — Cricket",
      },
      {
        academy_id: academy.id,
        name: "Coach Priya",
        mobile: "9876505678",
        designation: "Football & Swimming",
      },
    ])
    .select();

  const coachArjun = coaches!.find((c) => c.name.includes("Arjun"))!;
  const coachPriya = coaches!.find((c) => c.name.includes("Priya"))!;

  const { data: staffRow } = await admin
    .from("staff")
    .insert({
      academy_id: academy.id,
      name: "Anita Staff",
      mobile: "9876511111",
      designation: "Front desk",
    })
    .select()
    .single();

  const weekday = [1, 2, 3, 4, 5, 6];
  const { data: batches } = await admin
    .from("batches")
    .insert([
      {
        academy_id: academy.id,
        name: "Morning Cricket U12",
        sport_id: sport.Cricket.id,
        coach_id: coachArjun.id,
        capacity: 24,
        start_time: "06:00",
        end_time: "08:00",
        session_type: "morning",
        days_of_week: weekday,
      },
      {
        academy_id: academy.id,
        name: "Evening Cricket U14",
        sport_id: sport.Cricket.id,
        coach_id: coachArjun.id,
        capacity: 20,
        start_time: "17:00",
        end_time: "19:00",
        session_type: "evening",
        days_of_week: weekday,
      },
      {
        academy_id: academy.id,
        name: "Weekend Football U10",
        sport_id: sport.Football.id,
        coach_id: coachPriya.id,
        capacity: 16,
        start_time: "07:00",
        end_time: "09:00",
        session_type: "weekend",
        days_of_week: [6, 7],
      },
      {
        academy_id: academy.id,
        name: "Badminton Beginners",
        sport_id: sport.Badminton.id,
        coach_id: coachPriya.id,
        capacity: 12,
        start_time: "18:00",
        end_time: "19:30",
        session_type: "evening",
        days_of_week: weekday,
      },
      {
        academy_id: academy.id,
        name: "Swimming Beginners",
        sport_id: sport.Swimming.id,
        coach_id: coachPriya.id,
        capacity: 10,
        start_time: "06:30",
        end_time: "07:30",
        session_type: "morning",
        days_of_week: weekday,
      },
    ])
    .select();

  const batchByName = Object.fromEntries(batches!.map((b) => [b.name, b]));

  const { data: feeTypes } = await admin
    .from("fee_types")
    .insert([
      { academy_id: academy.id, name: "Monthly fee" },
      { academy_id: academy.id, name: "Admission fee" },
      { academy_id: academy.id, name: "Summer camp" },
    ])
    .select();
  const feeMonthly = feeTypes!.find((f) => f.name === "Monthly fee")!;
  const feeAdmission = feeTypes!.find((f) => f.name === "Admission fee")!;
  const feeCamp = feeTypes!.find((f) => f.name === "Summer camp")!;

  const { data: feePlans } = await admin
    .from("fee_plans")
    .insert([
      {
        academy_id: academy.id,
        name: "U12 Cricket Monthly",
        plan_type: "monthly",
        amount: FEES.cricketMonthly,
        billing_cycle_months: 1,
        due_day: 5,
        fee_type_id: feeMonthly.id,
        sport_id: sport.Cricket.id,
        batch_id: batchByName["Morning Cricket U12"].id,
      },
      {
        academy_id: academy.id,
        name: "Quarterly Cricket",
        plan_type: "quarterly",
        amount: FEES.cricketQuarterly,
        billing_cycle_months: 3,
        due_day: 5,
        fee_type_id: feeMonthly.id,
        sport_id: sport.Cricket.id,
      },
      {
        academy_id: academy.id,
        name: "8-Session Badminton",
        plan_type: "session_package",
        amount: FEES.badminton8SessionPackage,
        total_sessions: 8,
        validity_days: 60,
        fee_type_id: feeMonthly.id,
        sport_id: sport.Badminton.id,
      },
      {
        academy_id: academy.id,
        name: "8-Session Swimming",
        plan_type: "session_package",
        amount: FEES.badminton8SessionPackage,
        total_sessions: 8,
        validity_days: 60,
        fee_type_id: feeMonthly.id,
        sport_id: sport.Swimming.id,
      },
      {
        academy_id: academy.id,
        name: "4-Week Summer Cricket Camp",
        plan_type: "summer_camp",
        amount: FEES.summerCamp4WeekCricket,
        validity_days: 28,
        fee_type_id: feeCamp.id,
        sport_id: sport.Cricket.id,
      },
      {
        academy_id: academy.id,
        name: "Admission",
        plan_type: "admission",
        amount: FEES.admission,
        fee_type_id: feeAdmission.id,
      },
      {
        academy_id: academy.id,
        name: "Personal Coaching 1:1",
        plan_type: "personal_coaching",
        amount: FEES.personalCoachingMonthly,
        billing_cycle_months: 1,
        due_day: 1,
        fee_type_id: feeMonthly.id,
        sport_id: sport.Cricket.id,
      },
    ])
    .select();

  const planMonthly = feePlans!.find((p) => p.plan_type === "monthly")!;
  const planSwimmingSession = feePlans!.find((p) => p.name === "8-Session Swimming")!;

  const { data: academyUsers } = await admin
    .from("academy_users")
    .insert([
      {
        academy_id: academy.id,
        user_id: authIds.owner,
        role: "owner",
        display_name: USERS.owner.name,
      },
      {
        academy_id: academy.id,
        user_id: authIds.staff,
        role: "staff",
        display_name: USERS.staff.name,
      },
      {
        academy_id: academy.id,
        user_id: authIds.coach,
        role: "coach",
        display_name: USERS.coach.name,
        coach_id: coachArjun.id,
      },
    ])
    .select();

  const ownerUser = academyUsers!.find((u) => u.role === "owner")!;

  const studentsData = [
    { name: "Arjun Kumar", parent: "Ravi Kumar", mobile: "9988776655", batch: "Morning Cricket U12", sport: "Cricket" },
    { name: "Priya Sharma", parent: "Anita Sharma", mobile: "9988776644", batch: "Evening Cricket U14", sport: "Cricket" },
    { name: "Rohan Reddy", parent: "Suresh Reddy", mobile: "9988776633", batch: "Morning Cricket U12", sport: "Cricket" },
    { name: "Sneha Patel", parent: "Meena Patel", mobile: "9988776622", batch: "Evening Cricket U14", sport: "Cricket" },
    { name: "Vikram Singh", parent: "Raj Singh", mobile: "9988776611", batch: "Morning Cricket U12", sport: "Cricket" },
    { name: "Kavya Iyer", parent: "Lakshmi Iyer", mobile: "9988776600", batch: "Swimming Beginners", sport: "Swimming" },
    { name: "Aditya Rao", parent: "Venkat Rao", mobile: "9988776599", batch: "Weekend Football U10", sport: "Football" },
    { name: "Isha Gupta", parent: "Sunil Gupta", mobile: "9988776588", batch: "Evening Cricket U14", sport: "Cricket" },
    { name: "Manoj Naidu", parent: "Rama Naidu", mobile: "9988776577", batch: "Morning Cricket U12", sport: "Cricket" },
    { name: "Divya Menon", parent: "Priya Menon", mobile: "9988776566", batch: "Badminton Beginners", sport: "Badminton" },
    { name: "Karthik Babu", parent: "Babu Rao", mobile: "9988776555", batch: "Weekend Football U10", sport: "Football" },
    { name: "Ananya Das", parent: "Smita Das", mobile: "9988776544", batch: "Evening Cricket U14", sport: "Cricket" },
  ];

  const demoQrTokens: Record<string, string> = {
    "KCA-0001": "demo_qr_arjun_kumar_0001",
    "KCA-0002": "demo_qr_priya_sharma_0002",
  };

  const studentIds: string[] = [];
  let seq = 0;
  let receiptSeq = 0;

  const overdueDate = isoDate(daysAgo(12));
  const dueSoonDate = isoDate(daysAgo(-7));

  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i]!;
    seq++;
    const code = `KCA-${String(seq).padStart(4, "0")}`;
    const { data: student } = await admin
      .from("students")
      .insert({
        academy_id: academy.id,
        student_code: code,
        name: s.name,
        parent_name: s.parent,
        mobile: s.mobile,
        whatsapp: s.mobile,
        sport_id: sport[s.sport as keyof typeof sport].id,
        status: "active",
        emergency_contact_name: s.parent,
        emergency_contact_number: s.mobile,
        medical_notes: i === 0 ? "Mild asthma — inhaler in bag" : null,
        qr_token: demoQrTokens[code] ?? token(),
      })
      .select()
      .single();

    studentIds.push(student!.id);
    const batch = batchByName[s.batch]!;

    await admin.from("batch_students").insert({
      academy_id: academy.id,
      batch_id: batch.id,
      student_id: student!.id,
    });

    // Fee scenarios — amounts match Hyderabad market + landing overdue examples
    if (i === 0) {
      // Arjun: full July cricket renewal collected today (landing verify link)
      const { data: fee } = await admin
        .from("student_fees")
        .insert({
          academy_id: academy.id,
          student_id: student!.id,
          fee_type_id: feeMonthly.id,
          amount: FEES.cricketMonthly,
          paid_amount: FEES.cricketMonthly,
          pending_amount: 0,
          due_date: overdueDate,
          status: "paid",
          period_label: "July 2026",
        })
        .select()
        .single();

      receiptSeq++;
      await insertPaymentWithReceipt({
        academyId: academy.id,
        studentFeeId: fee!.id,
        amount: FEES.cricketMonthly,
        mode: "upi",
        paymentDate: todayStr,
        collectedBy: ownerUser.id,
        receiptNumber: `KCA-2026-${String(receiptSeq).padStart(4, "0")}`,
        verifyToken: "demo_receipt_verify_0001",
      });
    } else if (i === 1) {
      await admin.from("student_fees").insert({
        academy_id: academy.id,
        student_id: student!.id,
        fee_type_id: feeMonthly.id,
        amount: FEES.cricketMonthly,
        pending_amount: FEES.cricketMonthly,
        due_date: overdueDate,
        status: "overdue",
        period_label: "July 2026",
      });
    } else if (i === 2) {
      await admin.from("student_fees").insert({
        academy_id: academy.id,
        student_id: student!.id,
        fee_type_id: feeMonthly.id,
        amount: FEES.cricketMonthly,
        pending_amount: FEES.cricketMonthly,
        due_date: overdueDate,
        status: "overdue",
        period_label: "July 2026",
      });
    } else if (i === 3) {
      // Sneha: partial catch-up — ₹1,500 collected today, ₹1,500 still overdue
      const { data: fee } = await admin
        .from("student_fees")
        .insert({
          academy_id: academy.id,
          student_id: student!.id,
          fee_type_id: feeMonthly.id,
          amount: FEES.cricketMonthly,
          paid_amount: FEES.partialBalance,
          pending_amount: FEES.partialBalance,
          due_date: overdueDate,
          status: "partially_paid",
          period_label: "July 2026",
        })
        .select()
        .single();

      await insertPaymentWithReceipt({
        academyId: academy.id,
        studentFeeId: fee!.id,
        amount: FEES.partialBalance,
        mode: "cash",
        paymentDate: todayStr,
        collectedBy: ownerUser.id,
        receiptNumber: `KCA-2026-${String(++receiptSeq).padStart(4, "0")}`,
      });
    } else if (i === 4) {
      await admin.from("student_fees").insert({
        academy_id: academy.id,
        student_id: student!.id,
        fee_type_id: feeMonthly.id,
        amount: FEES.cricketMonthly,
        pending_amount: FEES.cricketMonthly,
        due_date: overdueDate,
        status: "overdue",
        period_label: "July 2026",
      });
    } else if (i === 6) {
      const { data: fee } = await admin
        .from("student_fees")
        .insert({
          academy_id: academy.id,
          student_id: student!.id,
          fee_type_id: feeAdmission.id,
          amount: FEES.admission,
          paid_amount: FEES.admission,
          pending_amount: 0,
          due_date: isoDate(daysAgo(5)),
          status: "paid",
        })
        .select()
        .single();

      await insertPaymentWithReceipt({
        academyId: academy.id,
        studentFeeId: fee!.id,
        amount: FEES.admission,
        mode: "cash",
        paymentDate: isoDate(daysAgo(5)),
        collectedBy: ownerUser.id,
        receiptNumber: `KCA-2026-${String(++receiptSeq).padStart(4, "0")}`,
        verifyToken: "demo_receipt_verify_0002",
      });
    } else if (i === 7) {
      const { data: fee } = await admin
        .from("student_fees")
        .insert({
          academy_id: academy.id,
          student_id: student!.id,
          fee_type_id: feeMonthly.id,
          amount: FEES.cricketMonthly,
          paid_amount: FEES.cricketMonthly,
          pending_amount: 0,
          due_date: todayStr,
          status: "paid",
          period_label: "July 2026",
        })
        .select()
        .single();

      await insertPaymentWithReceipt({
        academyId: academy.id,
        studentFeeId: fee!.id,
        amount: FEES.cricketMonthly,
        mode: "upi",
        paymentDate: todayStr,
        collectedBy: ownerUser.id,
        receiptNumber: `KCA-2026-${String(++receiptSeq).padStart(4, "0")}`,
      });
    } else if (i === 10) {
      const { data: fee } = await admin
        .from("student_fees")
        .insert({
          academy_id: academy.id,
          student_id: student!.id,
          fee_type_id: feeMonthly.id,
          amount: FEES.cricketMonthly,
          paid_amount: FEES.cricketMonthly,
          pending_amount: 0,
          due_date: todayStr,
          status: "paid",
          period_label: "July 2026",
        })
        .select()
        .single();

      await insertPaymentWithReceipt({
        academyId: academy.id,
        studentFeeId: fee!.id,
        amount: FEES.cricketMonthly,
        mode: "cash",
        paymentDate: todayStr,
        collectedBy: ownerUser.id,
        receiptNumber: `KCA-2026-${String(++receiptSeq).padStart(4, "0")}`,
      });
    } else {
      await admin.from("student_fees").insert({
        academy_id: academy.id,
        student_id: student!.id,
        fee_type_id: feeMonthly.id,
        amount: FEES.cricketMonthly,
        pending_amount: FEES.cricketMonthly,
        due_date: dueSoonDate,
        status: "pending",
        period_label: "August 2026",
      });
    }

    const attSource = i < 4 ? "qr_scan" : i < 8 ? "manual" : "coach";
    const isAbsent = i === 4 || i === 10;
    await admin.from("attendance").insert({
      academy_id: academy.id,
      batch_id: batch.id,
      student_id: student!.id,
      attendance_date: todayStr,
      status: isAbsent ? "absent" : "present",
      source: attSource,
      marked_by: attSource === "coach" ? ownerUser.id : null,
    });

    if (attSource === "qr_scan" && !isAbsent) {
      await admin.from("qr_scan_logs").insert({
        academy_id: academy.id,
        student_id: student!.id,
        batch_id: batch.id,
        scan_type: "student_check_in",
        success: true,
        latitude: 17.4486,
        longitude: 78.3908,
        distance_m: 42,
        device_hint: "demo-seed",
      });
    }

    for (const daysBack of [1, 3, 7, 14]) {
      const d = isoDate(daysAgo(daysBack));
      await admin.from("attendance").insert({
        academy_id: academy.id,
        batch_id: batch.id,
        student_id: student!.id,
        attendance_date: d,
        status: daysBack === 7 && i % 3 === 0 ? "absent" : "present",
        source: daysBack % 2 === 0 ? "qr_scan" : "manual",
      });
    }
  }

  const assignStart = isoDate(daysAgo(30));
  for (let i = 0; i < 6; i++) {
    await admin.from("student_fee_assignments").insert({
      academy_id: academy.id,
      student_id: studentIds[i]!,
      fee_plan_id: planMonthly.id,
      start_date: assignStart,
      status: "active",
    });
  }

  // Kavya: 8-session swimming package — 2 sessions remaining (Hyderabad demo)
  await admin.from("student_fee_assignments").insert({
    academy_id: academy.id,
    student_id: studentIds[5]!,
    fee_plan_id: planSwimmingSession.id,
    start_date: assignStart,
    end_date: isoDate(daysAgo(-45)),
    sessions_total: 8,
    sessions_used: 8 - DAY.sessionsRemaining,
    status: "active",
  });

  // Manoj: expired monthly plan but attended today — renewal alert scenario
  await admin.from("student_fee_assignments").insert({
    academy_id: academy.id,
    student_id: studentIds[8]!,
    fee_plan_id: planMonthly.id,
    start_date: isoDate(daysAgo(90)),
    end_date: isoDate(daysAgo(3)),
    status: "expired",
  });

  await admin.rpc("generate_recurring_demands", { p_academy_id: academy.id });

  await admin.from("receipt_sequences").upsert({
    academy_id: academy.id,
    financial_year: 2026,
    last_sequence: receiptSeq,
  });

  const trialToken = "demo_trial_ayaan_khan";
  const { data: leads } = await admin
    .from("leads")
    .insert([
      {
        academy_id: academy.id,
        name: "Ayaan Khan",
        parent_name: "Imran Khan",
        mobile: "9876512345",
        sport_interested: "Cricket",
        status: "trial_booked",
        trial_date: todayStr,
        check_in_token: trialToken,
        source: "Instagram",
        assigned_staff_id: staffRow!.id,
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
      {
        academy_id: academy.id,
        name: "Farhan Ali",
        parent_name: "Salman Ali",
        mobile: "9876534567",
        sport_interested: "Football",
        status: "contacted",
        source: "Public form",
      },
      {
        academy_id: academy.id,
        name: "Meera Joshi",
        parent_name: "Amit Joshi",
        mobile: "9876545678",
        sport_interested: "Badminton",
        status: "trial_attended",
        trial_date: isoDate(daysAgo(1)),
        source: "Referral",
      },
      {
        academy_id: academy.id,
        name: "Nikhil Verma",
        parent_name: "Suresh Verma",
        mobile: "9876556789",
        sport_interested: "Cricket",
        status: "follow_up_pending",
        source: "Google",
      },
      {
        academy_id: academy.id,
        name: "Old Lead",
        parent_name: "Test Parent",
        mobile: "9876567890",
        status: "lost",
        source: "Walk-in",
      },
    ])
    .select();

  const ayaanLead = leads!.find((l) => l.name === "Ayaan Khan")!;
  await admin.from("lead_followups").insert([
    {
      academy_id: academy.id,
      lead_id: ayaanLead.id,
      note: "Called parent — interested in morning batch trial",
      created_by: authIds.owner,
    },
    {
      academy_id: academy.id,
      lead_id: leads!.find((l) => l.name === "Diya Nair")!.id,
      note: "Sent batch timings on WhatsApp",
      created_by: authIds.staff,
    },
  ]);

  const presentToday = studentsData.length - 2;
  const qrToday = 4;
  const manualToday = 3;

  await admin.from("whatsapp_logs").insert([
    {
      academy_id: academy.id,
      student_id: studentIds[0],
      recipient: "9988776655",
      message_type: "receipt",
      body: `Receipt KCA-2026-0001 — ${fmt(FEES.cricketMonthly)} collected via UPI`,
      channel: "click_to_send",
      status: "manual_sent",
      triggered_by: authIds.owner,
    },
    {
      academy_id: academy.id,
      recipient: "9876512345",
      message_type: "trial_link",
      body: "Trial check-in link for Ayaan",
      channel: "click_to_send",
      status: "manual_sent",
      triggered_by: authIds.staff,
    },
  ]);

  await admin.from("whatsapp_templates").insert([
    {
      academy_id: academy.id,
      name: "Fee reminder",
      message_type: "fee_due",
      body: "Hello {parent_name}, fee of ₹{pending_amount} is due for {student_name}. — {academy_name}",
    },
    {
      academy_id: academy.id,
      name: "Receipt",
      message_type: "receipt",
      body: "Payment received for {student_name}. Receipt #{receipt_number}. Thank you! — {academy_name}",
    },
  ]);

  const digestBody = `Kohinoor Cricket Academy — ${todayStr}
Collected: ${fmt(DAY.collectedToday)} | Present: ${presentToday}/${studentsData.length}
QR check-ins: ${qrToday} | Manual: ${manualToday}
Overdue: ${fmt(DAY.overdueTotal)} (${DAY.overdueStudents} students)
New leads: ${DAY.leadsAwaitingFollowUp} | Trials attended: ${DAY.trialsToday}`;

  await admin.from("owner_digest_snapshots").insert({
    academy_id: academy.id,
    digest_date: todayStr,
    payload: {
      collected: DAY.collectedToday,
      present: presentToday,
      qrCheckIns: qrToday,
      manualCheckIns: manualToday,
      overdueAmount: DAY.overdueTotal,
      overdueStudents: DAY.overdueStudents,
      newLeads: DAY.leadsAwaitingFollowUp,
      trialsToday: DAY.trialsToday,
    },
    whatsapp_body: digestBody,
  });

  await admin.from("reminder_queue").insert([
    {
      academy_id: academy.id,
      reminder_type: "fee_overdue",
      recipient_mobile: "9988776644",
      recipient_name: "Priya Sharma",
      student_id: studentIds[1],
      whatsapp_body: `Fee reminder from Kohinoor Cricket Academy\n\nStudent: Priya Sharma\nPending: ${fmt(FEES.cricketMonthly)}\nDue: overdue\n\nPlease contact us to complete payment.`,
      due_date: todayStr,
    },
    {
      academy_id: academy.id,
      reminder_type: "fee_overdue",
      recipient_mobile: "9988776633",
      recipient_name: "Rohan Reddy",
      student_id: studentIds[2],
      whatsapp_body: `Fee reminder from Kohinoor Cricket Academy\n\nStudent: Rohan Reddy\nPending: ${fmt(FEES.cricketMonthly)}\nDue: overdue`,
      due_date: todayStr,
    },
    {
      academy_id: academy.id,
      reminder_type: "fee_overdue",
      recipient_mobile: "9988776611",
      recipient_name: "Vikram Singh",
      student_id: studentIds[4],
      whatsapp_body: `Fee reminder from Kohinoor Cricket Academy\n\nStudent: Vikram Singh\nPending: ${fmt(FEES.cricketMonthly)}\nDue: overdue`,
      due_date: todayStr,
    },
    {
      academy_id: academy.id,
      reminder_type: "fee_overdue",
      recipient_mobile: "9988776622",
      recipient_name: "Sneha Patel",
      student_id: studentIds[3],
      whatsapp_body: `Fee reminder from Kohinoor Cricket Academy\n\nStudent: Sneha Patel\nPending: ${fmt(FEES.partialBalance)}\nBalance remaining on July renewal`,
      due_date: todayStr,
    },
    {
      academy_id: academy.id,
      reminder_type: "birthday",
      recipient_mobile: "9988776600",
      recipient_name: "Kavya Iyer",
      student_id: studentIds[5],
      whatsapp_body: "Happy birthday Kavya from Kohinoor Cricket Academy! 🎂",
      due_date: todayStr,
    },
  ]);

  await admin.from("audit_logs").insert([
    {
      academy_id: academy.id,
      user_id: authIds.owner,
      action: "payment_collected",
      entity_type: "payment",
      new_value: { amount: FEES.cricketMonthly, receipt_number: "KCA-2026-0001" },
    },
    {
      academy_id: academy.id,
      user_id: authIds.owner,
      action: "settings_updated",
      entity_type: "academy_settings",
      entity_id: academy.id,
      new_value: { geofence_required: true },
    },
    {
      academy_id: academy.id,
      user_id: authIds.coach,
      action: "attendance_marked",
      entity_type: "attendance",
      new_value: { batch: "Morning Cricket U12", date: todayStr },
    },
  ]);

  await admin.from("import_logs").insert({
    academy_id: academy.id,
    user_id: authIds.owner,
    file_name: "kca-students-march.xlsx",
    entity_types: ["students", "batches"],
    success_count: 48,
    error_count: 2,
    errors: [{ row: 12, reason: "Duplicate mobile" }],
  });

  await admin.from("job_logs").insert({
    academy_id: academy.id,
    job_name: "send-owner-digest",
    success_count: 1,
    fail_count: 0,
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://sports-academia.vercel.app";

  console.log("✅ Hyderabad-aligned demo seed complete!\n");
  console.log("── Fee reference (Hyderabad market) ──");
  console.log(`   Cricket monthly:  ${fmt(FEES.cricketMonthly)}`);
  console.log(`   Quarterly:        ${fmt(FEES.cricketQuarterly)}`);
  console.log(`   8-session pack:   ${fmt(FEES.badminton8SessionPackage)}`);
  console.log(`   Summer camp:      ${fmt(FEES.summerCamp4WeekCricket)}`);
  console.log(`   Collected today:  ${fmt(DAY.collectedToday)}`);
  console.log("\n── Logins (password for all: Demo@123456) ──");
  for (const u of Object.values(USERS)) {
    console.log(`   ${u.role.padEnd(6)} ${u.email}`);
  }
  console.log("\n── Academy ──");
  console.log(`   Plan: Pro · Slug: ${SLUG}`);
  console.log(`   Public: /a/${SLUG}`);
  console.log(`   Enquire: /a/${SLUG}/enquire`);
  console.log("\n── QR & check-in (use at academy coords 17.4486, 78.3908) ──");
  console.log(`   Arjun QR:  ${appUrl}/a/${SLUG}/check-in/${demoQrTokens["KCA-0001"]}`);
  console.log(`   PIN: last 4 of 9988776655 → 6655`);
  console.log(`   Kiosk:     ${appUrl}/a/${SLUG}/kiosk/${batchByName["Morning Cricket U12"]!.id}`);
  console.log(`   Trial:     ${appUrl}/a/${SLUG}/trial/${trialToken}`);
  console.log("\n── Receipt verify ──");
  console.log(`   ${appUrl}/verify/receipt/demo_receipt_verify_0001 (${fmt(FEES.cricketMonthly)} · Arjun Kumar)`);
  console.log("\n── Flows to test ──");
  console.log("   Renewal dashboard · Fee plans · Collect + WhatsApp receipt");
  console.log("   Kavya sessions remaining · Manoj expired-but-attended");
  console.log("   Leads pipeline · Reminders queue · Reports export\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
