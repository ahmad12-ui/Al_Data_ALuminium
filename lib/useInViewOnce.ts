"use client";

import * as React from "react";

/**
 * Minimal "fade up once when scrolled into view" hook using the native
 * IntersectionObserver API. This replaces Framer Motion's `whileInView` for
 * the common one-shot scroll-reveal pattern used repeatedly across the
 * homepage (SectionHeading alone mounted 6 separate Framer Motion instances
 * on a single page load). Same visual result, a fraction of the JS/hydration
 * cost, and respects prefers-reduced-motion automatically via the CSS layer.
 */
export function useInViewOnce<T extends HTMLElement>(margin = "-80px") {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver isn't available for some reason, just show
    // the content immediately rather than leaving it invisible.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px`, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView };
}
