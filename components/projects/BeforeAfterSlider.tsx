"use client";

import * as React from "react";
import Image from "next/image";
import type { ImageAsset } from "@/types";

export function BeforeAfterSlider({ before, after }: { before: ImageAsset; after: ImageAsset }) {
  const [position, setPosition] = React.useState(50);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div>
      <p className="eyebrow mb-3">Before &amp; After</p>
      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full overflow-hidden select-none touch-none cursor-ew-resize"
        onMouseDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
        onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
      >
        <Image src={after.secure_url} alt="After" fill sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div className="relative h-full" style={{ width: containerWidth || "100%" }}>
            <Image src={before.secure_url} alt="Before" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cream shadow-lg"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-cream flex items-center justify-center text-brown-900 text-xs font-bold shadow-lg">
            ⇔
          </div>
        </div>
        <span className="absolute left-3 top-3 bg-brown-950/70 text-cream text-xs font-body px-2 py-1">
          Before
        </span>
        <span className="absolute right-3 top-3 bg-brown-950/70 text-cream text-xs font-body px-2 py-1">
          After
        </span>
      </div>
    </div>
  );
}
