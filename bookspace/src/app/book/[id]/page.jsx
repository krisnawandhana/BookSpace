"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavBar";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";

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
    <div className="bg-white ">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 min-h-screen">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          ← Kembali
        </button>

        {loading && <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />}

        {!loading && err && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
            {err}
          </div>
        )}

        {!loading && book && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover */}
            <div className="md:col-span-1">
              {/* jika ingin gambar tanpa crop dan proporsional */}
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-auto object-contain rounded-lg border"
              />
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold text-black">{book.title}</h1>
              <p className="text-gray-600 mt-1">by {book.author}</p>
              <span className="mt-2 inline-block text-xs uppercase tracking-wide text-blue-600">
                {book.category}
              </span>

              <p className="mt-4 text-gray-800 leading-relaxed">
                {book.description}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleToggleFav}
                  className={`px-4 py-2 rounded text-gray-700 border hover:shadow ${
                    fav ? "border-yellow-300 bg-amber-400 text-white" : " hover:bg-yellow-100 hover:text-amber-400"
                  }`}
                >
                  {fav ? "★ Hapus dari Favorit" : "☆ Tambahkan ke Favorit"}
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-300"
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
