"use client";

import { useEffect, useState } from "react";
import type { Product } from "@prisma/client";
import Link from "next/link";

export function Main({
  products: initialProducts,
  className,
}: {
  products: Product[];
  className?: string;
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
        const latest = await res.json();

        // Update state only if the products have changed
        setProducts((current) => {
          if (JSON.stringify(current) === JSON.stringify(latest)) {
            return current; // Keep current state if nothing has changed
          }

          return latest; // Replace state with the latest products
        });
      } catch (err) {
        // Log any errors from the fetch request
        console.error(err);
      }
    }, 1000);

    return () => clearInterval(interval); // Clear the interval when the component is removed
  }, []); // Run once when the component first loads

  return (
    <main className={className || ""}>

      {products.length === 0 ? (
        <p className="text-secondary">0 Products</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <article
              key={product.id}
              data-test-id={`b2c-${product.id}`}
              className="flex gap-6 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <img
                src={product.imageUrl}
                className="w-64 h-48 object-cover rounded-lg"
                alt={product.title}
              />

              {/* Content */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/product/${product.urlId}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-secondary mb-1">
                    {product.category}
                  </p>

                  {/* Price */}
                  <p className="text-lg font-bold text-primary mb-2">
                    ${product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span>{product.rating}/5</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-secondary mb-2">
                    Stock: <span className="font-semibold">{product.stock}</span>
                  </p>

                  <p
                    className="text-secondary mb-3"
                    data-test-id={`product-description-${product.urlId}`}
                  >
                    {product.description.substring(0, 60)}...
                  </p>

                  <p className="text-sm text-secondary mb-2">
                    #{product.tags.split(",").join(" #")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}