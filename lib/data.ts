import "server-only";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Video from "@/models/Video";
import FAQ from "@/models/FAQ";
import HeroSlide from "@/models/HeroSlide";

/** Serializes a Mongoose document to a plain JSON-safe object for Server -> Client passing. */
function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

function warn(fn: string, err: unknown) {
  console.warn(`lib/data.ts:${fn} — falling back to empty result —`, (err as Error).message);
}

// ---------- Hero Slides ----------
export async function getActiveHeroSlides() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
    return toPlain(slides);
  } catch (err) {
    warn("getActiveHeroSlides", err);
    return [];
  }
}

export async function getAllHeroSlides() {
  try {
    await connectDB();
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
    return toPlain(slides);
  } catch (err) {
    warn("getAllHeroSlides", err);
    return [];
  }
}

// ---------- Projects ----------
export async function getPortfolioProjects(limit = 10) {
  try {
    await connectDB();
    const projects = await Project.find()
      .sort({ featured: -1, order: 1, updatedAt: -1 })
      .limit(limit)
      .lean();
    return toPlain(projects);
  } catch (err) {
    warn("getPortfolioProjects", err);
    return [];
  }
}

export async function getFeaturedProjects(limit = 5) {
  try {
    await connectDB();
    const projects = await Project.find({ featured: true })
      .sort({ order: 1, updatedAt: -1 })
      .limit(limit)
      .lean();
    if (projects.length >= limit) return toPlain(projects);

    const more = await Project.find({ featured: { $ne: true } })
      .sort({ updatedAt: -1 })
      .limit(limit - projects.length)
      .lean();
    return toPlain([...projects, ...more]);
  } catch (err) {
    warn("getFeaturedProjects", err);
    return [];
  }
}

export async function getAllProjects(category?: string) {
  try {
    await connectDB();
    const filter = category && category !== "All" ? { category } : {};
    const projects = await Project.find(filter).sort({ featured: -1, updatedAt: -1 }).lean();
    return toPlain(projects);
  } catch (err) {
    warn("getAllProjects", err);
    return [];
  }
}

export async function getProjectCategories() {
  try {
    await connectDB();
    const categories = await Project.distinct("category");
    return categories.filter(Boolean).sort();
  } catch (err) {
    warn("getProjectCategories", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    await connectDB();
    const project = await Project.findOne({ slug }).lean();
    return project ? toPlain(project) : null;
  } catch (err) {
    warn("getProjectBySlug", err);
    return null;
  }
}

export async function getRelatedProjects(category: string, excludeSlug: string, limit = 3) {
  try {
    await connectDB();
    const projects = await Project.find({ category, slug: { $ne: excludeSlug } })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
    return toPlain(projects);
  } catch (err) {
    warn("getRelatedProjects", err);
    return [];
  }
}

export async function getAllProjectSlugs() {
  try {
    await connectDB();
    const projects = await Project.find({}, "slug updatedAt").lean();
    return toPlain(projects);
  } catch (err) {
    warn("getAllProjectSlugs", err);
    return [];
  }
}

// ---------- Services ----------
export async function getFeaturedServices(limit = 8) {
  try {
    await connectDB();
    const services = await Service.find({ featured: true }).sort({ order: 1 }).limit(limit).lean();
    if (services.length >= limit) return toPlain(services);
    const more = await Service.find({ featured: { $ne: true } })
      .sort({ order: 1 })
      .limit(limit - services.length)
      .lean();
    return toPlain([...services, ...more]);
  } catch (err) {
    warn("getFeaturedServices", err);
    return [];
  }
}

export async function getAllServices() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1 }).lean();
    return toPlain(services);
  } catch (err) {
    warn("getAllServices", err);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    await connectDB();
    const service = await Service.findOne({ slug }).lean();
    return service ? toPlain(service) : null;
  } catch (err) {
    warn("getServiceBySlug", err);
    return null;
  }
}

export async function getAllServiceSlugs() {
  try {
    await connectDB();
    const services = await Service.find({}, "slug updatedAt").lean();
    return toPlain(services);
  } catch (err) {
    warn("getAllServiceSlugs", err);
    return [];
  }
}

// ---------- Videos ----------
export async function getLatestVideos(limit = 6) {
  try {
    await connectDB();
    const videos = await Video.find().sort({ featured: -1, order: 1, createdAt: -1 }).limit(limit).lean();
    return toPlain(videos);
  } catch (err) {
    warn("getLatestVideos", err);
    return [];
  }
}

export async function getAllVideos() {
  try {
    await connectDB();
    const videos = await Video.find().sort({ featured: -1, order: 1, createdAt: -1 }).lean();
    return toPlain(videos);
  } catch (err) {
    warn("getAllVideos", err);
    return [];
  }
}

// ---------- FAQs ----------
export async function getPublishedFaqs() {
  try {
    await connectDB();
    const faqs = await FAQ.find({ published: true }).sort({ order: 1 }).lean();
    return toPlain(faqs);
  } catch (err) {
    warn("getPublishedFaqs", err);
    return [];
  }
}

export async function getAllFaqs() {
  try {
    await connectDB();
    const faqs = await FAQ.find().sort({ order: 1 }).lean();
    return toPlain(faqs);
  } catch (err) {
    warn("getAllFaqs", err);
    return [];
  }
}

// ---------- Dashboard counts ----------
export async function getDashboardStats() {
  try {
    await connectDB();
    const [projects, services, videos, faqs, heroSlides] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Video.countDocuments(),
      FAQ.countDocuments(),
      HeroSlide.countDocuments(),
    ]);
    const [latestProjects, latestVideos] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).limit(5).lean(),
      Video.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);
    return {
      counts: { projects, services, videos, faqs, heroSlides },
      latestProjects: toPlain(latestProjects),
      latestVideos: toPlain(latestVideos),
    };
  } catch (err) {
    warn("getDashboardStats", err);
    return {
      counts: { projects: 0, services: 0, videos: 0, faqs: 0, heroSlides: 0 },
      latestProjects: [],
      latestVideos: [],
    };
  }
}
