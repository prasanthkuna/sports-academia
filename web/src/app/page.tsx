import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold text-ink">Sports Academy Ops</h1>
      <p className="text-muted">Fee recovery · Attendance · WhatsApp</p>
      <Link
        href="/login"
        className="rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white"
      >
        Sign in
      </Link>
    </main>
  );
}
