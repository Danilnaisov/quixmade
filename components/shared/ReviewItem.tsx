"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Review {
  _id: { $oid: string };
  review: string;
  date: string;
  user_id: { $oid: string };
  stars: number;
  product_id: { $oid: string };
  images: string[];
  userName?: string;
}

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? review.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === review.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="border-b py-4 last:border-b-0 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < review.stars ? "#ff9d00" : "none"}
              color={i < review.stars ? "#ff9d00" : "#d1d5db"}
            />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <p className="text-sm text-gray-600">
            {review.userName || "Анонимный пользователь"}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-gray-700 text-sm sm:text-base">{review.review}</p>
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {review.images.map((image, index) => (
            <Dialog
              key={index}
              open={isOpen && currentImageIndex === index}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) setCurrentImageIndex(0);
              }}
            >
              <DialogTrigger asChild>
                <div
                  className="relative w-20 h-20 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsOpen(true);
                  }}
                >
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    title={`Review image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] max-h-[90vh] p-1 bg-slate-900 border-none">
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                  <Image
                    src={review.images[currentImageIndex]}
                    alt={`Review image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 rounded-full"
                  >
                    <ChevronLeft size={32} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 rounded-full"
                  >
                    <ChevronRight size={32} />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};
