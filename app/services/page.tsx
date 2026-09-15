import type { Metadata } from "next";
import { getAllServices } from "@/lib/data";
import { ServiceCard } from "@/components/services/ServiceCard";

export const metadata: Metadata = {
  title: "ALDATA Services | Interior, Aluminium & Renovation",
  description: "Explore ALDATA's full range of interior design, aluminium, steel, and renovation services.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">What We Do</p>
        <h1 className="font-display text-4xl md:text-5xl text-brown-900">Our Services</h1>
        <p className="font-body text-warm-grey mt-4">
          From concept to completion — interior design, aluminium and steel work, kitchens, and
          full renovations.
        </p>
      </div>

      <div className="mt-14">
        {services.length === 0 ? (
          <p className="font-body text-warm-grey text-center py-20">No services available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {services.map((service: any) => (
              <ServiceCard service={service} key={service._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
