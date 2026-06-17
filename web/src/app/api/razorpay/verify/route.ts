import { NextResponse } from "next/server";
import { getAcademyContext } from "@/lib/auth";
import { markBillingOrderPaid } from "@/lib/billing/activate-subscription";
import { verifyCheckoutSignature } from "@/lib/billing/razorpay";
import { canManageTeam } from "@/lib/permissions";

export async function POST(request: Request) {
  const ctx = await getAcademyContext();
  if (!ctx || !canManageTeam(ctx.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  if (!verifyCheckoutSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  try {
    const result = await markBillingOrderPaid(razorpay_order_id, razorpay_payment_id);
    if (!result.ok) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (result.academyId !== ctx.academyId) {
      return NextResponse.json({ error: "Order does not match academy" }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      plan: result.plan,
      alreadyPaid: result.alreadyPaid,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
