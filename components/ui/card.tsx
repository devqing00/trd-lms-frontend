import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border-border-default bg-bg-secondary overflow-hidden border-2 p-6",
        "shadow-hard-card",
        className
      )}
      {...props}
    />
  );
}

function CardInteractive({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border-border-default bg-bg-secondary cursor-pointer overflow-hidden border-2 p-6",
        "shadow-hard-card",
        "transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "hover:shadow-hard-card-lg hover:border-border-strong hover:-translate-y-[2px]",
        "active:shadow-hard-neutral-sm active:translate-y-[1px]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-display text-text-primary text-lg leading-tight font-medium tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-text-secondary text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-3 pt-4", className)} {...props} />;
}

export { Card, CardInteractive, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
