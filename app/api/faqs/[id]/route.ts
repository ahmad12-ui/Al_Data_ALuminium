import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { faqSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const parsed = faqSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }
  const faq = await FAQ.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(faq);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const faq = await FAQ.findByIdAndDelete(params.id);
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
