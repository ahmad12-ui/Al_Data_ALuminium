import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProjects, getProjectCategories } from "@/lib/data";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { GridSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "ALDATA Projects | Interior & Architectural Work",
  description: "Browse ALDATA's portfolio of interior design, aluminium, steel, and renovation projects.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [projects, categories] = await Promise.all([
    getAllProjects(searchParams.category),
    getProjectCategories(),
  ]);

  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Portfolio</p>
        <h1 className="font-display text-4xl md:text-5xl text-brown-900">Our Projects</h1>
        <p className="font-body text-warm-grey mt-4">
          A collection of interiors, aluminium and steel work, and renovations completed across
          Sadiqabad and Dahrki.
        </p>
      </div>

      <div className="mt-10">
        <Suspense>
          <ProjectFilters categories={categories} />
        </Suspense>
      </div>

      <div className="mt-12">
        {projects.length === 0 ? (
          <p className="font-body text-warm-grey text-center py-20">No projects available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {projects.map((project: any) => (
              <ProjectCard project={project} key={project._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
