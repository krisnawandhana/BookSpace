import Navbar from "@/components/ui/NavBar";
import { listCategories } from "@/lib/books";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = listCategories();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700 bg-gray-50">
              {categories.length} total
            </span>
          </div>

          <Link
            href="/category"
            className="inline-flex items-center justify-center rounded-lg bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600 transition shadow-sm"
          >
            View All
          </Link>
        </div>

        {/* Content */}
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            Belum ada kategori.
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group block rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm hover:shadow-md hover:border-blue-300 transition"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden
                        className="opacity-70 group-hover:opacity-100">
                      <path d="M4 10V6a2 2 0 0 1 2-2h4l8 8-6 6-8-8Z" stroke="black" strokeWidth="1.6"/>
                      <circle cx="8" cy="8" r="1.2" fill="black"/>
                    </svg>
                    <span className="font-medium text-gray-800 group-hover:text-blue-600">
                      {c.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
