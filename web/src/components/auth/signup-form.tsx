"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpAndProvisionAcademy, checkSlugAvailable } from "@/app/auth-actions";
import { slugifyAcademyName } from "@/lib/academy-slug";
import { TRIAL_DAYS } from "@/lib/subscription";
import { AuthCard } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SPORTS = ["Cricket", "Football", "Badminton", "Swimming", "Tennis", "Basketball"];

export function SignupForm() {
  const router = useRouter();
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [academyName, setAcademyName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [sport, setSport] = useState("Cricket");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "taken" | "invalid">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slugTouched && academyName) {
      setSlug(slugifyAcademyName(academyName));
    }
  }, [academyName, slugTouched]);

  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugStatus(slug ? "invalid" : "idle");
      return;
    }
    const timer = setTimeout(async () => {
      setSlugStatus("checking");
      const res = await checkSlugAvailable(slug);
      if (!res.available) {
        setSlugStatus(res.reason === "taken" ? "taken" : "invalid");
      } else {
        setSlugStatus("ok");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [slug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.set("email", email);
      fd.set("password", password);
      fd.set("owner_name", ownerName);
      fd.set("academy_name", academyName);
      fd.set("slug", slug);
      fd.set("sport_name", sport);
      await signUpAndProvisionAcademy(fd);

      router.push("/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <div className="text-center lg:text-left">
        <p className="text-sm font-medium uppercase tracking-wider text-brand">Get started</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Start your {TRIAL_DAYS}-day Pro trial
        </h1>
        <p className="mt-2 text-sm text-body">
          Create your academy, import your Excel, and go live — full Pro access for one week.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <label htmlFor="owner_name" className="text-sm font-medium text-ink">
            Your name
          </label>
          <Input
            id="owner_name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Ramesh Kumar"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="academy_name" className="text-sm font-medium text-ink">
            Academy name
          </label>
          <Input
            id="academy_name"
            value={academyName}
            onChange={(e) => setAcademyName(e.target.value)}
            placeholder="Kohinoor Cricket Academy"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-ink">
            Public URL
          </label>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted">/a/</span>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              }}
              required
            />
          </div>
          {slugStatus === "ok" && (
            <p className="text-xs text-success">URL available</p>
          )}
          {slugStatus === "taken" && (
            <p className="text-xs text-error">This URL is already taken</p>
          )}
          {slugStatus === "invalid" && slug.length > 0 && (
            <p className="text-xs text-error">Use at least 3 characters (a-z, 0-9, hyphens)</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="sport" className="text-sm font-medium text-ink">
            Primary sport
          </label>
          <select
            id="sport"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="flex h-10 w-full rounded-md border border-hairline bg-canvas px-3 text-sm"
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <p className="text-xs text-muted">At least 8 characters</p>
        </div>

        {error && (
          <p className="rounded-lg bg-error-soft px-3 py-2.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || slugStatus === "taken" || slugStatus === "invalid"}
        >
          {loading ? "Creating academy…" : `Start ${TRIAL_DAYS}-day Pro trial`}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted lg:text-left">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
