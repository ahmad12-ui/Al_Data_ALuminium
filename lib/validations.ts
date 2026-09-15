import { z } from "zod";

const imageAssetSchema = z.object({
  public_id: z.string().min(1),
  secure_url: z.string().url(),
  width: z.number(),
  height: z.number(),
});

export const projectSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Please add a fuller description"),
  price: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(2, "Category is required"),
  images: z.array(imageAssetSchema).min(1, "At least one image is required"),
  featuredImage: imageAssetSchema.optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  beforeImages: z.array(imageAssetSchema).default([]),
  afterImages: z.array(imageAssetSchema).default([]),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const serviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Please add a fuller description"),
  image: imageAssetSchema.optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const videoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is required"),
  video: z
    .object({
      public_id: z.string(),
      secure_url: z.string().url(),
      resource_type: z.string(),
      duration: z.number().optional(),
    })
    .optional(),
  thumbnail: imageAssetSchema.optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});
export type VideoInput = z.infer<typeof videoSchema>;

export const faqSchema = z.object({
  question: z.string().min(5, "Question is required"),
  answer: z.string().min(5, "Answer is required"),
  order: z.number().default(0),
  published: z.boolean().default(true),
});
export type FaqInput = z.infer<typeof faqSchema>;

export const heroSlideSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: imageAssetSchema.optional(),
  buttonText: z.string().default("Explore Projects"),
  buttonLink: z.string().default("/projects"),
  order: z.number().default(0),
  active: z.boolean().default(true),
});
export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1),
  tagline: z.string().min(1),
  secondaryTagline: z.string().optional().default(""),
  phone: z.string().min(6),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  locations: z.array(z.object({ label: z.string(), address: z.string() })),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
  }),
  googleMaps: z.object({
    dahrki: z.string().optional(),
    sadiqabad: z.string().optional(),
  }),
  footerText: z.string().optional().default(""),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  service: z.string().optional(),
  message: z.string().min(10, "Please add a short message"),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const loginSchema = z.object({
  code: z.string().min(1, "Enter the admin access code"),
});
