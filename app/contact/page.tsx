import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { getAllServices } from "@/lib/data";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact ALDATA | Aluminum & Interior Decorators",
  description: "Get in touch with ALDATA for interior design, aluminium, steel, and renovation projects in Sadiqabad and Dahrki.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getAllServices()]);
  const settingsPlain = JSON.parse(JSON.stringify(settings));

  return (
    <div className="section-container pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Get In Touch</p>
        <h1 className="font-display text-4xl md:text-5xl text-brown-900">Contact ALDATA</h1>
        <p className="font-body text-warm-grey mt-4">
          Tell us about your space and we&rsquo;ll get back to you to discuss next steps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 mt-14">
        <div className="lg:col-span-3">
          <ContactForm services={services.map((s: any) => s.name)} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-5 font-body text-brown-800">
            <a href={`tel:${settingsPlain.phone}`} className="flex items-start gap-3 hover:text-brown-900 focus-ring">
              <Phone className="h-5 w-5 text-brown-500 mt-0.5" /> {settingsPlain.phone}
            </a>
            <a href={`mailto:${settingsPlain.email}`} className="flex items-start gap-3 hover:text-brown-900 focus-ring break-all">
              <Mail className="h-5 w-5 text-brown-500 mt-0.5" /> {settingsPlain.email}
            </a>
            {settingsPlain.locations?.map((loc: { label: string; address: string }) => (
              <div key={loc.label} className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brown-500 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold">{loc.label}</span>
                  {loc.address}
                </span>
              </div>
            ))}
          </div>

          {settingsPlain.locations?.map((loc: { label: string; address: string }, i: number) => {
            const mapUrl = i === 0 ? settingsPlain.googleMaps?.dahrki : settingsPlain.googleMaps?.sadiqabad;
            return (
              <div key={loc.label}>
                <p className="font-body text-xs uppercase tracking-[0.15em] text-brown-500 mb-2">{loc.label}</p>
                <div className="relative aspect-[4/3] bg-offwhite border border-brown-200 overflow-hidden">
                  {mapUrl ? (
                    <iframe src={mapUrl} className="absolute inset-0 h-full w-full" loading="lazy" title={`ALDATA ${loc.label} map`} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="font-body text-xs text-warm-grey px-4 text-center">
                        Map not yet configured for this location.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
