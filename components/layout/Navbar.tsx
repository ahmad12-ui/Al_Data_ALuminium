"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Videos", href: "/videos" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Admin routes get no public navbar.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(43,26,20,0.08)]" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "section-container flex items-center justify-between transition-all duration-500",
          scrolled ? "py-3" : "py-5 md:py-7"
        )}
      >
        <Link href="/" className="flex items-center gap-3 focus-ring" aria-label="ALDATA home">
          <div className={cn("relative transition-all duration-500", scrolled ? "h-10 w-10" : "h-12 w-12 md:h-14 md:w-14")}>
            <Image src="/logo/aldata-logo.png" alt="ALDATA" fill sizes="56px" className="object-contain" priority />
          </div>
          <div className={cn("hidden sm:block leading-none", scrolled ? "opacity-90" : "")}>
            <p
              className={cn(
                "font-display tracking-[0.1em]",
                scrolled ? "text-lg text-brown-900" : "text-xl text-brown-900"
              )}
            >
              ALDATA
            </p>
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-brown-500">
              Aluminum &amp; Interior
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-sm tracking-wide transition-colors focus-ring relative py-1",
                  active ? "text-brown-900 font-semibold" : "text-brown-700 hover:text-brown-900"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-brown-800"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size={scrolled ? "sm" : "default"}>
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden text-brown-900 focus-ring p-2" aria-label="Open menu">
              <Menu className="h-7 w-7" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col">
            <div className="flex items-center gap-3 pb-8 pt-2">
              <div className="relative h-11 w-11">
                <Image src="/logo/aldata-logo.png" alt="ALDATA" fill sizes="44px" className="object-contain" />
              </div>
              <div>
                <p className="font-display text-lg text-brown-900">ALDATA</p>
                <p className="font-body text-[9px] tracking-[0.2em] uppercase text-brown-500">
                  Aluminum &amp; Interior
                </p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-display text-2xl py-3 border-b border-brown-200/60 transition-colors focus-ring",
                      pathname === link.href ? "text-brown-900" : "text-brown-700"
                    )}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto pb-6">
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/contact">Start a Project</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
