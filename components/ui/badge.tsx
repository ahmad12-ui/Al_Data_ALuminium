import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-brown-300 bg-brown-200/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brown-800",
        className
      )}
      {...props}
    />
  );
}
export { Badge };
