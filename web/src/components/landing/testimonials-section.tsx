import { AssetImage } from "@/components/landing/asset-image";
import { assets } from "@/lib/assets";

const testimonials = [
  {
    quote:
      "We stopped losing fee follow-ups. Collect on the ground, receipt goes to WhatsApp — parents trust us more.",
    name: "Ramesh K.",
    role: "Owner, Kohinoor Cricket Academy",
    initials: "RK",
    image: assets.testimonials.owner1,
  },
  {
    quote:
      "Attendance used to be a notebook nightmare. Now my coach marks it before the next batch walks in.",
    name: "Anita S.",
    role: "Director, Velocity Football Club",
    initials: "AS",
    image: assets.testimonials.owner2,
  },
  {
    quote:
      "The public enquiry page alone brought us 12 leads last month. Parents find us and we call back same day.",
    name: "Vikram P.",
    role: "Head Coach, Smash Badminton",
    initials: "VP",
    image: assets.testimonials.owner3,
  },
];

function Avatar({ name, initials, image }: { name: string; initials: string; image: string }) {
  return (
    <AssetImage
      src={image}
      alt={name}
      width={48}
      height={48}
      className="h-12 w-12 rounded-full object-cover"
      fallback={
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
          {initials}
        </div>
      }
    />
  );
}

export function TestimonialsSection() {
  return (
    <section className="border-y border-hairline bg-surface-soft py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Trusted by academy owners
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="flex flex-col rounded-xl border border-hairline bg-canvas p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-body">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-6 flex items-center gap-3">
                <Avatar name={item.name} initials={item.initials} image={item.image} />
                <div>
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
