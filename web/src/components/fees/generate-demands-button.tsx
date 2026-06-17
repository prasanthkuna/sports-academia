"use client";

import { useState } from "react";
import { generateRecurringDemands } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function GenerateDemandsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  async function onClick() {
    setLoading(true);
    try {
      const { created } = await generateRecurringDemands();
      setResult(created);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={onClick} disabled={loading}>
      {loading ? "Generating…" : result != null ? `Created ${result}` : "Generate demands"}
    </Button>
  );
}
