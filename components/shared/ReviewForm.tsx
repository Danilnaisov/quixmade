/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import ImageUploadForm from "../admin/ImageUploadForm";

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
  existingReview?: any; // Для редактирования
}

const MAX_IMAGES = 10; // Максимальное количество изображений

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewAdded,
  existingReview,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [rating, setRating] = useState(existingReview?.stars || 0);
  const [reviewText, setReviewText] = useState(existingReview?.review || "");
  const [images, setImages] = useState<string[]>(existingReview?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Обновляем состояния, если existingReview изменился
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.stars || 0);
      setReviewText(existingReview.review || "");
      setImages(existingReview.images || []);
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText || rating === 0) {
      toast.error("Пожалуйста, заполните текст отзыва и выберите оценку");
      return;
    }

    if (!userId) {
      toast.error("Вы должны быть авторизованы, чтобы оставить отзыв");
      return;
    }

    // Если изображений больше MAX_IMAGES, обрезаем до первых 10 и уведомляем пользователя
    let imagesToSubmit = images;
    if (images.length > MAX_IMAGES) {
      imagesToSubmit = images.slice(0, MAX_IMAGES);
      setImages(imagesToSubmit); // Обновляем состояние, чтобы отобразить только первые 10
      toast.warning(
        `Максимум ${MAX_IMAGES} изображений. Были сохранены только первые ${MAX_IMAGES} из ${images.length}.`
      );
    }

    setSubmitting(true);
    try {
      const method = existingReview ? "PUT" : "POST";
      const url = existingReview
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: existingReview?._id,
          review: reviewText,
          stars: rating,
          product_id: productId,
          images: imagesToSubmit, // Используем обрезанный массив
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении отзыва");
      }

      toast.success(
        existingReview ? "Отзыв обновлён!" : "Отзыв успешно добавлен!"
      );
      setReviewText("");
      setRating(0);
      setImages([]);
      setOpen(false);
      onReviewAdded();
    } catch (error: any) {
      console.error("Ошибка при сохранении отзыва:", error);
      toast.error(error.message || "Не удалось сохранить отзыв");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    console.log("existingReview", existingReview);
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?reviewId=${existingReview._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при удалении отзыва");
      }

      toast.success("Отзыв удалён!");
      setOpen(false);
      onReviewAdded();
    } catch (error: any) {
      console.error("Ошибка при удалении отзыва:", error);
      toast.error(error.message || "Не удалось удалить отзыв");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingReview ? (
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Edit2 size={16} />
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1">
            <Star size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Редактировать отзыв" : "Оставить отзыв"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Оценка
            </label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  fill={i < rating ? "#ff9d00" : "none"}
                  color={i < rating ? "#ff9d00" : "#d1d5db"}
                  className="cursor-pointer"
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ваш отзыв
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Расскажите о вашем опыте использования товара..."
              className="w-full"
            />
          </div>
          <div>
            <ImageUploadForm
              entityType="review"
              productId={productId}
              userId={userId}
              onUploadSuccess={(filePaths) => setImages(filePaths)}
              initialImages={images}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting
              ? "Отправка..."
              : existingReview
              ? "Обновить отзыв"
              : "Отправить отзыв"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
