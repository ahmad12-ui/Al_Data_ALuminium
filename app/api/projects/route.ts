import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ featured: -1, order: 1, updatedAt: -1 }).lean();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await Project.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const project = await Project.create({
    ...parsed.data,
    slug,
    featuredImage: parsed.data.featuredImage || parsed.data.images[0],
  });

  return NextResponse.json(project, { status: 201 });
}
