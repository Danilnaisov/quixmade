/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

interface Product {
  id?: string;
}

interface CardReviewProps {
  product: Product;
}

export function CardReview({ product }: CardReviewProps) {
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined in .env");
      setAverageRating(0);
      return;
    }

    const fetchReviews = async () => {
      try {
        const productId = product.id ? product.id.toString() : "";
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?productId=${productId}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch reviews: ${res.status} ${res.statusText}`
          );
        }
        const reviews = await res.json();
        const avg =
          reviews.length > 0
            ? reviews.reduce(
                (sum: number, review: any) => sum + review.stars,
                0
              ) / reviews.length
            : 0;
        setAverageRating(avg);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAverageRating(0);
      }
    };

    if (product.id) {
      fetchReviews();
    } else {
      console.warn("product.id is undefined or empty");
      setAverageRating(0);
    }
  }, [product.id]);

  if (averageRating === null) {
    return <span className="text-sm text-gray-600">Загрузка...</span>;
  }

  return (
    <span className="text-sm text-gray-600">
      {averageRating > 0 ? averageRating.toFixed(1) : "Нет оценок"}
    </span>
  );
}
