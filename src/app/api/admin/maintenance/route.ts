import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/data";

interface Maintenance {
  id: string;
  icon: string;
  title: string;
  description: string;
  frequency: string;
  order: number;
  active: boolean;
}

const FILE = "maintenance.json";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const data = readData<Maintenance[]>(FILE);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const body = await request.json();
  const data = readData<Maintenance[]>(FILE);
  const newItem: Maintenance = { ...body, id: Date.now().toString(36), active: true };
  data.push(newItem);
  writeData(FILE, data);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const updates = await request.json();
  const data = readData<Maintenance[]>(FILE);
  const index = data.findIndex((item) => item.id === updates.id);
  if (index === -1) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }
  data[index] = { ...data[index], ...updates };
  writeData(FILE, data);
  return NextResponse.json(data[index]);
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await request.json();
  const data = readData<Maintenance[]>(FILE);
  const filtered = data.filter((item) => item.id !== id);
  if (filtered.length === data.length) {
    return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
  }
  writeData(FILE, filtered);
  return NextResponse.json({ success: true });
}
