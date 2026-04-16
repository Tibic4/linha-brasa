import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { readData, writeData } from "@/lib/data";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  poolSize: string;
  power: string;
  price: number;
  description: string;
  features: string[];
  gradient: string;
  image: string;
  active: boolean;
}

const FILE = "products.json";

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const data = readData<Product[]>(FILE);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const updates = await request.json();
  const data = readData<Product[]>(FILE);
  const index = data.findIndex((item) => item.id === updates.id);
  if (index === -1) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }
  data[index] = { ...data[index], ...updates };
  writeData(FILE, data);
  return NextResponse.json(data[index]);
}
