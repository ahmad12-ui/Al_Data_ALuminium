import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "aldata_admin_session";

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/") &&
    ["/api/projects", "/api/services", "/api/videos", "/api/faqs", "/api/hero-slides", "/api/settings", "/api/upload"].some(
      (p) => pathname.startsWith(p)
    );

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const valid = await isValidSession(token);

    if (!valid) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
