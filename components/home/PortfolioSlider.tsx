"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/home/SectionHeading";
import type { ProjectDTO } from "@/types";

export function PortfolioSlider({ projects }: { projects: ProjectDTO[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (projects.length === 0) {
    return (
      <section className="section-container py-20 md:py-28">
        <SectionHeading eyebrow="Portfolio" title="Selected Work" subtitle="A glimpse into the spaces we've created." align="center" />
        <p className="text-center font-body text-warm-grey mt-10">No projects available yet.</p>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-offwhite overflow-hidden">
      <div className="section-container flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected Work"
          subtitle="A glimpse into the spaces we've created."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous project"
            className="h-11 w-11 flex items-center justify-center border border-brown-300 text-brown-800 hover:bg-brown-800 hover:text-cream transition-colors focus-ring"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next project"
            className="h-11 w-11 flex items-center justify-center border border-brown-300 text-brown-800 hover:bg-brown-800 hover:text-cream transition-colors focus-ring"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="font-body text-sm text-warm-grey ml-2">
            {String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 md:gap-6 section-container">
          {projects.map((project) => {
            const cover = project.featuredImage?.secure_url || project.images?.[0]?.secure_url;
            return (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                className="group relative shrink-0 basis-[85%] sm:basis-[60%] md:basis-[38%] lg:basis-[30%] focus-ring"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-brown-200">
                  {cover && (
                    <Image
                      src={cover}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 85vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                    <p className="font-body text-[11px] uppercase tracking-[0.2em] text-cream mb-2">
                      {project.category} {project.location ? `· ${project.location}` : ""}
                    </p>
                    <h3 className="font-display text-xl md:text-2xl leading-tight">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-3 text-sm font-body opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View Project <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
