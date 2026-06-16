import { AssetImage } from "@/components/landing/asset-image";
import { assets } from "@/lib/assets";

type AcademyHeroProps = {
  name: string;
  tagline?: string;
  heroImage?: string;
};

export function AcademyHero({ name, tagline, heroImage }: AcademyHeroProps) {
  const imageSrc = heroImage ?? assets.academy.heroCricket;

  return (
    <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px]">
      <div className="absolute inset-0">
        <AssetImage
          src={imageSrc}
          alt=""
          width={1600}
          height={900}
          priority
          className="h-full w-full object-cover"
          fallback={
            <div className="h-full w-full bg-gradient-to-br from-brand via-brand/80 to-ink" />
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14 pt-32 sm:px-6 sm:pb-16">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-soft">
          Sports Academy
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {name}
        </h1>
        {tagline && (
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">{tagline}</p>
        )}
      </div>
    </section>
  );
}
