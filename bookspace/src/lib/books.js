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
  const qq = q.toLowerCase();
  const cc = category?.toLowerCase();
  const items = books.filter(b => {
    const okQ = !qq || b.title.toLowerCase().includes(qq);
    const okC = !cc || b.category.toLowerCase() === cc;
    return okQ && okC;
  });
  return { items };
}
