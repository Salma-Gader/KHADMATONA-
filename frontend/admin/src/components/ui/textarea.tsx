import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, id, className, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={textareaId} className="text-sm font-bold text-text">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            clsx(error && errorId, hint && !error && hintId) || undefined
          }
          className={clsx(
            "min-h-[7rem] w-full resize-y rounded-sm border-[1.5px] bg-surface px-3.5 py-2.5 text-[0.95rem] text-text",
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
  },
);
