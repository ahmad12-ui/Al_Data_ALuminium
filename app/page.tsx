import type { Metadata } from "next";
import { Suspense } from "react";
import dynamicImport from "next/dynamic";
import {
  getActiveHeroSlides,
  getPortfolioProjects,
  getFeaturedServices,
  getFeaturedProjects,
  getLatestVideos,
} from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Introduction } from "@/components/home/Introduction";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { WhyAldata } from "@/components/home/WhyAldata";
import { Process } from "@/components/home/Process";
import { VideoSection } from "@/components/home/VideoSection";
import { CTA } from "@/components/home/CTA";
import { ContactPreview } from "@/components/home/ContactPreview";

// Code-split below-the-fold client components that pull in heavier
// dependencies (Embla carousel, Framer Motion). SSR stays on (default),
// so the HTML output and visual result are unchanged — only the JS chunk
// for these sections is fetched separately instead of bundled into the
// page's critical initial script, which is what actually helps TBT/FCP.
const PortfolioSlider = dynamicImport(() =>
  import("@/components/home/PortfolioSlider").then((m) => m.PortfolioSlider)
);
const DesignBuildStory = dynamicImport(() =>
  import("@/components/home/DesignBuildStory").then((m) => m.DesignBuildStory)
);

export const metadata: Metadata = {
  title: "ALDATA | Aluminum & Interior Decorators",
  description:
    "We Don't Just Design, We Create Experiences. Interior design, aluminium & steel work, kitchen cabinets, and renovation across Sadiqabad and Dahrki.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

/**
 * Each section below fetches its own data and is wrapped in its own <Suspense>
 * boundary. This is a deliberate performance fix: the previous version awaited
 * a single Promise.all() for six independent queries (hero, projects x2,
 * services, videos, settings) before rendering ANY markup — including the
 * hero image, which is this page's LCP element. That meant LCP was gated on
 * the slowest of six unrelated database round-trips.
 *
 * Splitting per-section lets Next.js stream the static/non-DB sections and
 * the hero immediately once its own (single) query resolves, while slower
 * or unrelated sections (portfolio slider, videos, contact settings) stream
 * in independently without blocking the initial paint. No visual behavior
 * changes — the skeleton fallbacks match each section's real layout so there
 * is no layout shift while data streams in.
 */

async function HeroSection() {
  const heroSlides = await getActiveHeroSlides();
  return <HeroSlider slides={heroSlides as any} />;
}

async function FeaturedServicesSection() {
  const services = await getFeaturedServices(8);
  return <FeaturedServices services={services as any} />;
}

async function FeaturedProjectsSection() {
  const projects = await getFeaturedProjects(5);
  return <FeaturedProjects projects={projects as any} />;
}

async function PortfolioSliderSection() {
  const projects = await getPortfolioProjects(10);
  return <PortfolioSlider projects={projects as any} />;
}

async function VideoSectionData() {
  const videos = await getLatestVideos(6);
  return <VideoSection videos={videos as any} />;
}

async function BottomSection() {
  // CTA and ContactPreview both only need settings — fetched once and shared,
  // rather than issuing the same query twice.
  const settings = await getSiteSettings();
  const plainSettings = JSON.parse(JSON.stringify(settings));
  return (
    <>
      <CTA phone={plainSettings.phone} />
      <ContactPreview settings={plainSettings} />
    </>
  );
}

function HeroFallback() {
  return <div className="h-[92vh] min-h-[560px] w-full bg-brown-950 animate-pulse" />;
}

function GridSectionFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`section-container py-20 md:py-28 ${className}`}>
      <div className="h-10 w-64 bg-brown-200/60 animate-pulse mb-14" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-brown-200/60 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroFallback />}>
        <HeroSection />
      </Suspense>

      <Introduction />

      <Suspense fallback={<GridSectionFallback />}>
        <FeaturedServicesSection />
      </Suspense>

      <Suspense fallback={<GridSectionFallback />}>
        <FeaturedProjectsSection />
      </Suspense>

      <Suspense fallback={<GridSectionFallback className="bg-offwhite" />}>
        <PortfolioSliderSection />
      </Suspense>

      <DesignBuildStory />
      <WhyAldata />
      <Process />

      <Suspense fallback={<GridSectionFallback />}>
        <VideoSectionData />
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-brown-900 animate-pulse" />}>
        <BottomSection />
      </Suspense>
    </>
  );
}
