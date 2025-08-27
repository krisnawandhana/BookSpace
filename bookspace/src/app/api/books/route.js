import { NextResponse } from "next/server";
import { books } from "@/lib/mockAPI";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = (searchParams.get("category") || "").toLowerCase();

  if (id) {
    const found = books.find((b) => b.id === id);
    if (!found) return NextResponse.json({ message: "Buku tidak ditemukan" }, { status: 404 });
    return NextResponse.json(found);
  }

  let data = [...books];

  if (q) {
    data = data.filter((b) => b.title.toLowerCase().includes(q));
  }

  if (category && category !== "all") {
    data = data.filter((b) => b.category.toLowerCase() === category);
  }

  return NextResponse.json({ items: data, total: data.length });
}
