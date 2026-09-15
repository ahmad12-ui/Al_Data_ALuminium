import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ServiceDTO } from "@/types";

export function ServiceCard({ service }: { service: ServiceDTO }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block focus-ring">
      <div className="relative aspect-[4/5] overflow-hidden bg-brown-200">
        {service.image?.secure_url && (
          <Image
            src={service.image.secure_url}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-lg text-cream">{service.name}</h3>
          <p className="font-body text-xs text-cream mt-1 line-clamp-2">{service.description}</p>
          <div className="flex items-center gap-1.5 mt-3 text-cream text-xs font-body opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View Service <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
