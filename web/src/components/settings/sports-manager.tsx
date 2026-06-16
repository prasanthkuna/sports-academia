"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSport } from "@/app/actions";
import type { AcademyPlan } from "@/lib/plans";

export function SportsManager({
  sports,
  plan,
}: {
  sports: { id: string; name: string }[];
  plan: AcademyPlan;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function add() {
    setError(null);
    try {
      await createSport(name);
      setName("");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div>
      <h2 className="font-semibold text-ink">Sports</h2>
      <p className="text-sm text-muted">
        {plan === "starter" ? "Starter: 1 sport max" : "Pro: unlimited sports"}
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {sports.map((s) => (
          <li key={s.id} className="rounded-md bg-surface-soft px-3 py-2">
            {s.name}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New sport" />
        <Button type="button" onClick={add} disabled={!name.trim()}>
          Add
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
