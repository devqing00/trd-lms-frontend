import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("animate-shimmer bg-bg-tertiary rounded-xl", className)} {...props} />;
}

/** Card-shaped skeleton for course cards, stat cards, etc. */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-card border-border-default bg-bg-secondary border-2 p-6", className)}
    >
      <Skeleton className="mb-4 h-12 w-12 rounded-2xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/** Table row skeleton */
function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <div className="border-border-default flex items-center gap-4 border-b px-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4", i === 0 ? "w-32" : "w-20", "flex-shrink-0")} />
      ))}
    </div>
  );
}

/** Table skeleton with header and rows */
function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-card border-border-default bg-bg-secondary overflow-hidden border-2">
      {/* Header */}
      <div className="border-border-default bg-bg-tertiary flex items-center gap-4 border-b-2 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className={cn("h-3", i === 0 ? "w-24" : "w-16", "flex-shrink-0")} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </div>
  );
}

/** Avatar + text skeleton for user lists */
function SkeletonUser() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/** Dashboard stat card skeleton */
function SkeletonStat() {
  return (
    <div className="rounded-card border-border-default bg-bg-secondary border-2 p-6">
      <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
      <Skeleton className="mb-2 h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

/** Full page loading skeleton */
function SkeletonPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>
      <SkeletonTable />
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonRow,
  SkeletonTable,
  SkeletonUser,
  SkeletonStat,
  SkeletonPage,
};
