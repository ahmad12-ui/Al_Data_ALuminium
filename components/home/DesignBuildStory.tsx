"use client";

import { motion } from "framer-motion";
import { PenTool, HardHat, Sparkles } from "lucide-react";

// Note: this section intentionally uses brand-toned placeholder panels rather than
// stock photography — no client images were supplied beyond the logo. Once ALDATA
// uploads real process photography through the admin panel (e.g. attached to a
// featured project), swap these panels for <Image> tags pointing at those Cloudinary URLs.
const STEPS = [
  {
    tag: "Design",
    title: "Every space starts with a conversation.",
    body: "We listen to how you use your home or business, then translate that into a considered layout, material palette, and lighting plan.",
    Icon: PenTool,
  },
  {
    tag: "Build",
    title: "Craftsmanship in aluminium, steel, and wood.",
    body: "Our in-house teams fabricate and install aluminium, steel, and cabinetry work with the same precision the design called for.",
    Icon: HardHat,
  },
  {
    tag: "Transform",
    title: "A space that feels entirely yours.",
    body: "The result is an interior that fits how you actually live and work — finished, functional, and built to last.",
    Icon: Sparkles,
  },
];

export function DesignBuildStory() {
  return (
    <section className="bg-brown-950 py-20 md:py-28">
      <div className="section-container space-y-20 md:space-y-28">
        {STEPS.map((step, i) => (
          <div
            key={step.tag}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brown-800 to-brown-950 border border-brown-800 flex items-center justify-center"
            >
              <step.Icon className="h-16 w-16 text-brown-500" strokeWidth={1.25} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <p className="eyebrow text-brown-400 mb-4">{step.tag}</p>
              <h3 className="font-display text-3xl md:text-4xl text-cream leading-tight">{step.title}</h3>
              <p className="font-body text-brown-200 mt-5 leading-relaxed max-w-md">{step.body}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
