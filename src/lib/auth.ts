import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Simple password gate for the local-data phase.
 *
 * When Supabase Auth is introduced, only this file needs to change:
 * keep the exported function signatures identical and swap the
 * implementations for Supabase session checks.
 */

const COOKIE_NAME = "ls_admin";
const SESSION_VALUE_PREFIX = "admin.";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "ls-admin-dev";
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-secret";
}

function expectedSessionValue(): string {
  const hmac = createHmac("sha256", sessionSecret())
    .update(SESSION_VALUE_PREFIX)
    .digest("hex");
  return `${SESSION_VALUE_PREFIX}${hmac}`;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function verifyPassword(password: string): Promise<boolean> {
  return safeEqual(password, adminPassword());
}

/** Set the httpOnly admin session cookie. Call from a Server Action only. */
export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, expectedSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Clear the admin session cookie. Call from a Server Action only. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return safeEqual(value, expectedSessionValue());
}
