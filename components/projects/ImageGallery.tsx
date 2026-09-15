"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ImageAsset } from "@/types";

export function ImageGallery({ images, alt }: { images: ImageAsset[]; alt: string }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const close = React.useCallback(() => setOpenIndex(null), []);
  const prev = React.useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = React.useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  React.useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  if (images.length === 0) return null;

  const [main, ...thumbs] = images;

  return (
    <div>
      <button
        onClick={() => setOpenIndex(0)}
        className="group relative block w-full aspect-[16/10] overflow-hidden bg-brown-200 focus-ring"
        aria-label="Open image gallery"
      >
        <Image
          src={main.secure_url}
          alt={`${alt} — main image`}
          fill
          sizes="100vw"
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute right-4 bottom-4 h-11 w-11 rounded-full bg-cream/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-5 w-5 text-brown-900" />
        </div>
      </button>

      {thumbs.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
          {thumbs.map((img, i) => (
            <button
              key={img.public_id}
              onClick={() => setOpenIndex(i + 1)}
              className="relative aspect-square overflow-hidden bg-brown-200 focus-ring"
              aria-label={`Open image ${i + 2}`}
            >
              <Image
                src={img.secure_url}
                alt={`${alt} — image ${i + 2}`}
                fill
                sizes="200px"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-brown-950/95 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button
              onClick={close}
              className="absolute right-5 top-5 text-cream hover:text-brown-300 focus-ring"
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>
            <button
              onClick={prev}
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-cream hover:text-brown-300 focus-ring"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-cream hover:text-brown-300 focus-ring"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl aspect-[16/10]"
            >
              <Image
                src={images[openIndex].secure_url}
                alt={`${alt} — image ${openIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>

            <div className="absolute bottom-6 font-body text-cream/80 text-sm">
              {openIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
