import Navbar from "@/components/ui/NavBar";
import BookCard from "@/components/book/BookCard";
import { listCategories, queryBooks } from "@/lib/books";
import Link from "next/link";

export async function generateStaticParams() {
  return listCategories().map((c) => ({ slug: c.slug }));
}

export default async function CategoryDetailPage(props) {
  const slug = await decodeURIComponent(props.slug || "").toLowerCase();

  const categories = listCategories();
  const current = categories.find((c) => c.slug === slug);
  const title = current ? current.label : "Unknown";

  const { items } = queryBooks({ category: current?.value });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Category: {title}</h1>
          <Link href="/category" className="text-blue-600 hover:underline">← Semua Kategori</Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded border bg-white p-6 text-gray-600">
            Belum ada buku pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {items.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </main>
    </div>
  );
}
