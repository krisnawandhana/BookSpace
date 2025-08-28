import Navbar from "@/components/ui/NavBar";
import { listCategories } from "@/lib/books";
import Link from "next/link";

export const metadata = { title: "Categories • BookSpace" };

export default async function CategoriesPage() {
  const categories = listCategories();

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-black text-center">Categories</h1>
        {categories.length === 0 ? (
          <div className="rounded border bg-white p-6 text-gray-600">
            Belum ada kategori.
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="block rounded border bg-blue-500 text-white hover:bg-blue-400 px-4 py-3 text-center"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
