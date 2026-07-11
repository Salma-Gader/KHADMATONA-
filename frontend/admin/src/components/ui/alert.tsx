import type { ReactNode } from "react";
import clsx from "clsx";

type Tone = "success" | "warning" | "error" | "info";

const toneClasses: Record<Tone, string> = {
  success: "bg-success-surface border-success/30 text-success",
  warning: "bg-warning-surface border-warning/30 text-warning",
  error: "bg-error-surface border-error/30 text-error",
  info: "bg-info-surface border-info/30 text-info",
};

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "rounded-md border px-4 py-3 text-sm",
        toneClasses[tone],
      )}
    >
      {title && <strong className="mb-0.5 block">{title}</strong>}
      <div className="text-text">{children}</div>
    </div>
  );
}
