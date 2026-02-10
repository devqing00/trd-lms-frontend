import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-4",
} as const;

function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof sizeClasses;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "border-border-default border-t-accent-blue inline-block animate-spin rounded-full",
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { Spinner };
