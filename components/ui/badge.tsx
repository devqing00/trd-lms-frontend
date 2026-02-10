import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide border-2",
  {
    variants: {
      variant: {
        default: "bg-bg-tertiary/50 border-border-default text-text-secondary",
        success: "bg-accent-green/10 border-accent-green/20 text-accent-green",
        error: "bg-accent-red/10 border-accent-red/20 text-accent-red",
        warning: "bg-accent-amber/10 border-accent-amber/20 text-accent-amber",
        info: "bg-accent-blue/10 border-accent-blue/20 text-accent-blue",
        purple: "bg-accent-purple/10 border-accent-purple/20 text-accent-purple",
        outline: "bg-transparent border-border-default text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
