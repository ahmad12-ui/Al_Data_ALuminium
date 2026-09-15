import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { siteSettingsSchema } from "@/lib/validations";

export async function GET() {
  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(parsed.data);
  } else {
    Object.assign(settings, parsed.data);
    await settings.save();
  }
  return NextResponse.json(settings);
}
