import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";
import { videoSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const videos = await Video.find().sort({ featured: -1, order: 1, createdAt: -1 }).lean();
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await Video.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const video = await Video.create({ ...parsed.data, slug });
  return NextResponse.json(video, { status: 201 });
}
