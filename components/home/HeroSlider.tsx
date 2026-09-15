"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { HeroSlideDTO } from "@/types";

export function HeroSlider({ slides }: { slides: HeroSlideDTO[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 });
  const [selected, setSelected] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Autoplay, pausing on hover.
  React.useEffect(() => {
    if (!emblaApi || slides.length <= 1 || isHovering) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => clearInterval(id);
  }, [emblaApi, isHovering, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative h-[92vh] min-h-[560px] w-full bg-brown-950 flex items-center justify-center text-center px-6">
        <div>
          <p className="eyebrow text-brown-300 mb-4">ALDATA</p>
          <h1 className="font-display text-4xl md:text-6xl text-cream leading-tight">
            Spaces That Inspire
          </h1>
          <p className="font-body text-brown-200 mt-4 max-w-xl mx-auto">
            Interior design and architectural solutions, crafted for the way you live.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/projects">Explore Projects</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-brown-950"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div className="relative h-full min-w-0 flex-[0_0_100%]" key={slide._id}>
              {slide.image?.secure_url && (
                <Image
                  src={slide.image.secure_url}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/85 via-brown-950/25 to-brown-950/40" />

              <div className="relative z-10 h-full section-container flex flex-col justify-end pb-24 md:pb-28">
                <AnimatePresence mode="wait">
                  {selected === i && (
                    <motion.div
                      key={slide._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="max-w-2xl"
                    >
                      {slide.subtitle && (
                        <p className="eyebrow text-brown-300 mb-4">{slide.subtitle}</p>
                      )}
                      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
                        {slide.title}
                      </h1>
                      {slide.description && (
                        <p className="font-body text-brown-100/90 mt-5 max-w-lg text-base md:text-lg leading-relaxed">
                          {slide.description}
                        </p>
                      )}
                      {slide.buttonText && (
                        <Button asChild size="lg" className="mt-8">
                          <Link href={slide.buttonLink || "/projects"}>{slide.buttonText}</Link>
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 md:h-12 md:w-12 flex items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors focus-ring"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 md:h-12 md:w-12 flex items-center justify-center border border-cream/30 text-cream hover:bg-cream/10 transition-colors focus-ring"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute right-6 md:right-16 bottom-8 z-20 flex items-center gap-3 font-body text-cream">
            <span className="text-lg md:text-xl font-semibold">{String(selected + 1).padStart(2, "0")}</span>
            <span className="w-8 h-px bg-cream/40" />
            <span className="text-sm text-cream/60">{String(slides.length).padStart(2, "0")}</span>
          </div>
        </>
      )}
    </section>
  );
}
