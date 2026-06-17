"use client";

import Link from "next/link";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AnimateOnScroll, MotionCard } from "@/components/landing/motion/animate-on-scroll";
import { landingConfig } from "@/lib/landing-config";
import { cn } from "@/lib/utils";

export function DemoPlaygroundSection() {
  const { demo } = landingConfig;
  const [copied, setCopied] = useState<string | null>(null);

  async function copyText(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section id="demo" className="border-b border-hairline py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-brand">Live demo</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Try it in 60 seconds
          </h2>
          <p className="mt-4 text-body">
            Log in as owner for the renewal dashboard, or staff for fee plans and collection. Verify
            receipts and try live QR flows — all with real demo data.
          </p>
        </AnimateOnScroll>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <MotionCard className="rounded-2xl border border-hairline bg-surface-soft p-6">
            <h3 className="font-display font-semibold text-ink">Demo logins</h3>
            <p className="mt-1 text-sm text-muted">
              Password for all: <code className="rounded bg-canvas px-1.5 py-0.5 text-ink">{demo.password}</code>
            </p>
            <ul className="mt-4 space-y-2">
              {demo.logins.map((login) => (
                <li
                  key={login.email}
                  className="flex items-center justify-between rounded-lg border border-hairline bg-canvas px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-medium text-muted">{login.role}</p>
                    <p className="text-sm text-ink">{login.email}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Copy ${login.email}`}
                    onClick={() => copyText(login.email, login.email)}
                    className="rounded-md p-1.5 text-muted hover:bg-surface-soft hover:text-ink"
                  >
                    {copied === login.email ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-ink py-2.5 text-sm font-semibold text-white hover:bg-ink-active"
            >
              Open login
            </Link>
          </MotionCard>

          <MotionCard delay={0.1} className="rounded-2xl border border-brand/30 bg-brand-soft/20 p-6">
            <h3 className="font-display font-semibold text-ink">Try live flows</h3>
            <p className="mt-1 text-sm text-muted">No login required for public check-in and verify URLs.</p>
            <ul className="mt-4 space-y-2">
              {demo.tryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg border border-hairline bg-canvas px-3 py-2.5",
                      "transition-colors hover:border-brand/40 hover:bg-brand-soft/30",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{link.label}</p>
                      {link.hint ? (
                        <p className="text-xs text-muted">{link.hint}</p>
                      ) : null}
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          </MotionCard>
        </div>
      </div>
    </section>
  );
}
