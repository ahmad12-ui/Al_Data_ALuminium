import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/button";
import type { VideoDTO } from "@/types";

export function VideoSection({ videos }: { videos: VideoDTO[] }) {
  if (videos.length === 0) return null;

  return (
    <section className="section-container py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <SectionHeading eyebrow="Behind The Scenes" title="Watch It Come Together" />
        <Button asChild variant="outline" size="lg" className="shrink-0">
          <Link href="/videos">View All Videos</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <Link
            key={video._id}
            href="/videos"
            className="group relative block aspect-video overflow-hidden bg-brown-800 focus-ring"
          >
            {video.thumbnail?.secure_url && (
              <Image
                src={video.thumbnail.secure_url}
                alt={video.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-brown-950/40 group-hover:bg-brown-950/55 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-cream/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-brown-900 ml-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-display text-cream text-base">{video.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
