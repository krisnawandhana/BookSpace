"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavBar";
import FavoriteCard from "@/components/book/FavoriteCard";
import { useFavorites } from "@/hooks/useFavorite";

export default function FavoritesPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    setReady(true);
  }, [router]);

  const { items, removeOne, clearAll } = useFavorites();

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end mb-4">
          {items.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-2 rounded border bg-red-500 text-white hover:bg-red-600"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded border bg-white p-6 text-center text-gray-600">
            Belum ada buku favorit. Tambahkan dari halaman Detail buku.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {items.map((b) => (
              <FavoriteCard key={b.id} book={b} onRemove={removeOne} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
