import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Images, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CardReview } from "./cardReview";

interface Product {
  _id: string;
  category: { name: string };
  slug: string;
  name: string;
  price: number;
  features: Record<string, string | number | boolean>;
  discountedPrice: number;
  images: string[];
  isDiscount: boolean;
  stock_quantity: number;
}

interface CardProps {
  product: Product;
}

export function Card({ product }: CardProps) {
  const {
    category,
    slug,
    name,
    price,
    features,
    discountedPrice,
    images,
    isDiscount,
    stock_quantity,
  } = product;

  const isOutOfStock = stock_quantity <= 0;

  return (
    <Link
      href={`/catalog/${category.name}/${slug}`}
      className={cn("block", isOutOfStock && "pointer-events-none")}
    >
      <div
        className={cn(
          "card-item flex flex-col items-start p-4 rounded-[10px] shadow-md transition-shadow duration-300 w-full h-full min-w-[120px]",
          isOutOfStock
            ? "bg-gray-200 text-gray-500"
            : "bg-white hover:shadow-lg"
        )}
      >
        <div className="relative w-full aspect-square">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              className={cn(
                "rounded-[10px] object-cover",
                isOutOfStock && "opacity-50"
              )}
            />
          ) : (
            <Skeleton className="w-full h-full rounded-[10px] flex justify-center items-center">
              <Images color="#333" size={64} />
            </Skeleton>
          )}
          <div className="absolute inset-0 flex flex-col justify-between p-3">
            <div className="flex flex-col gap-2">
              {features?.wireless && (
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 text-xs w-fit",
                    isOutOfStock
                      ? "bg-gray-300 text-gray-600"
                      : "bg-[#274c5b] text-white"
                  )}
                >
                  Wireless
                </Badge>
              )}
            </div>
            {isDiscount && (
              <Badge
                className={cn(
                  "absolute top-2 right-2 rounded-full px-3 py-1 text-xs w-fit",
                  isOutOfStock
                    ? "bg-gray-300 text-gray-600"
                    : "bg-[#efd372] text-[#274c5b]"
                )}
              >
                Sale
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-3 w-full">
          <div className="flex gap-2 items-center">
            {isDiscount ? (
              <>
                <span
                  className={cn(
                    "text-xl font-bold",
                    isOutOfStock ? "text-gray-500" : "text-[#F20D0D]"
                  )}
                >
                  {discountedPrice.toLocaleString()} ₽
                </span>
                <span
                  className={cn(
                    "text-sm line-through",
                    isOutOfStock ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {price.toLocaleString()} ₽
                </span>
              </>
            ) : (
              <span
                className={cn(
                  "text-xl font-bold",
                  isOutOfStock ? "text-gray-500" : "text-[#F20D0D]"
                )}
              >
                {price.toLocaleString()} ₽
              </span>
            )}
          </div>
          <h2
            className={cn(
              "text-base font-medium truncate",
              isOutOfStock ? "text-gray-500" : "text-gray-900"
            )}
          >
            {name}
          </h2>
          <div className="flex items-center gap-1">
            <Star
              color={isOutOfStock ? "#d1d5db" : "#ff9d00"}
              fill={isOutOfStock ? "#d1d5db" : "#ff9d00"}
              size={16}
            />
            <CardReview product={product} />
          </div>
        </div>
      </div>
    </Link>
  );
}
