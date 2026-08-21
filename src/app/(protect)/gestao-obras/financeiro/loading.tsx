import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceiroLoading() {
  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => index).map((index) => (
          <Skeleton key={index} className="h-[104px] rounded-lg" />
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Skeleton className="h-10 w-full lg:max-w-sm" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:shrink-0">
          <Skeleton className="h-11 w-full sm:w-56" />
          <Skeleton className="h-11 w-full sm:w-44" />
        </div>
      </div>

      <Skeleton className="h-96 w-full rounded-lg" />
    </main>
  );
}
