"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collectPayment } from "@/app/actions";
import { formatCurrency } from "@/lib/utils";

type Fee = {
  id: string;
  pending_amount: number;
  fee_types: { name: string } | null;
};

export function CollectFeeButton({
  studentId,
  fees,
}: {
  studentId: string;
  fees: Fee[];
}) {
  const [open, setOpen] = useState(false);
  const pending = fees.filter((f) => Number(f.pending_amount) > 0);

  if (pending.length === 0) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await collectPayment(fd);
    setOpen(false);
    window.location.reload();
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Collect fee
      </Button>
    );
  }

  const first = pending[0];

  return (
    <form
      onSubmit={onSubmit}
      className="fixed inset-x-4 bottom-24 z-50 rounded-xl border border-hairline bg-canvas p-4 shadow-lg md:static md:max-w-sm"
    >
      <input type="hidden" name="fee_id" value={first.id} />
      <p className="mb-2 text-sm font-semibold text-ink">
        {first.fee_types?.name} — pending {formatCurrency(Number(first.pending_amount))}
      </p>
      <Input
        name="amount"
        type="number"
        min={1}
        max={first.pending_amount}
        defaultValue={first.pending_amount}
        required
        className="mb-2 font-mono-amount text-lg"
      />
      <select name="payment_mode" className="mb-3 h-11 w-full rounded-md border border-hairline px-3 text-sm" defaultValue="upi">
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
        <option value="bank_transfer">Bank transfer</option>
        <option value="cheque">Cheque</option>
        <option value="other">Other</option>
      </select>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Collect & receipt
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
