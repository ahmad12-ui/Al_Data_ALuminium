import { SectionHeading } from "@/components/home/SectionHeading";

const STEPS = [
  { n: "01", title: "Consultation", body: "We visit or discuss your space, goals, and budget." },
  { n: "02", title: "Concept & Design", body: "Layouts, materials, and a visual direction are developed." },
  { n: "03", title: "Planning & Materials", body: "Detailed scope, materials, and timeline are finalised." },
  { n: "04", title: "Execution", body: "Our fabrication and installation teams bring the design to site." },
  { n: "05", title: "Final Transformation", body: "A walkthrough, finishing touches, and handover of the space." },
];

export function Process() {
  return (
    <section className="bg-offwhite py-20 md:py-28">
      <div className="section-container">
        <SectionHeading eyebrow="How We Work" title="Our Process" align="center" />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative">
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-brown-300" />
          {STEPS.map((step) => (
            <div key={step.n} className="relative text-center md:text-left">
              {/* brown-300 on offwhite measured at 2.4:1 — fails WCAG AA even at
                  large-text size (needs 3:1). brown-500 passes at 4.6:1 while
                  staying in the same warm-brown family, no visible design change. */}
              <span className="font-display text-4xl text-brown-500 block mb-4 md:mb-6 relative z-10 bg-offwhite md:inline-block md:pr-4">
                {step.n}
              </span>
              <h3 className="font-display text-xl text-brown-900">{step.title}</h3>
              <p className="font-body text-sm text-warm-grey mt-2 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
