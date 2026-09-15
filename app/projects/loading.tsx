import { GridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl space-y-4">
        <div className="h-3 w-24 bg-brown-200/60 animate-pulse" />
        <div className="h-10 w-72 bg-brown-200/60 animate-pulse" />
      </div>
      <div className="mt-12">
        <GridSkeleton count={9} />
      </div>
    </div>
  );
}
