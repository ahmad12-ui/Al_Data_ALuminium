"use client";

import * as React from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { VideoDTO } from "@/types";

export function VideoGrid({ videos }: { videos: VideoDTO[] }) {
  const [active, setActive] = React.useState<VideoDTO | null>(null);

  if (videos.length === 0) {
    return <p className="font-body text-warm-grey text-center py-20">No videos available yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <button
            key={video._id}
            onClick={() => setActive(video)}
            className="group relative block aspect-video overflow-hidden bg-brown-800 text-left focus-ring"
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
            <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/30 to-brown-950/40 group-hover:from-brown-900/95 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-cream/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-brown-900 ml-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-display text-cream text-base">{video.name}</h3>
              {video.description && (
                <p className="font-body text-xs text-cream mt-1 line-clamp-1">{video.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-brown-950/95 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 text-cream hover:text-brown-300 focus-ring"
              aria-label="Close video"
            >
              <X className="h-7 w-7" />
            </button>
            <div className="w-full max-w-4xl">
              {active.video?.secure_url && (
                <video
                  src={active.video.secure_url}
                  poster={active.thumbnail?.secure_url}
                  controls
                  autoPlay
                  className="w-full aspect-video bg-black"
                />
              )}
              <h2 className="font-display text-xl text-cream mt-4">{active.name}</h2>
              {active.description && (
                <p className="font-body text-cream text-sm mt-1 opacity-90">{active.description}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
