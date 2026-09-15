"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function ProjectFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "All";

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={cn(
            "px-4 py-2 text-sm font-body border transition-colors focus-ring",
            active === cat
              ? "bg-brown-800 text-cream border-brown-800"
              : "border-brown-300 text-brown-700 hover:border-brown-800"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
