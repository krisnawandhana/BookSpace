const KEY = "favorites";

function safeParse(json, fallback = []) {
  try { return JSON.parse(json ?? "[]"); } catch { return fallback; }
}

function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getFavorites() {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((b) => b.id === id);
}

export function addFavorite(book) {
  const current = getFavorites();
  const sid = String(book.id);
  if (!current.find((b) => String(b.id) === sid)) {
    saveFavorites([...current, { ...book, id: sid }]);
  }
}

export function removeFavorite(id) {
  const sid = String(id);
  const next = getFavorites().filter((b) => String(b.id) !== sid);
  saveFavorites(next);
}

export function toggleFavorite(book) {
  isFavorite(book.id) ? removeFavorite(book.id) : addFavorite(book);
}

export function clearFavorites() {
  saveFavorites([]);
}

export function onFavoritesChange(cb) {
  const handler = (e) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
