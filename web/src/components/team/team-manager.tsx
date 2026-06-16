"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createCoach } from "@/app/actions";
import type { AcademyPlan } from "@/lib/plans";
import { rel } from "@/lib/utils";

export function TeamManager({
  coaches,
  users,
  plan,
}: {
  coaches: { id: string; name: string; mobile: string | null; email: string | null }[];
  users: {
    id: string;
    role: string;
    display_name: string | null;
    coach_id: string | null;
    coaches: { name: string } | { name: string }[] | null;
  }[];
  plan: AcademyPlan;
}) {
  const [error, setError] = useState<string | null>(null);

  async function addCoach(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await createCoach(new FormData(e.currentTarget));
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold text-ink">Coaches</h2>
        <ul className="mt-3 space-y-2">
          {coaches.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md bg-surface-soft px-3 py-2 text-sm">
              <span className="font-medium">{c.name}</span>
              <span className="text-muted">{c.mobile ?? c.email ?? "—"}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={addCoach} className="mt-4 grid gap-2 sm:grid-cols-3">
          <Input name="name" placeholder="Coach name" required />
          <Input name="mobile" placeholder="Mobile" />
          <Input name="email" placeholder="Email" type="email" />
          <Button type="submit" className="sm:col-span-3 sm:w-fit">
            Add coach
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-ink">Logins</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {users.map((u) => (
            <li key={u.id} className="rounded-md border border-hairline-soft px-3 py-2">
              <span className="font-medium capitalize">{u.role}</span>
              {" · "}
              {u.display_name ?? rel(u.coaches)?.name ?? "User"}
            </li>
          ))}
        </ul>
        {plan !== "pro" && (
          <p className="mt-3 text-sm text-muted">Coach logins require Pro plan.</p>
        )}
      </Card>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
