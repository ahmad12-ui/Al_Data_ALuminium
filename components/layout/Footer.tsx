import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Videos", href: "/videos" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const FOOTER_SERVICES = [
  "Interior Designing",
  "Aluminium Work",
  "Steel Work",
  "Kitchen Cabinets",
  "Renovation",
  "Modular Kitchens",
];

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-brown-950 text-cream">
      <div className="section-container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 bg-cream/5 p-1">
                <Image src="/logo/aldata-logo.png" alt="ALDATA" fill className="object-contain" sizes="48px" />
              </div>
              <span className="font-display text-xl tracking-wide">ALDATA</span>
            </div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-brown-300 mb-4">
              Aluminum &amp; Interior Decorators
            </p>
            <p className="font-display italic text-lg text-brown-200 leading-snug">
              &ldquo;We Don&rsquo;t Just Design.
              <br />
              We Create Experiences.&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-6">
              {settings.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-brown-300 hover:text-cream focus-ring" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-brown-300 hover:text-cream focus-ring" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-brown-300 hover:text-cream focus-ring" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-brown-300 mb-5">Navigation</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-sm text-brown-200 hover:text-cream transition-colors focus-ring">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-brown-300 mb-5">Services</h3>
            <ul className="space-y-3">
              {FOOTER_SERVICES.map((s) => (
                <li key={s} className="font-body text-sm text-brown-200">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-brown-300 mb-5">Contact</h3>
            <ul className="space-y-4 font-body text-sm text-brown-200">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-brown-300 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-cream focus-ring">{settings.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-brown-300 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-cream focus-ring break-all">{settings.email}</a>
              </li>
              {settings.locations?.map((loc: { label: string; address: string }) => (
                <li key={loc.label} className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-brown-300 shrink-0" />
                  <span>
                    <span className="block font-semibold text-cream/90">{loc.label}</span>
                    {loc.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Huge typographic brand block */}
      <div className="border-t border-brown-800 py-10 md:py-16 overflow-hidden">
        <div className="section-container">
          <p className="font-display font-bold leading-[0.85] text-brown-800/70 select-none text-center
            text-[15vw] md:text-[10vw] lg:text-[9rem] xl:text-[10.5rem] tracking-tight">
            ALDATA
          </p>
          <p className="text-center font-body text-[10px] md:text-sm tracking-[0.4em] uppercase text-brown-500 mt-2 md:mt-4">
            Aluminum &amp; Interior Decorators
          </p>
        </div>
      </div>

      <div className="border-t border-brown-800 py-6">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="font-body text-xs text-brown-400">
            &copy; {new Date().getFullYear()} ALDATA Aluminum &amp; Interior Decorators. All rights reserved.
          </p>
          <p className="font-body text-xs text-brown-500">{settings.footerText}</p>
        </div>
      </div>
    </footer>
  );
}
