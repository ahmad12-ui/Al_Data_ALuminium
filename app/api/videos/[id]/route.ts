import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Video from "@/models/Video";
import { videoSchema } from "@/lib/validations";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const parsed = videoSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }
  const video = await Video.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(video);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const video = await Video.findById(params.id);
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (video.video?.public_id) await deleteFromCloudinary(video.video.public_id, "video");
  if (video.thumbnail?.public_id) await deleteFromCloudinary(video.thumbnail.public_id, "image");
  await Video.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
