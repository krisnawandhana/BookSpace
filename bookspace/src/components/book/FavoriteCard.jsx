"use client";

import Link from "next/link";

export default function FavoriteCard({ book, onRemove }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="w-full aspect-[9/12] overflow-hidden bg-gray-50">
        {book.cover ? (
          <img
            src={book.cover}
            alt={`Cover of ${book.title || "book"}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18" stroke="currentColor" strokeWidth="1.6"/>
              <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M7 17l3-3 3 3 4-4 2 2" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title || "-"}</h3>
        <p className="mt-0.5 text-sm text-gray-600 truncate">{book.author || "—"}</p>

        {book.category && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-blue-700">
            {book.category}
          </span>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 flex items-center gap-2">
          <Link
            href={`/book/${book.id}`}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Detail
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Hapus "${book.title}" dari daftar?`)) onRemove(book.id);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
            title="Hapus (local)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
