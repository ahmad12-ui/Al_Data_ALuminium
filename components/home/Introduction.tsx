import { SectionHeading } from "@/components/home/SectionHeading";

export function Introduction() {
  return (
    <section className="section-container py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Who We Are" title="Designed around the way you live." />
        </div>
        <div className="lg:col-span-7 lg:pt-2">
          <p className="font-body text-lg md:text-xl text-brown-800 leading-relaxed">
            ALDATA brings together interior design, aluminium and steel craftsmanship, and
            architectural finishing under one roof. Every project starts with how a space is
            actually lived in — then we shape the materials, layout, and details around that.
          </p>
          <p className="font-body text-warm-grey mt-5 leading-relaxed">
            From kitchen cabinetry and modular kitchens to false ceilings, wardrobes, and full
            renovations, our team handles design and execution together, so what you approve on
            paper is what you get in the finished space.
          </p>
        </div>
      </div>
    </section>
  );
}
