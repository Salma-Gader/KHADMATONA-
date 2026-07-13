import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "min-w-0 rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
