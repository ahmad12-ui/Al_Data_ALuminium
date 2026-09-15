import mongoose, { Schema, Model, models } from "mongoose";

export interface IFAQ extends mongoose.Document {
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const FAQ: Model<IFAQ> = models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);

export default FAQ;
