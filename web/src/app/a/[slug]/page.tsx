import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicAcademyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: academy } = await supabase
    .from("academies")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!academy) notFound();

  const { data: settings } = await supabase
    .from("academy_settings")
    .select("address, contact_number, whatsapp_number")
    .eq("academy_id", academy.id)
    .single();

  return (
    <main className="min-h-screen bg-canvas">
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{academy.name}</h1>
        <p className="mt-2 text-muted">Sports training · Hyderabad</p>
        {settings?.address && <p className="mt-4 text-sm text-body">{settings.address}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/a/${slug}/enquire`}
            className="rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Enquire now
          </Link>
          {settings?.whatsapp_number && (
            <a
              href={`https://wa.me/91${settings.whatsapp_number.replace(/\D/g, "")}`}
              className="rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
          )}
        </div>
      </section>
      <footer className="bg-[#101010] px-4 py-12 text-center text-sm text-[#a1a1aa]">
        {academy.name} · Powered by Sports Academy Ops
      </footer>
    </main>
  );
}
