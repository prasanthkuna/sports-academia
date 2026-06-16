import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

type AcademyCtaBarProps = {
  slug: string;
  whatsappNumber?: string | null;
  contactNumber?: string | null;
};

export function AcademyCtaBar({ slug, whatsappNumber, contactNumber }: AcademyCtaBarProps) {
  const waDigits = whatsappNumber?.replace(/\D/g, "");

  return (
    <section className="border-b border-hairline bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/a/${slug}/enquire`}
            className="rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-active"
          >
            Enquire now
          </Link>
          {waDigits && (
            <a
              href={`https://wa.me/91${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1da851]"
            >
              WhatsApp us
            </a>
          )}
        </div>
        {contactNumber && (
          <a
            href={`tel:+91${contactNumber.replace(/\D/g, "")}`}
            className="flex items-center gap-2 text-sm text-body hover:text-ink"
          >
            <Phone className="h-4 w-4" />
            {contactNumber}
          </a>
        )}
      </div>
    </section>
  );
}

type AcademyInfoProps = {
  address?: string | null;
  batches?: { name: string; schedule?: string | null }[];
};

export function AcademyInfo({ address, batches }: AcademyInfoProps) {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">About the academy</h2>
          <p className="mt-4 leading-relaxed text-body">
            Professional coaching, structured batches, and a focus on discipline and skill
            development. Enquire below and our team will call you back with batch timings and fee
            details.
          </p>
          {address && (
            <p className="mt-6 flex items-start gap-2 text-sm text-body">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {address}
            </p>
          )}
        </div>
        {batches && batches.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Training batches</h2>
            <ul className="mt-4 divide-y divide-hairline rounded-xl border border-hairline">
              {batches.slice(0, 6).map((batch) => (
                <li key={batch.name} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-ink">{batch.name}</span>
                  {batch.schedule && (
                    <span className="text-xs text-muted">{batch.schedule}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function AcademyFooter({ name }: { name: string }) {
  return (
    <footer className="bg-[#101010] px-4 py-12 text-center text-sm text-[#a1a1aa]">
      <p className="font-display text-white">{name}</p>
      <p className="mt-2">Powered by Academy Ops</p>
    </footer>
  );
}
