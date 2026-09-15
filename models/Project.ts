import mongoose, { Schema, Model, models } from "mongoose";

const ImageSchema = new Schema(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false }
);

export interface IProject extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  price?: string;
  location: string;
  date: Date;
  category: string;
  images: { public_id: string; secure_url: string; width: number; height: number }[];
  featuredImage?: { public_id: string; secure_url: string; width: number; height: number };
  featured: boolean;
  order: number;
  beforeImages: { public_id: string; secure_url: string; width: number; height: number }[];
  afterImages: { public_id: string; secure_url: string; width: number; height: number }[];
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: String },
    location: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String, required: true, index: true },
    images: { type: [ImageSchema], default: [] },
    featuredImage: { type: ImageSchema },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    beforeImages: { type: [ImageSchema], default: [] },
    afterImages: { type: [ImageSchema], default: [] },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ updatedAt: -1 });
ProjectSchema.index({ featured: -1, updatedAt: -1 });

const Project: Model<IProject> = models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
