import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { formatDate } from "@/lib/utils";
import type { ProjectDTO } from "@/types";

export function FeaturedProjects({ projects }: { projects: ProjectDTO[] }) {
  if (projects.length === 0) return null;
  const [large, ...rest] = projects;
  const smalls = rest.slice(0, 4);

  return (
    <section className="section-container py-20 md:py-28">
      <SectionHeading eyebrow="Our Work" title="Featured Projects" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-14">
        <ProjectTile project={large} large />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {smalls.map((p) => (
            <ProjectTile project={p} key={p._id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectTile({ project, large = false }: { project: ProjectDTO; large?: boolean }) {
  const cover = project.featuredImage?.secure_url || project.images?.[0]?.secure_url;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative block overflow-hidden bg-brown-200 focus-ring ${
        large ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-square"
      }`}
    >
      {cover && (
        <Image
          src={cover}
          alt={project.name}
          fill
          sizes={large ? "50vw" : "25vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-cream mb-1">
          {project.category} {project.date ? `· ${formatDate(project.date)}` : ""}
        </p>
        <h3 className={`font-display text-cream leading-tight ${large ? "text-2xl md:text-3xl" : "text-lg"}`}>
          {project.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-2 text-cream text-xs font-body opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          View Project <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
