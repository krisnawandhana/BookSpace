import { books } from "@/lib/mockAPI";

export function listCategoriesRaw() {
  return Array.from(new Set(books.map(b => b.category).filter(Boolean)));
}

export function listCategories() {
  return listCategoriesRaw().map((c) => {
    const label = c.charAt(0).toUpperCase() + c.slice(1);
    const slug = encodeURIComponent(c.toLowerCase());
    return { label, value: c, slug };
  });
}

export function queryBooks({ q = "", category } = {}) {
  const normalizedQuery = q.toLowerCase();

  const normalizedCategory = category?.toLowerCase();

  const items = books.filter(b => {
    const matchesQuery  = !normalizedQuery || b.title.toLowerCase().includes(normalizedQuery);
    const matchesCategory  = !normalizedCategory || b.category.toLowerCase() === normalizedCategory;

    return matchesQuery  && matchesCategory ;
  });
  
  return { items };
}
