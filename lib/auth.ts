import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "aldata_admin_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 hours, in seconds

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Validates the submitted code against ADMIN_SECRET_CODE (server-only env var)
 * and, if correct, issues a signed HTTP-only session cookie.
 * This must only ever be called from a server action or route handler.
 */
export async function createAdminSession(code: string): Promise<boolean> {
  const expected = process.env.ADMIN_SECRET_CODE;
  if (!expected || code !== expected) {
    return false;
  }

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecretKey());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  return true;
}

export async function destroyAdminSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function verifyAdminSession(token?: string): Promise<boolean> {
  const jwt = token ?? cookies().get(SESSION_COOKIE)?.value;
  if (!jwt) return false;

  try {
    const { payload } = await jwtVerify(jwt, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
