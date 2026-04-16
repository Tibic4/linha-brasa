import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "maintenance.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const items = JSON.parse(raw);

    const active = items
      .filter((item: { active: boolean }) => item.active)
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order);

    return NextResponse.json(active);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
