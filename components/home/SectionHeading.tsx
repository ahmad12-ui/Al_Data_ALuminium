"use client";

import { useInViewOnce } from "@/lib/useInViewOnce";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        align === "center" ? "text-center mx-auto max-w-2xl" : "",
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brown-900 leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-warm-grey mt-4 text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
