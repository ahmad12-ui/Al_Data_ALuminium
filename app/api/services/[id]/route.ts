import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const existing = await Service.findById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.name && parsed.data.name !== existing.name) {
    const baseSlug = slugify(parsed.data.name);
    let slug = baseSlug;
    let counter = 1;
    while (await Service.findOne({ slug, _id: { $ne: params.id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    update.slug = slug;
  }

  const service = await Service.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const service = await Service.findById(params.id);
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (service.image?.public_id) await deleteFromCloudinary(service.image.public_id, "image");
  await Service.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
