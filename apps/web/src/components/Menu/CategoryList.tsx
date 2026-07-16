"use client";

import { useEffect, useState } from "react";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import type { Product } from "@prisma/client";

export function CategoryList({
  products: initialProducts,
}: {
  products: Product[];
}) {
  // Store current products
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    // Repeat every 1 second to check for updated products
    const interval = setInterval(async () => {
      try {
        // Request the latest active products from the API
        const res = await fetch("/api/products");

        // Stop if the request failed
        if (!res.ok) return;

        // Convert the API response into a Product array
        const latest: Product[] = await res.json();

        // Update state only if the products have changed
        setProducts((current) => {
          // Compare current products with the latest products
          if (
            JSON.stringify(current) ===
            JSON.stringify(latest)
          ) {
            // Keep current state if nothing has changed
            return current;
          }

          // Replace state with the latest products
          return latest;
        });
      } catch (err) {
        // Log any errors from the fetch request
        console.error(err);
      }
    }, 1000);

    // Clear the interval when the component is removed
    return () => clearInterval(interval);
  }, []); // Run once when the component first loads

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      {categories.map((cat) => {
        const count = products.filter(
          (p) => p.active && p.category === cat
        ).length;

        return (
          <SummaryItem
            key={cat}
            count={count}
            name={cat}
            isSelected={false}
            link={`/category/${toUrlPath(cat)}`}
            title={`Category / ${cat}`}
          />
        );
      })}
    </>
  );
}