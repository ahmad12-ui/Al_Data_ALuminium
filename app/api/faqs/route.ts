import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { faqSchema } from "@/lib/validations";

export async function GET() {
  await connectDB();
  const faqs = await FAQ.find().sort({ order: 1 }).lean();
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }
  const faq = await FAQ.create(parsed.data);
  return NextResponse.json(faq, { status: 201 });
}
