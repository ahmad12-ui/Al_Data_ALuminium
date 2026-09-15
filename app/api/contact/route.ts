import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid submission." },
        { status: 400 }
      );
    }

    await sendContactEmail(parsed.data);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
