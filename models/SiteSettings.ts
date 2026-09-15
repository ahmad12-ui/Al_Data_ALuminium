import mongoose, { Schema, Model, models } from "mongoose";

export interface ISiteSettings extends mongoose.Document {
  businessName: string;
  tagline: string;
  secondaryTagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  locations: { label: string; address: string }[];
  socialLinks: { instagram?: string; facebook?: string; youtube?: string };
  googleMaps: { dahrki?: string; sadiqabad?: string };
  footerText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "ALDATA" },
    tagline: { type: String, default: "We Don't Just Design, We Create Experiences." },
    secondaryTagline: { type: String, default: "Designing Spaces, Defining Lifestyles." },
    phone: { type: String, default: "03048762936" },
    email: { type: String, default: "usmanhafizusman416@gmail.com" },
    whatsapp: { type: String, default: "923048762936" },
    locations: {
      type: [{ label: String, address: String }],
      default: [
        { label: "Dahrki", address: "Near Hira Public School, Dahrki" },
        {
          label: "Sadiqabad (Main Branch)",
          address: "Near WAPDA Dafat, Chowk Lakar Mandi, Sadiqabad",
        },
      ],
    },
    socialLinks: {
      type: { instagram: String, facebook: String, youtube: String },
      default: {},
    },
    googleMaps: {
      type: { dahrki: String, sadiqabad: String },
      default: {},
    },
    footerText: {
      type: String,
      default: "Designing Spaces, Defining Lifestyles.",
    },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
