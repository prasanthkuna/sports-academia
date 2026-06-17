"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { activationTotalInr } from "@/lib/billing/pricing";
import type { AcademyPlan } from "@/lib/plans";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type CheckoutPrefill = { email: string; name: string };

function loadRazorpayScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({
  plan,
  academyName,
  razorpayEnabled,
}: {
  plan: AcademyPlan;
  academyName: string;
  razorpayEnabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = useCallback(async () => {
    if (!razorpayEnabled) return;
    setLoading(true);
    setError(null);

    try {
      await loadRazorpayScript();

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as {
        error?: string;
        orderId?: string;
        amount?: number;
        keyId?: string;
        description?: string;
        prefill?: CheckoutPrefill;
      };

      if (!res.ok || !data.orderId || !data.keyId || !data.amount) {
        throw new Error(data.error ?? "Could not start checkout");
      }

      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error("Razorpay unavailable");

      const rzp = new Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Academy Ops",
        description: data.description,
        order_id: data.orderId,
        prefill: data.prefill,
        theme: { color: "#0F766E" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = (await verifyRes.json()) as { error?: string };
          if (!verifyRes.ok) {
            setError(verifyData.error ?? "Payment verification failed");
            return;
          }
          router.push(`/upgrade/success?plan=${plan}`);
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }, [plan, razorpayEnabled, router]);

  const planName = plan === "pro" ? "Pro" : "Starter";
  const total = activationTotalInr(plan);

  return (
    <div>
      <Button
        type="button"
        className="w-full"
        disabled={loading || !razorpayEnabled}
        onClick={pay}
      >
        {loading
          ? "Opening checkout…"
          : `Pay ₹${total.toLocaleString("en-IN")} — ${planName} (setup + month 1)`}
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
      {!razorpayEnabled && (
        <p className="mt-2 text-xs text-muted">Online payment is not configured yet.</p>
      )}
    </div>
  );
}
