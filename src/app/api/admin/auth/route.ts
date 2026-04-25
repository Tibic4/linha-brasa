import { NextResponse } from "next/server";
import { issueToken } from "@/lib/auth";
import { timingSafeEqual } from "crypto";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password: unknown = body?.password;

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "Auth não configurada" }, { status: 500 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  // Comparação timing-safe (evita brute-force por side-channel)
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", issueToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}

export async function GET() {
  const { verifyAdmin } = await import("@/lib/auth");
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_token");
  return response;
}
