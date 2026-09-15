import { Lightbulb, Gem, Users, Clock, HeartHandshake } from "lucide-react";
import { SectionHeading } from "@/components/home/SectionHeading";

const REASONS = [
  { title: "Creative Designs", body: "Considered layouts and finishes tailored to each space.", Icon: Lightbulb },
  { title: "Premium Quality", body: "Materials and craftsmanship chosen to last.", Icon: Gem },
  { title: "Expert Team", body: "Designers and fabricators working in step with each other.", Icon: Users },
  { title: "On-Time Delivery", body: "Projects planned and executed to a clear timeline.", Icon: Clock },
  { title: "Complete Satisfaction", body: "We stay involved until the space is exactly right.", Icon: HeartHandshake },
];

export function WhyAldata() {
  return (
    <section className="section-container py-20 md:py-28">
      <SectionHeading eyebrow="Why ALDATA" title="Built on Care and Craft" align="center" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-16">
        {REASONS.map(({ title, body, Icon }) => (
          <div key={title} className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-brown-300 rounded-full">
              <Icon className="h-6 w-6 text-brown-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg text-brown-900">{title}</h3>
            <p className="font-body text-sm text-warm-grey mt-2 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
