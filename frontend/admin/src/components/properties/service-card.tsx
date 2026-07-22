import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ServiceCard({
  index,
  icon,
  title,
  description,
}: {
  index: number;
  /** When provided, replaces the numbered badge with an icon - used where
   * the cards represent reasons/qualities rather than a numbered sequence. */
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card interactive radius="md" className="group h-full hover:border-gold-primary/40">
      {icon ? (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-primary/10 text-gold-primary transition-colors group-hover:bg-gold-primary group-hover:text-white">
          {icon}
        </span>
      ) : (
        <span className="font-mono text-sm text-gold-primary">
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span className="mt-4 block h-px w-8 bg-border transition-all duration-300 group-hover:w-12 group-hover:bg-gold-primary" />
      <h3 className="mt-4 font-display text-xl font-semibold text-text">{title}</h3>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-text-muted">{description}</p>
    </Card>
  );
}
