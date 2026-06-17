import { createAdminClient } from "@/lib/supabase/admin";
import type { AcademyPlan } from "@/lib/plans";

export async function activateAcademySubscription(academyId: string, plan: AcademyPlan) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("academies")
    .update({
      subscription_status: "active",
      plan,
      trial_ends_at: null,
    })
    .eq("id", academyId);

  if (error) throw error;
}

export async function markBillingOrderPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string,
) {
  const admin = createAdminClient();
  const { data: order, error: findErr } = await admin
    .from("academy_billing_orders")
    .select("id, academy_id, plan, status")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (findErr) throw findErr;
  if (!order) return { ok: false as const, reason: "order_not_found" as const };
  if (order.status === "paid") {
    return { ok: true as const, alreadyPaid: true as const, academyId: order.academy_id, plan: order.plan };
  }

  const { error: updateErr } = await admin
    .from("academy_billing_orders")
    .update({
      status: "paid",
      razorpay_payment_id: razorpayPaymentId,
      paid_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateErr) throw updateErr;

  await activateAcademySubscription(order.academy_id, order.plan as AcademyPlan);

  return {
    ok: true as const,
    alreadyPaid: false as const,
    academyId: order.academy_id,
    plan: order.plan as AcademyPlan,
  };
}
