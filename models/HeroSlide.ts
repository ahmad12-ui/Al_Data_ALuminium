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

export interface IHeroSlide extends mongoose.Document {
  title: string;
  subtitle: string;
  description: string;
  image?: { public_id: string; secure_url: string; width: number; height: number };
  buttonText: string;
  buttonLink: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: ImageSchema },
    buttonText: { type: String, default: "Explore Projects" },
    buttonLink: { type: String, default: "/projects" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

HeroSlideSchema.index({ order: 1 });

const HeroSlide: Model<IHeroSlide> =
  models.HeroSlide || mongoose.model<IHeroSlide>("HeroSlide", HeroSlideSchema);

export default HeroSlide;
