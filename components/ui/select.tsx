import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// A lightweight native <select> wrapper styled to match the ALDATA design system.
// Used in admin forms where a full Radix Select is unnecessary overhead.
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none border border-brown-200 bg-cream px-4 pr-9 text-sm font-body text-brown-900 focus-ring",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brown-500" />
    </div>
  )
);
Select.displayName = "Select";
export { Select };
