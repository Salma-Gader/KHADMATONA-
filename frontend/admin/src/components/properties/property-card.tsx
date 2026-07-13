import Link from "next/link";
import { useTranslations } from "next-intl";
import { PropertyStatusBadge } from "@/components/properties/status-badge";
import type { Property } from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 18v2M21 18v2M3 12V8a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12V6a2 2 0 0 1 3.2-1.6" strokeLinecap="round" />
    </svg>
  );
}

function SurfaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  const propertyType = useTranslations("PropertyType");

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-charcoal to-ink">
        {property.image && (
          // eslint-disable-next-line @next/next/no-img-element -- external, per-property demo image URL
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute top-3 start-3">
          <PropertyStatusBadge status={property.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="font-mono text-[1.35rem] font-semibold tabular-nums text-text" dir="ltr">
          {currencyFormatter.format(property.price)}{" "}
          <span className="text-[0.7rem] font-semibold text-text-muted">MAD</span>
        </div>
        <p className="mt-1 truncate font-bold text-text">{property.title}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[0.82rem] text-text-muted">
          <LocationIcon />
          {property.city}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-[0.8rem] text-text-muted">
          <span className="flex items-center gap-1.5">
            <BedIcon />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <BathIcon />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <SurfaceIcon />
            {property.surface} m²
          </span>
          <span className="ms-auto text-[0.72rem] font-semibold text-text-muted uppercase">
            {propertyType(property.type)}
          </span>
        </div>
      </div>
    </Link>
  );
}
