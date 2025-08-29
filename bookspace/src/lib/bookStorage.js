// lib/booksOverlay.js
const STORAGE_KEY_ADDED = "books_added";
const STORAGE_KEY_REMOVED = "books_removed";

function safeParse(json, fallback = []) {
  try {
    return JSON.parse(json ?? "[]");
  } catch {
    return fallback;
  }
}

export function getAddedBooks() {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY_ADDED));
}

export function getRemovedBookIds() {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY_REMOVED));
}

function saveAddedBooks(addedBooks) {
  localStorage.setItem(STORAGE_KEY_ADDED, JSON.stringify(addedBooks));
}

function saveRemovedBookIds(removedIds) {
  localStorage.setItem(STORAGE_KEY_REMOVED, JSON.stringify(removedIds.map(String)));
}

export function addBookLocal(newBookData) {
  const newId = `local-${Date.now()}`;
  const newBook = {
    id: newId,
    title: String(newBookData.title || "Untitled"),
    author: newBookData.author || "",
    category: (newBookData.category || "").toLowerCase(),
    description: newBookData.description || "",
    cover: newBookData.cover || "",
  };

  const currentAddedBooks = getAddedBooks();
  saveAddedBooks([...currentAddedBooks, newBook]);

  const currentRemovedIds = getRemovedBookIds().filter((removedId) => String(removedId) !== String(newId));
  saveRemovedBookIds(currentRemovedIds);

  return newBook;
}

export function removeBookLocal(bookId) {
  const bookIdString = String(bookId);
  const currentAddedBooks = getAddedBooks();

  if (currentAddedBooks.some((book) => String(book.id) === bookIdString)) {
    const updatedAddedBooks = currentAddedBooks.filter((book) => String(book.id) !== bookIdString);
    saveAddedBooks(updatedAddedBooks);
    return;
  }

  const currentRemovedIds = getRemovedBookIds();
  if (!currentRemovedIds.includes(bookIdString)) {
    saveRemovedBookIds([...currentRemovedIds, bookIdString]);
  }
}

export function restoreBookLocal(bookId) {
  const bookIdString = String(bookId);
  const updatedRemovedIds = getRemovedBookIds().filter((removedId) => removedId !== bookIdString);
  saveRemovedBookIds(updatedRemovedIds);
}

export function clearOverlay() {
  saveAddedBooks([]);
  saveRemovedBookIds([]);
}

export function getBooksWithOverlay(baseBooks, { searchQuery = "", category = "all" } = {}) {
  const addedBooks = getAddedBooks();
  const removedBookIds = getRemovedBookIds();

  const combinedBooks = [...baseBooks, ...addedBooks];

  const filteredBooks = combinedBooks.filter((book) => !removedBookIds.includes(String(book.id)));

  const dedupedBooks = Array.from(new Map(filteredBooks.map((book) => [String(book.id), book])).values());

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizedCategory = category.trim().toLowerCase();

  return dedupedBooks.filter((book) => {
    const matchesQuery =
      !normalizedQuery ||
      String(book.title || "").toLowerCase().includes(normalizedQuery) ||
      String(book.author || "").toLowerCase().includes(normalizedQuery);

    const matchesCategory = normalizedCategory === "all" || String(book.category || "").toLowerCase() === normalizedCategory;

    return matchesQuery && matchesCategory;
  });
}

export function getUniqueCategoriesFromBooks(books) {
  const set = new Set(
    books.map(b => String(b.category || "").toLowerCase()).filter(Boolean)
  );
  return ["all", ...Array.from(set)];
}

export function findLocalBookById(bookId) {
  const id = String(bookId);
  return getAddedBooks().find((book) => String(book.id) === id) || null;
}

export function isBookRemoved(bookId) {
  const id = String(bookId);
  return getRemovedBookIds().includes(id);
}
