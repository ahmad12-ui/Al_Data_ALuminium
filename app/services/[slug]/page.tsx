import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getAllProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found | ALDATA" };
  return {
    title: `${service.name} | ALDATA Services`,
    description: service.description?.slice(0, 160),
    openGraph: { images: service.image?.secure_url ? [service.image.secure_url] : undefined },
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const allProjects = await getAllProjects(service.name);
  const related = allProjects.slice(0, 3);

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <div className="relative aspect-[21/9] w-full bg-brown-200 overflow-hidden">
        {service.image?.secure_url && (
          <Image src={service.image.secure_url} alt={service.name} fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-brown-950/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 section-container pb-10">
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-2xl">{service.name}</h1>
        </div>
      </div>

      <div className="section-container mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="font-body text-brown-700 leading-relaxed whitespace-pre-line text-lg">
            {service.description}
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Start Your Project</Link>
          </Button>
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
