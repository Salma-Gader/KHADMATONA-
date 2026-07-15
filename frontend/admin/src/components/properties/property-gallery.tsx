"use client";

import { useState } from "react";
import type { PropertyImage } from "@/types/property";

export function PropertyGallery({
  images,
  title,
  noImageLabel,
}: {
  images: PropertyImage[];
  title: string;
  noImageLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-md bg-surface-muted">
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
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((image, index) => {
            const isActive = image.id === active?.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${title} ${index + 1}`}
                aria-current={isActive}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
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
