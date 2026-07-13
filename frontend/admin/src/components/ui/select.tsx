import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, id, className, children, ...props }, ref) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={selectId} className="text-sm font-bold text-text">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            "w-full rounded-sm border-[1.5px] bg-surface px-3.5 py-2.5 text-[0.95rem] text-text",
            "focus-visible:border-gold-primary",
            error ? "border-error" : "border-border-strong",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-[0.76rem] font-semibold text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
