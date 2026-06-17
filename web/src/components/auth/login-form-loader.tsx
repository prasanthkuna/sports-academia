"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

function LoginFormFallback() {
  return (
    <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm">
      <div className="h-8 w-40 animate-pulse rounded bg-surface-soft" />
      <div className="mt-6 h-48 animate-pulse rounded-lg bg-surface-soft" />
    </div>
  );
}

function LoginFormWithParams() {
  const searchParams = useSearchParams();
  const roleKey = searchParams.get("role") ?? "owner";
  return <LoginForm key={roleKey} defaultRoleKey={roleKey} />;
}

export function LoginFormLoader() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormWithParams />
    </Suspense>
  );
}
