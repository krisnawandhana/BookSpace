const KEY = "favorites";

export function getFavorites() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((b) => b.id === id);
}

export function addFavorite(book) {
  const current = getFavorites();
  if (!current.find((b) => b.id === book.id)) {
    localStorage.setItem(KEY, JSON.stringify([...current, book]));
  }
}

export function removeFavorite(id) {
  const next = getFavorites().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}
