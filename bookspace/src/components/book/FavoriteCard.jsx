"use client";

import Link from "next/link";

export default function FavoriteCard({ book, onRemove }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-full aspect-[9/12] overflow-hidden">
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold line-clamp-2 text-black">{book.title}</h3>
        <p className="text-sm text-gray-600">{book.author}</p>
        <span className="mt-2 inline-block text-xs uppercase tracking-wide text-blue-600">
          {book.category}
        </span>

        <div className="mt-auto pt-4 flex items-center gap-2">
          <Link
            href={`/book/${book.id}`}
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Detail
          </Link>
          <button
            onClick={() => onRemove(book.id)}
            className="px-3 py-1.5 rounded border text-sm text-white bg-red-500 hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
