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
      <main className="max-w-7xl mx-auto my-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari buku berdasarkan judul..."
            className="flex-1 rounded border px-3 py-2 outline-none focus:ring text-gray-900"
          />
        </div>

        <form onSubmit={handleAddBook} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title*"
              className="rounded border px-3 py-2 outline-none focus:ring text-gray-900"
              required
            />
            <input
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author"
              className="rounded border px-3 py-2 outline-none focus:ring text-gray-900"
            />
            <input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Category"
              className="rounded border px-3 py-2 outline-none focus:ring text-gray-900"
            />
            <input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              className="rounded border px-3 py-2 outline-none focus:ring text-gray-900"
            />
            <div className="flex gap-2">
              <label
                htmlFor="cover"
                className="cursor-pointer rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
              >
                Pilih Gambar
              </label>
              <input
                id="cover"
                type="file"
                  onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, cover: reader.result }); 
                  };
                  reader.readAsDataURL(file);

                  e.target.value = null;
                }}
                className="sr-only"
              />
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </form>

        {/* Info */}
        <div className="text-sm text-gray-600 my-5">
          {loading ? "Memuat..." : `${total} buku ditemukan`}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-64 rounded-lg border animate-pulse bg-gray-100" />
              ))
            : displayedBooks.map((book) => (
                <div key={book.id} className="relative">
                  <BookCard book={book} />
                  <button
                    onClick={() => handleRemoveBook(book.id)}
                    className="absolute top-2 right-2 rounded bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                    title="Delete (local)"
                  >
                    Delete
                  </button>
                </div>
              ))}
        </div>
      </main>
    </div>
  );
}
