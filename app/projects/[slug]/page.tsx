import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Tag, Banknote } from "lucide-react";
import { getProjectBySlug, getRelatedProjects } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ImageGallery } from "@/components/projects/ImageGallery";
import { BeforeAfterSlider } from "@/components/projects/BeforeAfterSlider";
import { ProjectCard } from "@/components/projects/ProjectCard";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found | ALDATA" };
  return {
    title: `${project.name} | ALDATA Projects`,
    description: project.description?.slice(0, 160),
    openGraph: {
      images: project.featuredImage?.secure_url ? [project.featuredImage.secure_url] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const related = await getRelatedProjects(project.category, project.slug, 3);
  const hasBeforeAfter = project.beforeImages?.[0] && project.afterImages?.[0];

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="section-container mb-8 md:mb-10">
        <p className="eyebrow mb-3">{project.category}</p>
        <h1 className="font-display text-3xl md:text-5xl text-brown-900 max-w-3xl">{project.name}</h1>

        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6 font-body text-sm text-warm-grey">
          {project.location && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brown-500" /> {project.location}
            </span>
          )}
          {project.date && (
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brown-500" /> {formatDate(project.date)}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-brown-500" /> {project.category}
          </span>
          {project.price && (
            <span className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-brown-500" /> {project.price}
            </span>
          )}
        </div>
      </div>

      <div className="section-container">
        <ImageGallery images={project.images} alt={project.name} />
      </div>

      {hasBeforeAfter && (
        <div className="section-container mt-14">
          <BeforeAfterSlider before={project.beforeImages[0]} after={project.afterImages[0]} />
        </div>
      )}

      <div className="section-container mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-brown-900 mb-4">Project Details</h2>
          <p className="font-body text-brown-700 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="section-container mt-24">
          <h2 className="font-display text-2xl md:text-3xl text-brown-900 mb-10">Related Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {related.map((p: any) => (
              <ProjectCard project={p} key={p._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
