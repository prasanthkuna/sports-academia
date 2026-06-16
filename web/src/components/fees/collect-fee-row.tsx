"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collectPayment, logWhatsApp } from "@/app/actions";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { receiptMessage, reviewBoosterMessage } from "@/lib/whatsapp-messages";
import { rel } from "@/lib/utils";

export function CollectFeeRow({
  fee,
  academyName,
  reviewLink,
}: {
  fee: {
    id: string;
    pending_amount: number;
    students?: { name: string; mobile: string; whatsapp: string | null } | { name: string; mobile: string; whatsapp: string | null }[] | null;
    fee_types?: { name: string } | { name: string }[] | null;
  };
  academyName: string;
  reviewLink: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<{ receipt_number: string; verify_token?: string } | null>(null);

  const student = rel(fee.students);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(new FormData(e.currentTarget).get("amount"));
    const res = await collectPayment(new FormData(e.currentTarget));
    setReceipt(res);
    setOpen(false);

    if (student) {
      const body = receiptMessage({
        academyName,
        studentName: student.name,
        amount,
        receiptNumber: res.receipt_number,
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      await logWhatsApp(null, student.whatsapp || student.mobile, "receipt", body);
    }
  }

  if (receipt && student) {
    const body = receiptMessage({
      academyName,
      studentName: student.name,
      amount: Number(fee.pending_amount),
      receiptNumber: receipt.receipt_number,
      paymentDate: new Date().toISOString().slice(0, 10),
    });
    return (
      <div className="flex flex-wrap gap-2">
        <WhatsAppButton phone={student.whatsapp || student.mobile} message={body} label="Send receipt" />
        {reviewLink && (
          <WhatsAppButton
            phone={student.whatsapp || student.mobile}
            message={reviewBoosterMessage({ academyName, reviewLink })}
            label="Review ask"
          />
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Collect
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="fee_id" value={fee.id} />
      <Input
        name="amount"
        type="number"
        defaultValue={fee.pending_amount}
        max={fee.pending_amount}
        className="w-28 font-mono-amount"
        required
      />
      <select name="payment_mode" className="h-11 rounded-md border border-hairline px-2 text-sm" defaultValue="upi">
        <option value="upi">UPI</option>
        <option value="cash">Cash</option>
      </select>
      <Button type="submit">Pay</Button>
      <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
        ×
      </Button>
    </form>
  );
}
