"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavBar";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";
import { findLocalBookById, isBookRemoved } from "@/lib/bookStorage";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [book, setBook] = useState(null);
  const [fav, setFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready || !id) return;

    let alive = true;

    const local = findLocalBookById(id);
      if (local) {
        if (alive) setBook(local);
        setLoading(false);
        return;
    }

    if (isBookRemoved(id)) {
        if (alive) { setNotFound(true); setLoading(false); }
        return;
    }

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/books?id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Gagal memuat detail buku");
        if (!alive) return;
        setBook(data);
        setFav(isFavorite(data.id));
      } catch (e) {
        if (!alive) return;
        setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [id, ready]);

  const handleToggleFav = () => {
    if (!book) return;
    if (fav) {
      removeFavorite(book.id);
      setFav(false);
    } else {
      addFavorite(book);
      setFav(true);
    }
  };

  if (!ready) return null;

  return (
    <div className="bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 min-h-screen">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
          Kembali
        </button>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-80 rounded-xl bg-gray-100 animate-pulse" />
            <div className="md:col-span-2 space-y-3">
              <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-28 w-full bg-gray-100 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-10 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 w-36 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {err}
          </div>
        )}

        {/* Content */}
        {!loading && book && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-gray-100 grid place-items-center text-gray-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18" stroke="currentColor" strokeWidth="1.6"/>
                      <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M7 17l3-3 3 3 4-4 2 2" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-600 mt-1">
                {book.author ? <>by <span className="font-medium text-gray-800">{book.author}</span></> : "—"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {book.category && (
                  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {book.category}
                  </span>
                )}
              </div>

              <p className="mt-4 text-gray-800 leading-relaxed whitespace-pre-line">
                {book.description || "Tidak ada deskripsi."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleToggleFav}
                  className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition shadow-sm border ${
                    fav
                      ? "border-amber-300 bg-amber-400 text-white hover:bg-amber-500"
                      : "border-gray-300 text-gray-800 hover:bg-yellow-50 hover:border-amber-300"
                  }`}
                >
                  {fav ? "★ Hapus dari Favorit" : "☆ Tambahkan ke Favorit"}
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-800 hover:bg-red-500 hover:text-white hover:border-red-500 transition shadow-sm"
                >
                  Ke Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
