"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavBar";
import BookCard from "@/components/book/BookCard";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    setReady(true);
  }, [router]);

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("searchQuery", searchQuery);
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
    
    const t = setTimeout(load, 300);
    return () => { controller.abort(); clearTimeout(t); };
  }, [searchQuery, category, ready]);

  const total = useMemo(() => items.length, [items]);

  if (!ready) return null;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto my-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari buku berdasarkan judul..."
            className="flex-1 rounded border px-3 py-2 outline-none focus:ring text-gray-900"
          />
        </div>

        {/* Info */}
        <div className="text-sm text-gray-600 mb-3">
          {loading ? "Memuat..." : `${total} buku ditemukan`}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
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
