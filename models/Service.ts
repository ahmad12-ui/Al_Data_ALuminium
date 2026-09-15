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

export interface IService extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  image?: { public_id: string; secure_url: string; width: number; height: number };
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    image: { type: ImageSchema },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ order: 1 });

const Service: Model<IService> = models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
