import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles for ALL buttons
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold",
    "rounded-full border-2 border-transparent",
    "transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Primary: Electric Blue with blue shadow
        primary: [
          "bg-accent-blue text-white",
          "shadow-hard",
          "hover:-translate-y-[2px] hover:shadow-hard-lg hover:bg-accent-blue-hover",
          "active:translate-y-[2px] active:shadow-none",
        ],

        // Secondary: Light bg with neutral shadow (theme-aware)
        secondary: [
          "bg-bg-secondary text-text-primary border-border-default",
          "shadow-hard-neutral",
          "hover:-translate-y-[2px] hover:shadow-hard-neutral-lg",
          "active:translate-y-[2px] active:shadow-none",
        ],

        // Destructive: Red with red shadow
        destructive: [
          "bg-accent-red text-white",
          "shadow-hard-error",
          "hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#7F1D1D]",
          "active:translate-y-[2px] active:shadow-none",
        ],

        // Success: Green with green shadow
        success: [
          "bg-accent-green text-white",
          "shadow-hard-success",
          "hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#064E3B]",
          "active:translate-y-[2px] active:shadow-none",
        ],

        // Ghost: No fill, border only
        ghost: [
          "bg-transparent text-text-secondary border-border-default font-medium",
          "hover:bg-bg-tertiary hover:text-text-primary hover:border-border-strong",
          "active:bg-bg-secondary",
        ],

        // Outline: Transparent with accent-blue border
        outline: [
          "bg-transparent text-accent-blue border-accent-blue",
          "hover:bg-accent-blue/10 hover:-translate-y-[2px]",
          "active:translate-y-[2px]",
        ],

        // Link: Text-only button
        link: [
          "bg-transparent text-accent-blue border-transparent underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ],
      },

      size: {
        sm: "h-10 px-5 py-2 text-sm [&_svg]:size-4",
        md: "h-12 px-6 py-3 text-base [&_svg]:size-5",
        lg: "h-14 px-8 py-4 text-base [&_svg]:size-5",
        xl: "h-16 px-10 py-5 text-lg [&_svg]:size-6",
        icon: "h-10 w-10 p-0 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
