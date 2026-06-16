"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createStudent } from "@/app/actions";

export function AddStudentForm({
  sports,
  batches,
}: {
  sports: { id: string; name: string }[];
  batches: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createStudent(fd);
    setOpen(false);
    window.location.reload();
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        + Add student
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-3 rounded-lg border border-hairline bg-surface-card p-4 sm:max-w-md"
    >
      <Input name="name" placeholder="Student name" required />
      <Input name="parent_name" placeholder="Parent name" required />
      <Input name="mobile" placeholder="Mobile" required />
      <Input name="whatsapp" placeholder="WhatsApp (optional)" />
      <select name="sport_id" className="h-11 w-full rounded-md border border-hairline px-3 text-sm">
        <option value="">Sport</option>
        {sports.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <select name="batch_id" className="h-11 w-full rounded-md border border-hairline px-3 text-sm">
        <option value="">Batch</option>
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
