import { connectDB } from "@/lib/mongodb";
import SiteSettings, { ISiteSettings } from "@/models/SiteSettings";

const DEFAULT_SETTINGS = {
  businessName: "ALDATA",
  tagline: "We Don't Just Design, We Create Experiences.",
  secondaryTagline: "Designing Spaces, Defining Lifestyles.",
  phone: "03048762936",
  email: "usmanhafizusman416@gmail.com",
  whatsapp: "923048762936",
  locations: [
    { label: "Dahrki", address: "Near Hira Public School, Dahrki" },
    { label: "Sadiqabad (Main Branch)", address: "Near WAPDA Dafat, Chowk Lakar Mandi, Sadiqabad" },
  ],
  socialLinks: {},
  googleMaps: {},
  footerText: "Designing Spaces, Defining Lifestyles.",
} as unknown as ISiteSettings;

/**
 * Fetches (or lazily creates) the singleton SiteSettings document.
 * Falls back to sensible defaults if the database is unreachable, so the
 * public site (and the build) never hard-fails just because of a transient
 * or not-yet-configured MONGODB_URI.
 */
export async function getSiteSettings(): Promise<ISiteSettings> {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return settings;
  } catch (err) {
    console.warn("getSiteSettings: falling back to defaults —", (err as Error).message);
    return DEFAULT_SETTINGS;
  }
}
