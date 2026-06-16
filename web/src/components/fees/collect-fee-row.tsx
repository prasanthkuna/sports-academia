"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collectPayment } from "@/app/actions";

export function CollectFeeRow({
  fee,
}: {
  fee: { id: string; pending_amount: number };
}) {
  const [open, setOpen] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await collectPayment(new FormData(e.currentTarget));
    setOpen(false);
    window.location.reload();
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
