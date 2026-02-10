import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "border-border-default bg-bg-tertiary flex w-full rounded-2xl border-2 px-6 py-4",
        "text-text-primary placeholder:text-text-tertiary text-base",
        "transition-all duration-200",
        "focus:border-accent-blue focus:ring-accent-blue/20 focus:ring-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-text-primary file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
}

function InputWithLabel({
  label,
  id,
  error,
  className,
  ...inputProps
}: React.ComponentProps<"input"> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="text-text-secondary block text-sm font-medium tracking-wider uppercase"
      >
        {label}
      </label>
      <Input id={id} {...inputProps} />
      {error && <p className="text-accent-red text-sm">{error}</p>}
    </div>
  );
}

export { Input, InputWithLabel };
