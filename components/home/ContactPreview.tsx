import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettingsDTO } from "@/types";

export function ContactPreview({ settings }: { settings: SiteSettingsDTO }) {
  return (
    <section className="section-container py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center border border-brown-200 p-8 md:p-14">
        <div>
          <p className="eyebrow mb-3">Get In Touch</p>
          <h2 className="font-display text-3xl md:text-4xl text-brown-900 leading-tight">
            Contact ALDATA
          </h2>
          <div className="mt-8 space-y-4">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-3 font-body text-brown-800 hover:text-brown-900 focus-ring">
              <Phone className="h-4 w-4 text-brown-500" /> {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 font-body text-brown-800 hover:text-brown-900 focus-ring break-all">
              <Mail className="h-4 w-4 text-brown-500" /> {settings.email}
            </a>
            {settings.locations?.map((loc) => (
              <div key={loc.label} className="flex items-start gap-3 font-body text-brown-800">
                <MapPin className="h-4 w-4 text-brown-500 mt-1 shrink-0" />
                <span>
                  <span className="font-semibold">{loc.label}:</span> {loc.address}
                </span>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">
              Get in Touch <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="relative aspect-[4/3] bg-offwhite border border-brown-200 overflow-hidden">
          {settings.googleMaps?.sadiqabad ? (
            <iframe
              src={settings.googleMaps.sadiqabad}
              className="absolute inset-0 h-full w-full grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              title="ALDATA Sadiqabad location map"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="font-body text-sm text-warm-grey px-6 text-center">
                Map preview available once a Google Maps embed URL is added in Site Settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
