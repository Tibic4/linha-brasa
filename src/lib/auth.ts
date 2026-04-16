import { cookies } from "next/headers";

const ADMIN_TOKEN = "brasa-admin-authenticated";

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === ADMIN_TOKEN;
}

export function getTokenValue(): string {
  return ADMIN_TOKEN;
}
