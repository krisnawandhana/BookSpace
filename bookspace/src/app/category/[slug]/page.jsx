import Navbar from "@/components/ui/NavBar";
import BookCard from "@/components/book/BookCard";
import { listCategories, queryBooks } from "@/lib/books";
import Link from "next/link";

export async function generateStaticParams() {
  return listCategories().map((c) => ({ slug: c.slug }));
}

export default async function CategoryDetailPage({params}) {
  const slug = decodeURIComponent(params.slug || "").toLowerCase();

  const categories = listCategories();
  const current = categories.find((c) => c.slug === slug);
  const title = current ? current.label : "Unknown";

  const { items } = queryBooks({ category: current?.value });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Category: {title}
            </h1>
            <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700 bg-gray-50">
              {items.length} book{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          <Link
            href="/category"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition shadow-sm"
          >
            ← Semua Kategori
          </Link>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            Belum ada buku pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {items.map((b) => (
              <div key={b.id} className="relative group">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
