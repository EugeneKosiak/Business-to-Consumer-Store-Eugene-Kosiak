export function history(products: { date: Date; active: boolean }[]) {
  // Step 1: filter active products
  const activeProducts = products.filter((product) => product.active);

  // Step 2: sort products by date (newest first)
  const sorted = activeProducts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Step 3: group and count BEFORE formatting
  const map = new Map<string, { month: number; year: number; count: number }>();

  sorted.forEach((product) => {
    const date = new Date(product.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { month, year, count: 1 });
    }
  });

  // Step 4: return grouped + sorted result
  return Array.from(map.values());
}