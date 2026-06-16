import { landingConfig } from "@/lib/landing-config";

export function SportMarquee() {
  const items = [...landingConfig.sports, ...landingConfig.sports];

  return (
    <section className="overflow-hidden border-b border-hairline bg-canvas py-4">
      <div className="sport-marquee flex w-max gap-8 px-4">
        {items.map((sport, i) => (
          <span
            key={`${sport}-${i}`}
            className="flex shrink-0 items-center gap-4 whitespace-nowrap text-sm font-medium text-muted"
          >
            {sport}
            <span className="text-brand">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
