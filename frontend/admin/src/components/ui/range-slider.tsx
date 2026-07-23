"use client";

import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";

export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  variant = "default",
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue: (value: number) => string;
  /** "onDark" - for use over a fixed dark backdrop (e.g. the home hero's
   * image overlay) that doesn't follow the site's light/dark theme toggle,
   * same reason hero-search.tsx's own labels hardcode text-white instead of
   * the theme-aware text-text tokens. */
  variant?: "default" | "onDark";
}) {
  const isOnDark = variant === "onDark";

  return (
    <div className={clsx("flex flex-col", isOnDark ? "gap-2" : "gap-3")}>
      <span
        className={clsx(
          isOnDark
            ? "text-[0.72rem] font-extrabold tracking-[0.04em] text-white/70"
            : "text-sm font-bold text-text",
        )}
      >
        {label}
      </span>
      <Slider.Root
        className="relative flex h-5 w-full touch-none items-center"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next) => onChange([next[0], next[1]])}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track
          className={clsx(
            "relative h-1.5 grow rounded-full",
            isOnDark ? "bg-white/25" : "bg-border-strong",
          )}
        >
          <Slider.Range className="absolute h-full rounded-full bg-gold-primary" />
        </Slider.Track>
        <Slider.Thumb
          className={clsx(
            "block h-[18px] w-[18px] rounded-full border-2 border-gold-primary shadow-sm transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold-primary/40 focus-visible:outline-none",
            isOnDark ? "bg-white" : "bg-surface",
          )}
          aria-label={`${label} min`}
        />
        <Slider.Thumb
          className={clsx(
            "block h-[18px] w-[18px] rounded-full border-2 border-gold-primary shadow-sm transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold-primary/40 focus-visible:outline-none",
            isOnDark ? "bg-white" : "bg-surface",
          )}
          aria-label={`${label} max`}
        />
      </Slider.Root>
      <div
        className={clsx(
          "flex justify-between text-[0.8rem]",
          isOnDark ? "font-extrabold text-white/70" : "font-semibold text-text-muted",
        )}
      >
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
    </div>
  );
}
