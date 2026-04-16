import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export function readData<T>(file: string): T {
  const filePath = path.join(dataDir, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeData<T>(file: string, data: T): void {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
