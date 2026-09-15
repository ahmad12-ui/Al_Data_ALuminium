import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createAdminSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const { allowed } = checkRateLimit(`login:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the admin access code." }, { status: 400 });
  }

  const success = await createAdminSession(parsed.data.code);
  if (!success) {
    return NextResponse.json({ error: "Incorrect access code." }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
