"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";

export default function BookCard({ book }) {
  const [fav, setFav] = useState(false);

  useEffect(() => setFav(isFavorite(book.id)), [book.id]);

  const toggleFav = () => {
    if (fav) removeFavorite(book.id);
    else addFavorite(book);
    setFav(!fav);
  };

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
            onClick={toggleFav}
            className={`px-3 py-1.5 rounded text-sm border hover:shadow ${
              fav ? " border-yellow-300 bg-amber-400 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-yellow-100 hover:text-amber-400"
            }`}
          >
            {fav ? "★ Favorit" : "☆ Favorit"}
          </button>
        </div>
      </div>
    </div>
  );
}
