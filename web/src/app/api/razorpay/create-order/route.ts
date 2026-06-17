import { NextResponse } from "next/server";
import { getAcademyContext } from "@/lib/auth";
import { activationLabel, activationTotalPaise } from "@/lib/billing/pricing";
import { createActivationOrder, isRazorpayConfigured, getRazorpayKeyId } from "@/lib/billing/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { canManageTeam } from "@/lib/permissions";
import type { AcademyPlan } from "@/lib/plans";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
  }

  const ctx = await getAcademyContext();
  if (!ctx || !canManageTeam(ctx.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { plan?: string };
  const plan = body.plan as AcademyPlan;
  if (plan !== "starter" && plan !== "pro") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (ctx.subscriptionStatus === "active" && !ctx.subscriptionExpired) {
    return NextResponse.json({ error: "Subscription already active" }, { status: 400 });
  }

  const receipt = `act_${ctx.academyId.replace(/-/g, "").slice(0, 12)}_${Date.now()}`;

  try {
    const { order } = await createActivationOrder({
      academyId: ctx.academyId,
      academySlug: ctx.academySlug,
      plan,
      receipt,
    });

    const admin = createAdminClient();
    const { error: insertErr } = await admin.from("academy_billing_orders").insert({
      academy_id: ctx.academyId,
      plan,
      amount_paise: activationTotalPaise(plan),
      razorpay_order_id: order.id,
      status: "created",
    });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      description: activationLabel(plan),
      academyName: ctx.academyUser.academies.name,
      prefill: {
        email: ctx.user.email ?? "",
        name: ctx.academyUser.display_name ?? ctx.academyUser.academies.name,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
