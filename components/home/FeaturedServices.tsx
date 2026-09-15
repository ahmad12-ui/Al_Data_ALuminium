import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/button";
import type { ServiceDTO } from "@/types";

export function FeaturedServices({ services }: { services: ServiceDTO[] }) {
  if (services.length === 0) return null;

  return (
    <section className="section-container py-20 md:py-28">
      <SectionHeading eyebrow="What We Do" title="Featured Services" align="center" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
        {services.map((service) => (
          <Link
            href={`/services/${service.slug}`}
            key={service._id}
            className="group relative block overflow-hidden focus-ring"
          >
            <div className="relative aspect-[3/4] bg-brown-200 overflow-hidden">
              {service.image?.secure_url && (
                <Image
                  src={service.image.secure_url}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/25 to-transparent transition-opacity duration-300 group-hover:from-brown-900/95" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg text-cream">{service.name}</h3>
                <p className="font-body text-xs text-cream mt-1 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-1.5 mt-3 text-cream text-xs font-body opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  View Service <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Button asChild variant="outline" size="lg">
          <Link href="/services">View All Services</Link>
        </Button>
      </div>
    </section>
  );
}
