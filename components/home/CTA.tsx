import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA({ phone }: { phone: string }) {
  return (
    <section className="bg-brown-900 py-24 md:py-32">
      <div className="section-container text-center">
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-cream leading-[1.1] max-w-4xl mx-auto">
          Let&rsquo;s create a space that feels like you.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button asChild size="lg" variant="light">
            <Link href="/contact">Start Your Project</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-cream text-cream hover:bg-cream hover:text-brown-900">
            <a href={`tel:${phone}`}>
              <Phone className="h-4 w-4" /> Call {phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
