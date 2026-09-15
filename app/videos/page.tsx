import type { Metadata } from "next";
import { getAllVideos } from "@/lib/data";
import { VideoGrid } from "@/components/videos/VideoGrid";

export const metadata: Metadata = {
  title: "ALDATA Videos | Behind The Scenes & Project Walkthroughs",
  description: "Watch ALDATA's behind-the-scenes construction process and interior transformation videos.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getAllVideos();

  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Behind The Scenes</p>
        <h1 className="font-display text-4xl md:text-5xl text-brown-900">Videos</h1>
        <p className="font-body text-warm-grey mt-4">
          Construction process, project walkthroughs, and interior transformations.
        </p>
      </div>

      <div className="mt-14">
        <VideoGrid videos={videos as any} />
      </div>
    </div>
  );
}
