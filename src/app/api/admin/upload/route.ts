import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { verifyAdmin } from "@/lib/auth";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(name: string): string {
  // Mantém só alfa-numérico, ponto, traço, underline. Sem path traversal.
  const base = name.split(/[\\/]/).pop() ?? "file";
  return base.toLowerCase().replace(/[^a-z0-9._-]/g, "_").slice(0, 80);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo de arquivo não permitido (apenas JPEG, PNG, WebP)" },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Arquivo maior que 5MB" },
      { status: 413 }
    );
  }

  const safe = sanitizeFilename(file.name);
  const blob = await put(`testimonials/${Date.now()}-${safe}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ success: true });
}
