import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { heroSlideSchema } from "@/lib/validations";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const parsed = heroSlideSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }
  const slide = await HeroSlide.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(slide);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const slide = await HeroSlide.findById(params.id);
  if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (slide.image?.public_id) await deleteFromCloudinary(slide.image.public_id, "image");
  await HeroSlide.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
