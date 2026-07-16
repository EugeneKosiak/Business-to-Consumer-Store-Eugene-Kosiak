"use client";

import { useEffect, useState } from "react";
import type { Product } from "@prisma/client";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";
import { toUrlPath } from "@repo/utils/url";

export function TagList({
  selectedTag,
  products: initialProducts,
}: {
  selectedTag?: string;
  products: Product[];
}) {
  // Store current tags
  const [postTags, setPostTags] = useState(tags(initialProducts));

  useEffect(() => {
    // Repeat every 1 second to check for updated products
    const interval = setInterval(async () => {
      try {
        // Request the latest active products from the API
        const res = await fetch("/api/products");

        if (!res.ok) return;  // Stop if the request failed

        const latest: Product[] = await res.json(); // Convert the API response into a Product array
        const latestTags = tags(latest); // Generate the latest tags from the updated products

        // Update state only if the products have changed
        setPostTags((current) => {
          // Compare current products with the latest products
          if (
            JSON.stringify(current) ===
            JSON.stringify(latestTags)
          ) {
            return current; // Keep current state if nothing has changed
          }

          // Replace state with the latest tags
          return latestTags;
        });
      } catch (err) {
        // Log any errors from the fetch request
        console.error(err);
      }
    }, 1000);

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(interval);
  }, []); // Run once when the component first loads

  return (
    <LinkList title="Tags">
      <ul className="space-y-2">
        {postTags.map((tag) => {
          const count = tag.count;

          return (
            <li key={tag.name}>
              <Link
                href={`/tags/${toUrlPath(tag.name)}`}
                title={`Tag / ${tag.name}`}
                data-test-id={`tag-${toUrlPath(tag.name)}`}
                className={
                  selectedTag === tag.name
                    ? "font-bold text-blue-500 underline"
                    : "text-gray-700 dark:text-gray-200 hover:underline hover:text-black dark:hover:text-white"
                }
              >
                #{tag.name}{" "}
                <span
                  data-test-id="post-count"
                  className="ml-2 inline-flex items-center 
                  justify-center min-w-[22px] h-[22px] px-2 
                  rounded-full bg-gray-700 text-white text-xs 
                  font-semibold"
                >
                  {count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </LinkList>
  );
}