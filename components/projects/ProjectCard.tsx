import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ProjectDTO } from "@/types";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  const cover = project.featuredImage?.secure_url || project.images?.[0]?.secure_url;
  return (
    <Link href={`/projects/${project.slug}`} className="group block focus-ring">
      <div className="relative aspect-[4/5] overflow-hidden bg-brown-200">
        {cover && (
          <Image
            src={cover}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-brown-950/0 group-hover:bg-brown-950/20 transition-colors duration-300" />
        <div className="absolute right-4 top-4 h-10 w-10 rounded-full bg-cream/0 group-hover:bg-cream/95 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-brown-900" />
        </div>
      </div>
      <div className="mt-4">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-brown-500">
          {project.category}
          {project.date ? ` · ${formatDate(project.date)}` : ""}
        </p>
        <h3 className="font-display text-xl text-brown-900 mt-1">{project.name}</h3>
        {project.location && <p className="font-body text-sm text-warm-grey mt-1">{project.location}</p>}
      </div>
    </Link>
  );
}
