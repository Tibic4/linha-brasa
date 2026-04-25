import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Auth admin baseado em HMAC-SHA256.
 *
 * Token = base64url( hmac(ADMIN_AUTH_SECRET, expiresAt) ) + "." + expiresAt
 *
 * Vantagem sobre string estática:
 *  - Sem segredo no código → não vaza em GitHub público
 *  - Expira automaticamente
 *  - Comparação timing-safe contra side-channel
 */

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

function getSecret(): string {
  const s = process.env.ADMIN_AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error("ADMIN_AUTH_SECRET ausente ou < 32 chars");
  }
  return s;
}

function sign(expiresAt: number): string {
  const sig = createHmac("sha256", getSecret())
    .update(String(expiresAt))
    .digest("base64url");
  return `${sig}.${expiresAt}`;
}

export function issueToken(): string {
  return sign(Date.now() + TOKEN_TTL_MS);
}

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("admin_token")?.value;
  if (!raw) return false;

  const dot = raw.lastIndexOf(".");
  if (dot < 0) return false;

  const providedSig = raw.slice(0, dot);
  const expiresAtStr = raw.slice(dot + 1);
  const expiresAt = Number(expiresAtStr);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  let expected: string;
  try {
    expected = createHmac("sha256", getSecret())
      .update(String(expiresAt))
      .digest("base64url");
  } catch {
    return false;
  }

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
