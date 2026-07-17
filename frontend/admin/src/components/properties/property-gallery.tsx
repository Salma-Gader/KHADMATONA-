"use client";

import { useEffect, useRef, useState } from "react";
import type { PropertyImage } from "@/types/property";

// Points toward the start (left in LTR) of the reading direction, and
// mirrors for RTL along with the button's own logical start-2/end-2
// position - a left-pointing "previous" glyph flips to point right once
// the button itself has moved to the physical right edge in RTL.
function ChevronStartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronEndIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PropertyGallery({
  images,
  title,
  noImageLabel,
  previousImageLabel,
  nextImageLabel,
}: {
  images: PropertyImage[];
  title: string;
  noImageLabel: string;
  previousImageLabel: string;
  nextImageLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  function goTo(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  return (
    <div>
      <div className="group relative aspect-video overflow-hidden rounded-md bg-surface-muted">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element -- media-library-served image
          <img
            src={active.url}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            {noImageLabel}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label={previousImageLabel}
              className="absolute start-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-ink/70 focus-visible:opacity-100"
            >
              <ChevronStartIcon />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label={nextImageLabel}
              className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-ink/70 focus-visible:opacity-100"
            >
              <ChevronEndIcon />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1">
          {images.map((image, index) => {
            const isActive = image.id === active?.id;

            return (
              <button
                key={image.id}
                ref={(el) => {
                  thumbRefs.current[index] = el;
                }}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`${title} ${index + 1}`}
                aria-current={isActive}
                className={`h-16 w-16 shrink-0 snap-start overflow-hidden rounded-md border-2 transition-colors ${
                  isActive
                    ? "border-gold-primary"
                    : "border-transparent opacity-80 hover:border-border hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- media-library-served thumbnail */}
                <img src={image.url} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
