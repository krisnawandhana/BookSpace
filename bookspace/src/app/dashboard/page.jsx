"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavBar";
import BookCard from "@/components/book/BookCard";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Fiction", value: "fiction" },
  { label: "Thriller", value: "thriller" },
  { label: "Manga", value: "manga" },
  { label: "Psychological", value: "psychological" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    setReady(true);
  }, [router]);

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      const url = `/api/books${params.toString() ? `?${params.toString()}` : ""}`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Gagal memuat buku");
        setItems(data.items || []);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    }
    // kecilkan frekuensi request saat mengetik (debounce 300ms)
    const t = setTimeout(load, 300);
    return () => { controller.abort(); clearTimeout(t); };
  }, [q, category, ready]);

  const total = useMemo(() => items.length, [items]);

  if (!ready) return null;

  return (
    <div className="bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto my-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari buku berdasarkan judul..."
            className="flex-1 rounded border px-3 py-2 outline-none focus:ring text-gray-900"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded border px-3 py-2 text-gray-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-600 mb-3">
          {loading ? "Memuat..." : `${total} buku ditemukan`}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg border animate-pulse bg-gray-100" />
              ))
            : items.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </main>
    </div>
  );
}
