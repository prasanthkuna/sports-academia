"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-shell";
import { landingConfig } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

const { demo } = landingConfig;

type DemoRole = (typeof demo.logins)[number]["role"];

function resolveLogin(roleParam: string | null) {
  const match = demo.logins.find((l) => l.role.toLowerCase() === roleParam?.toLowerCase());
  return match ?? demo.logins.find((l) => l.role === "Owner") ?? demo.logins[0]!;
}

export function LoginForm({ defaultRoleKey }: { defaultRoleKey: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = resolveLogin(defaultRoleKey);

  const [email, setEmail] = useState<string>(initial.email);
  const [password, setPassword] = useState<string>(demo.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<DemoRole>(initial.role);

  function selectRole(role: DemoRole, roleEmail: string) {
    setActiveRole(role);
    setEmail(roleEmail);
    setPassword(demo.password);
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/dashboard");
    router.refresh();
  }

  return (
    <AuthCard>
      <div className="text-center lg:text-left">
        <p className="text-sm font-medium uppercase tracking-wider text-brand">Sign in</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Academy dashboard
        </h1>
        <p className="mt-2 text-sm text-body">
          Renewals, fees, attendance, and receipts — one login for your academy team.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-ink">Try demo as</span>
          <div className="grid grid-cols-2 gap-2">
            {demo.logins.map((login) => (
              <button
                key={login.email}
                type="button"
                onClick={() => selectRole(login.role, login.email)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  activeRole === login.role
                    ? "border-brand bg-brand-soft text-ink"
                    : "border-hairline bg-canvas text-body hover:border-brand/30 hover:bg-surface-soft",
                )}
              >
                <span className="block text-xs font-medium text-muted">{login.role}</span>
                <span className="mt-0.5 block truncate text-xs text-ink">{login.email}</span>
              </button>
            ))}
          </div>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-lg bg-error-soft px-3 py-2.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted lg:text-left">
        Demo password for all roles:{" "}
        <code className="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-ink">{demo.password}</code>
      </p>
      <p className="mt-4 text-center text-sm text-muted lg:text-left">
        New academy?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Start free trial
        </Link>
      </p>
    </AuthCard>
  );
}
