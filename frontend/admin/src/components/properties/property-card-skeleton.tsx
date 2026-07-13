import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors PropertyCard's exact shape so the grid never shifts on load. */
export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <Skeleton className="h-44 rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="mt-2 flex items-center gap-4 border-t border-border pt-4">
          <Skeleton className="h-3.5 w-8" />
          <Skeleton className="h-3.5 w-8" />
          <Skeleton className="h-3.5 w-14" />
        </div>
      </div>
    </div>
  );
}
