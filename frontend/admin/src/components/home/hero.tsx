import { HeroSearch } from "@/components/home/hero-search";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&h=1500&fit=crop&q=85";

export function Hero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-ink sm:min-h-[640px] lg:min-h-[760px] xl:min-h-[820px]">
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

      {/* Dark at the very top (continues the navbar's bg-ink/85 seamlessly)
          and at the bottom (text legibility), with a lighter window through
          the middle so the photograph still reads as the hero, not just a
          dark panel. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/35 to-ink/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(17,17,17,0.5)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <p
          className="hero-reveal mb-4 text-[0.72rem] font-bold tracking-[0.22em] text-gold-secondary uppercase"
          style={{ animationDelay: "0ms" }}
        >
          {eyebrow}
        </p>
        <h1
          className="hero-reveal text-balance font-display text-4xl font-semibold text-white sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "120ms" }}
        >
          {title}
        </h1>
        <p
          className="hero-reveal mx-auto mt-6 max-w-2xl text-balance text-lg text-white/85"
          style={{ animationDelay: "260ms" }}
        >
          {subtitle}
        </p>
        <div className="hero-reveal mx-auto mt-10 max-w-2xl" style={{ animationDelay: "400ms" }}>
          <HeroSearch />
        </div>
      </div>

      {/* Scroll cue - purely decorative, hidden from small screens where
          space is already tight. */}
      <div className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex" aria-hidden="true">
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1.5">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-white/70" />
        </span>
      </div>
    </section>
  );
}
