import * as React from "react";
import { cn } from "@/lib/utils";

function Progress({
  value = 0,
  max = 100,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  value?: number;
  max?: number;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "border-border-default bg-bg-tertiary h-3 w-full overflow-hidden rounded-full border-2",
        className
      )}
      {...props}
    >
      <div
        className="bg-accent-blue h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };
