import { forwardRef, useId, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-bold text-text">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={
          clsx(error && errorId, hint && !error && hintId) || undefined
        }
        className={clsx(
          "w-full rounded-sm border-[1.5px] bg-surface px-3.5 py-2.5 text-[0.95rem] text-text",
          "focus-visible:border-gold-primary",
          error ? "border-error" : "border-border-strong",
          className,
        )}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-[0.76rem] text-text-muted">
          {hint}
        </p>
      )}
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
});
