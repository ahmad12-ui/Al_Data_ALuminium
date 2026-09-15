/**
 * Seeds ALDATA's initial site settings, services, and FAQs.
 * Run with: npm run seed
 *
 * Intentionally does NOT create demo projects, testimonials, or statistics —
 * the brief is explicit that fabricated client work must never be presented
 * as real. Add real projects through /admin/projects once this is live.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../models/Service";
import FAQ from "../models/FAQ";
import SiteSettings from "../models/SiteSettings";
import { slugify } from "../lib/utils";

dotenv.config({ path: ".env.local" });

const SERVICES = [
  "Interior Designing",
  "Aluminium Work",
  "Steel Work",
  "Kitchen Cabinet",
  "Swimming Pool",
  "Fiber Glass Doors",
  "Wallpaper",
  "False Ceiling & Lighting",
  "Wardrobes",
  "Renovation & Remodeling",
  "Modular Kitchens",
  "Wall Finishes & Paint",
];

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  "Interior Designing": "Complete interior design for homes and commercial spaces, from concept to finished layout.",
  "Aluminium Work": "Aluminium doors, windows, partitions, and structural framing built to measure.",
  "Steel Work": "Steel gates, railings, staircases, and structural steel fabrication.",
  "Kitchen Cabinet": "Custom kitchen cabinetry designed around your layout and storage needs.",
  "Swimming Pool": "Swimming pool construction and finishing for residential and commercial properties.",
  "Fiber Glass Doors": "Durable, weather-resistant fiber glass doors in a range of finishes.",
  "Wallpaper": "Wallpaper supply and installation to refresh any interior space.",
  "False Ceiling & Lighting": "False ceiling design with integrated lighting for a polished, finished look.",
  "Wardrobes": "Built-in and modular wardrobes tailored to your bedroom or dressing area.",
  "Renovation & Remodeling": "Full renovation and remodeling for homes and commercial spaces.",
  "Modular Kitchens": "Modern modular kitchen systems combining function and design.",
  "Wall Finishes & Paint": "Decorative wall finishes and professional painting services.",
};

const FAQS = [
  { question: "What services does ALDATA provide?", answer: "ALDATA provides interior designing, aluminium and steel work, kitchen cabinets, swimming pools, fiber glass doors, wallpaper, false ceilings, wardrobes, renovation, modular kitchens, and wall finishes." },
  { question: "Do you provide complete interior design?", answer: "Yes, we handle full interior design projects from initial concept through to final execution." },
  { question: "Do you provide aluminium and steel work?", answer: "Yes, our in-house team fabricates and installs aluminium and steel work including doors, windows, gates, and railings." },
  { question: "Do you provide kitchen cabinets?", answer: "Yes, we design and build custom kitchen cabinets and modular kitchens tailored to your space." },
  { question: "Do you provide renovation services?", answer: "Yes, we offer full renovation and remodeling services for homes and commercial spaces." },
  { question: "How can I request a quotation?", answer: "You can reach out via the Contact page, WhatsApp, or call us directly to discuss your project and receive a quotation." },
  { question: "Which locations do you serve?", answer: "We operate from our main branch in Sadiqabad and also serve clients in Dahrki." },
  { question: "How can I contact ALDATA?", answer: "You can call or WhatsApp us at 03048762936, email usmanhafizusman416@gmail.com, or use the contact form on our website." },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local before seeding.");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  // Site Settings (create if missing)
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({});
    console.log("Created default site settings.");
  } else {
    console.log("Site settings already exist — skipped.");
  }

  // Services
  for (let i = 0; i < SERVICES.length; i++) {
    const name = SERVICES[i];
    const slug = slugify(name);
    const exists = await Service.findOne({ slug });
    if (exists) continue;
    await Service.create({
      name,
      slug,
      description: SERVICE_DESCRIPTIONS[name] || `${name} services from ALDATA.`,
      featured: i < 8,
      order: i,
    });
  }
  console.log(`Seeded ${SERVICES.length} services (skipping any that already existed).`);

  // FAQs
  for (let i = 0; i < FAQS.length; i++) {
    const { question, answer } = FAQS[i];
    const exists = await FAQ.findOne({ question });
    if (exists) continue;
    await FAQ.create({ question, answer, order: i, published: true });
  }
  console.log(`Seeded ${FAQS.length} FAQs (skipping any that already existed).`);

  console.log("\nSeed complete. No demo projects, testimonials, or statistics were created —");
  console.log("add real project entries through /admin/projects once the site is live.");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
