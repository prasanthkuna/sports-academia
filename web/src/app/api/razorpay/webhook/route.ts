import { NextResponse } from "next/server";
import { markBillingOrderPaid } from "@/lib/billing/activate-subscription";
import { verifyWebhookSignature } from "@/lib/billing/razorpay";

type RazorpayWebhookPayload = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
        status?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  try {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  let event: RazorpayWebhookPayload;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id ?? event.payload?.order?.entity?.id;
    const paymentId = payment?.id;

    if (orderId && paymentId) {
      try {
        await markBillingOrderPaid(orderId, paymentId);
      } catch (err) {
        console.error("Razorpay webhook activation failed:", err);
        return NextResponse.json({ error: "Activation failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
