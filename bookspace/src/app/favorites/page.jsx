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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
            <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700 bg-gray-50">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Yakin hapus semua buku favorit?")) clearAll();
              }}
              className="inline-flex items-center justify-center rounded-lg bg-red-500 text-white px-4 py-2 font-medium hover:bg-red-600 transition shadow-sm"
            >
              Remove All
            </button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 21c4.5-3.6 7.5-6.7 7.5-10.3A4.7 4.7 0 0 0 12 7.1 4.7 4.7 0 0 0 4.5 10.7C4.5 14.3 7.5 17.4 12 21Z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Belum ada buku favorit</p>
            <p className="text-sm text-gray-500">Tambahkan dari halaman Detail buku.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {items.map((b) => (
              <div key={b.id} className="relative group">
                <FavoriteCard book={b} onRemove={removeOne} />
                <button
                  onClick={() => removeOne(b.id)}
                  className="absolute top-2 right-2 rounded-md bg-red-500/90 hover:bg-red-600 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                  title="Hapus dari favorit"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
