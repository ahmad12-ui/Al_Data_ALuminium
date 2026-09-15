import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { heroSlideSchema } from "@/lib/validations";

export async function GET() {
  await connectDB();
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 }).lean();
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = heroSlideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }
  const slide = await HeroSlide.create(parsed.data);
  return NextResponse.json(slide, { status: 201 });
}
