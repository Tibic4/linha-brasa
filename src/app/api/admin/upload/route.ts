import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const blob = await put(`testimonials/${Date.now()}-${file.name}`, file, {
    access: "public",
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
