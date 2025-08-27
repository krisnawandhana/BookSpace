"use client";
import { useEffect, useState } from "react";
import { getFavorites, removeFavorite, clearFavorites } from "@/lib/favorites";

export function useFavorites() {
  const [items, setItems] = useState([]);

  const refresh = () => setItems(getFavorites());

  useEffect(() => {
    refresh();

    const onStorage = (e) => { if (e.key === "favorites") refresh(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const removeOne = (id) => {
    removeFavorite(id);
    refresh();
  };

  const clearAll = () => {
    clearFavorites();
    refresh();
  };

  return { items, removeOne, clearAll };
}
