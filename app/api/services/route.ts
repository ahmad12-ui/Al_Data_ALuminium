import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 }).lean();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await Service.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const service = await Service.create({ ...parsed.data, slug });
  return NextResponse.json(service, { status: 201 });
}
