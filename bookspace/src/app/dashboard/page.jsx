"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/NavBar";
import BookCard from "@/components/book/BookCard";
import { getBooksWithOverlay, addBookLocal, removeBookLocal} from "@/lib/bookStorage";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    setReady(true);
  }, [router]);

  // const [items, setBaseBooks] = useState([]);
  const [baseBooks, setBaseBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const [formData, setFormData] = useState({ title: "", author: "", category: "", cover: "", description: "", });

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
        setBaseBooks(data.items || []);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    const t = setTimeout(load, 300);
    return () => { controller.abort(); clearTimeout(t); };
  }, [searchQuery, category, ready]);

  useEffect(() => {
    setDisplayedBooks(getBooksWithOverlay(baseBooks, { searchQuery, category }));
  }, [baseBooks, searchQuery, category]);

  const total = useMemo(() => displayedBooks.length, [displayedBooks]);

  if (!ready) return null;

  const handleAddBook = (event) => {
    event.preventDefault();
    if (!formData.title.trim()) return;
    addBookLocal(formData);
    setDisplayedBooks(getBooksWithOverlay(baseBooks, { searchQuery, category }));
    setFormData({ title: "", author: "", category: "", cover: "" });
  };

  const handleRemoveBook = (bookId) => {
    removeBookLocal(bookId);
    setDisplayedBooks(getBooksWithOverlay(baseBooks, { searchQuery, category }));
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Library</h1>
            <p className="text-sm text-gray-500">Kelola koleksi dan tambahkan buku baru.</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-96">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              {/* search icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari buku berdasarkan judul…"
              className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Add Book Card */}
        <form
          onSubmit={handleAddBook}
          className="mb-8 rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 bg-white"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tambah Buku</h2>
            <p className="text-sm text-gray-500">Lengkapi informasi singkat berikut.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Title<span className="text-red-500">*</span></span>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Atomic Habits"
                  className="rounded-lg border px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-gray-900"
                  required
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Author</span>
                <input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. James Clear"
                  className="rounded-lg border px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-gray-900"
                />
              </label>

              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Category</span>
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Self-Improvement"
                  className="rounded-lg border px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-gray-900"
                />
              </label>

              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm font-medium text-gray-700">Description</span>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan singkat buku…"
                  rows={3}
                  className="rounded-lg border px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 text-gray-900 resize-y"
                />
                <span className="text-xs text-gray-500 self-end">
                  {(formData.description?.length || 0)}/200
                </span>
              </label>
            </div>

            {/* Cover uploader */}
            <div className="lg:col-span-1">
              <label className="text-sm font-medium text-gray-700">Cover</label>
              <div className="mt-2">
                <label
                  htmlFor="cover"
                  className="group block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 text-center hover:border-blue-400 transition"
                >
                  {formData.cover ? (
                    <div className="relative mx-auto w-40 h-56 overflow-hidden rounded-lg shadow">
                      <img src={formData.cover} alt="Cover preview" className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 text-xs bg-black/40 text-white py-1">Ganti Cover</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 16V8m0 0-3 3m3-3 3 3M4 16.5V7a2 2 0 0 1 2-2h8.5" stroke="currentColor" strokeWidth="1.6" />
                        <rect x="6" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                      <span className="text-sm">Pilih file gambar</span>
                      <span className="text-xs">PNG/JPG, maks ~2MB</span>
                    </div>
                  )}
                  <input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => setFormData({ ...formData, cover: reader.result });
                      reader.readAsDataURL(file);
                      e.target.value = null;
                    }}
                    className="sr-only"
                  />
                </label>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600 transition shadow-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ title: "", author: "", category: "", description: "", cover: "" })
                    }
                    className="rounded-lg px-3 py-2 border border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {loading ? "Memuat..." : `${total} buku ditemukan`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl border animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : displayedBooks.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {displayedBooks.map((book) => (
              <div key={book.id} className="relative group">
                <BookCard book={book} />
                <button
                  onClick={() => handleRemoveBook(book.id)}
                  className="absolute top-2 right-2 rounded-md bg-red-500/90 hover:bg-red-600 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                  title="Delete (local)"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
            Belum ada buku yang cocok dengan pencarian. Coba tambah buku di atas.
          </div>
        )}
      </main>
    </div>
  );
}
