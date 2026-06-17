import crypto from "crypto";
import Razorpay from "razorpay";
import type { AcademyPlan } from "@/lib/plans";
import { activationLabel, activationTotalPaise } from "@/lib/billing/pricing";

export function getRazorpayKeyId() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("RAZORPAY_KEY_ID is not configured");
  return keyId;
}

export function getRazorpaySecret() {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not configured");
  return secret;
}

export function getRazorpayClient() {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpaySecret(),
  });
}

export function verifyCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  const expected = crypto
    .createHmac("sha256", getRazorpaySecret())
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export function verifyWebhookSignature(body: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured");
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export async function createActivationOrder(opts: {
  academyId: string;
  academySlug: string;
  plan: AcademyPlan;
  receipt: string;
}) {
  const razorpay = getRazorpayClient();
  const amount = activationTotalPaise(opts.plan);

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: opts.receipt,
    notes: {
      academy_id: opts.academyId,
      academy_slug: opts.academySlug,
      plan: opts.plan,
      billing_type: "activation",
    },
  });

  return { order, amount };
}

export function isRazorpayConfigured() {
  try {
    getRazorpayKeyId();
    getRazorpaySecret();
    return true;
  } catch {
    return false;
  }
}

export { activationLabel };
