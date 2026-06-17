import { Bricolage_Grotesque } from "next/font/google";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AcademyHero } from "@/components/landing/academy/academy-hero";
import {
  AcademyCtaBar,
  AcademyFooter,
  AcademyInfo,
} from "@/components/landing/academy/academy-sections";
import { assets } from "@/lib/assets";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: academy } = await supabase
    .from("academies")
    .select("name")
    .eq("slug", slug)
    .single();

  if (!academy) return { title: "Academy not found" };

  return {
    title: `${academy.name} — Enquire & join`,
    description: `Training, batches, and enquiries at ${academy.name}. Contact us on WhatsApp or submit an enquiry form.`,
    openGraph: {
      title: academy.name,
      description: "Sports academy — enquire for batch timings and fees",
      images: [{ url: assets.og.academy, width: 1200, height: 630 }],
    },
  };
}

export default async function PublicAcademyPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: academy } = await supabase
    .from("academies")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!academy) notFound();

  const [{ data: settings }, { data: batches }] = await Promise.all([
    supabase
      .from("academy_settings")
      .select("address, contact_number, whatsapp_number, brand_color, logo_url")
      .eq("academy_id", academy.id)
      .single(),
    supabase
      .from("batches")
      .select("name, session_type, start_time, end_time")
      .eq("academy_id", academy.id)
      .eq("is_active", true)
      .order("name"),
  ]);

  const brandStyle = settings?.brand_color
    ? ({ "--academy-brand": settings.brand_color } as React.CSSProperties)
    : undefined;

  return (
    <div className={`${display.variable} min-h-screen bg-canvas font-sans`} style={brandStyle}>
      <AcademyHero
        name={academy.name}
        tagline="Structured coaching · Professional batches · Trial welcome"
      />
      <AcademyCtaBar
        slug={slug}
        whatsappNumber={settings?.whatsapp_number}
        contactNumber={settings?.contact_number}
      />
      <AcademyInfo
        address={settings?.address}
        batches={batches?.map((b) => ({
          name: b.name,
          schedule:
            b.start_time && b.end_time
              ? `${b.session_type} · ${b.start_time.slice(0, 5)}–${b.end_time.slice(0, 5)}`
              : b.session_type,
        }))}
      />
      <AcademyFooter name={academy.name} />
    </div>
  );
}
