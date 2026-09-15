"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923048762936";

export function WhatsAppButton() {
  const pathname = usePathname();
  const [showTip, setShowTip] = React.useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      // Same one-time delayed fade+scale entrance as before, now plain CSS
      // instead of a mounted Framer Motion instance on every single page.
      style={{ animationDelay: "1.6s" }}
      className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-brown-950/20 focus-ring opacity-0 scale-50 animate-scale-fade-in motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:scale-100"
    >
      {showTip && (
        <span className="absolute right-16 whitespace-nowrap bg-brown-950 text-cream text-xs font-body px-3 py-1.5 rounded-sm hidden md:block">
          Chat on WhatsApp
        </span>
      )}
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.652 4.566 1.786 6.454L4 29l7.72-1.744A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.75a9.7 9.7 0 0 1-4.95-1.36l-.355-.21-4.583 1.036 1.06-4.47-.232-.366A9.7 9.7 0 0 1 6.25 15c0-5.385 4.372-9.75 9.754-9.75 5.383 0 9.746 4.365 9.746 9.75 0 5.386-4.363 9.75-9.746 9.75zm5.34-7.31c-.29-.146-1.723-.85-1.99-.947-.267-.098-.462-.146-.657.146-.194.293-.755.947-.926 1.14-.17.196-.34.22-.63.074-.29-.147-1.224-.452-2.332-1.44-.862-.77-1.444-1.72-1.613-2.01-.17-.293-.018-.45.128-.596.132-.13.29-.34.437-.51.146-.17.194-.293.29-.488.097-.196.049-.366-.024-.512-.073-.146-.657-1.584-.9-2.17-.237-.57-.478-.492-.657-.5l-.56-.01c-.194 0-.512.073-.78.366-.267.293-1.022.998-1.022 2.436 0 1.437 1.046 2.827 1.192 3.02.146.195 2.06 3.15 5.005 4.414.7.302 1.246.483 1.672.618.702.223 1.34.192 1.846.117.563-.084 1.723-.703 1.966-1.383.243-.68.243-1.263.17-1.383-.073-.122-.267-.195-.56-.34z" />
      </svg>
    </a>
  );
}
