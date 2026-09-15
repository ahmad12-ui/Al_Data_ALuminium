import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const project = await Project.findById(params.id).lean();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const parsed = projectSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const existing = await Project.findById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const update: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.name && parsed.data.name !== existing.name) {
    const baseSlug = slugify(parsed.data.name);
    let slug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ slug, _id: { $ne: params.id } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    update.slug = slug;
  }

  if (parsed.data.images && parsed.data.images.length > 0 && !parsed.data.featuredImage) {
    update.featuredImage = parsed.data.images[0];
  }

  const project = await Project.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const project = await Project.findById(params.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allImages = [
    ...project.images,
    ...(project.beforeImages || []),
    ...(project.afterImages || []),
  ];
  await Promise.all(allImages.map((img) => deleteFromCloudinary(img.public_id, "image")));

  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
