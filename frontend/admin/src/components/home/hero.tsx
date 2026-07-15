import { HeroSearch } from "@/components/home/hero-search";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1500&fit=crop&q=85";

export function Hero({
  eyebrow,
  titleBefore,
  titleAccent,
  titleAfter,
  subtitle,
}: {
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  subtitle: string;
}) {
  return (
    <section className="relative isolate flex min-h-[560px] flex-col overflow-hidden bg-ink sm:min-h-[640px] lg:min-h-[760px] xl:min-h-[820px]">
      {/* Background photograph - slow one-way zoom for a cinematic,
          unobtrusive sense of motion (holds at the zoomed frame, no loop). */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- external hero photograph, no local optimization pipeline for it */}
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover animate-hero-zoom"
        />
      </div>

      {/* Dark at the top and bottom for text legibility (the navbar itself
          is fixed-light chrome sitting above this, unrelated to this
          gradient), with a lighter window through the middle so the
          photograph still reads as the hero, not just a dark panel. Side
          vignettes add editorial depth/framing. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/35 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-ink/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-ink)_100%)] opacity-50" />

      {/* Text block centers in the space above the search bar, rather than
          the whole hero content being one vertically-centered group - the
          search bar is anchored near the bottom edge instead (matches the
          reference layout: headline upper/middle, search bar pinned low). */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center sm:px-6 lg:px-8">
        <p
          className="hero-reveal mb-5 flex items-center justify-center gap-3 text-[0.72rem] font-bold tracking-[0.28em] text-gold-secondary uppercase"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-px w-8 bg-gold-secondary/60" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-gold-secondary/60" aria-hidden="true" />
        </p>
        <h1
          className="hero-reveal text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "120ms" }}
        >
          {titleBefore} <span className="text-gold-secondary">{titleAccent}</span> {titleAfter}
        </h1>
        <p
          className="hero-reveal mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/85"
          style={{ animationDelay: "260ms" }}
        >
          {subtitle}
        </p>
      </div>

      <div className="relative z-10 w-full px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        <div className="hero-reveal mx-auto max-w-4xl" style={{ animationDelay: "400ms" }}>
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
