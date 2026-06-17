"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { provisionAcademy } from "@/app/auth-actions";
import { slugifyAcademyName } from "@/lib/academy-slug";
import { AuthCard } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProvisionFallback() {
  const router = useRouter();
  const [academyName, setAcademyName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("academy_name", academyName);
      fd.set("slug", slug || slugifyAcademyName(academyName));
      fd.set("sport_name", "Cricket");
      await provisionAcademy(fd);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <h1 className="font-display text-2xl font-semibold text-ink">Finish academy setup</h1>
      <p className="mt-2 text-sm text-body">
        Your account is ready — add your academy details to continue.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Academy name</label>
          <Input
            value={academyName}
            onChange={(e) => {
              setAcademyName(e.target.value);
              setSlug(slugifyAcademyName(e.target.value));
            }}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Public URL</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1" />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create academy"}
        </Button>
      </form>
    </AuthCard>
  );
}
