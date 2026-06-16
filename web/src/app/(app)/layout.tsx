import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAcademyContext();
  if (!ctx) redirect("/login");

  const academyName = ctx.academyUser.academies?.name ?? "Academy";

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar academyName={academyName} />
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-hairline-soft bg-canvas px-4 md:hidden">
          <div>
            <p className="text-xs text-muted">Sports Academy</p>
            <p className="text-sm font-semibold text-ink">{academyName}</p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
