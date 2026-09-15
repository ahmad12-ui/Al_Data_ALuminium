import mongoose, { Schema, Model, models } from "mongoose";

const VideoAssetSchema = new Schema(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    resource_type: { type: String, default: "video" },
    duration: { type: Number },
  },
  { _id: false }
);

const ImageSchema = new Schema(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false }
);

export interface IVideo extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  video?: { public_id: string; secure_url: string; resource_type: string; duration?: number };
  thumbnail?: { public_id: string; secure_url: string; width: number; height: number };
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    video: { type: VideoAssetSchema },
    thumbnail: { type: ImageSchema },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Video: Model<IVideo> = models.Video || mongoose.model<IVideo>("Video", VideoSchema);

export default Video;
