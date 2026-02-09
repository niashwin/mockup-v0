/**
 * Generic search filter utility.
 * Filters items by checking if any of their searchable text contains the query.
 */
export function filterBySearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string,
): T[] {
  if (!query.trim()) return items;
  const normalizedQuery = query.toLowerCase();
  return items.filter((item) =>
    getSearchableText(item).toLowerCase().includes(normalizedQuery),
  );
}
