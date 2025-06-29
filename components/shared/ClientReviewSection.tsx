/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Container, Title } from "@/components/shared";
import { ReviewItem } from "@/components/shared/ReviewItem";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { useSession } from "next-auth/react";

const ClientReviewSection = ({
  productId,
  reviews,
  userId,
}: {
  productId: string;
  reviews: any[];
  userId?: string;
}) => {
  const { data: session } = useSession();
  const [userReview, setUserReview] = useState<any>(null);
  const [sortedReviews, setSortedReviews] = useState<any[]>([]);
  const [canLeaveReview, setCanLeaveReview] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Находим отзыв текущего пользователя в списке reviews
    if (session?.user?.id || userId) {
      const effectiveUserId = session?.user?.id || userId;
      const foundReview = reviews.find(
        (review) => review.user_id === effectiveUserId
      );
      console.log("Found userReview from reviews:", foundReview);
      setUserReview(foundReview || null);
    }
  }, [session, userId, reviews]);

  useEffect(() => {
    // Проверяем, может ли пользователь оставить отзыв
    const checkCanLeaveReview = async () => {
      if (!session?.user?.id && !userId) {
        setCanLeaveReview(false);
        setLoadingOrders(false);
        return;
      }

      try {
        const res = await fetch(`/api/order`);
        if (!res.ok) {
          throw new Error("Ошибка при загрузке заказов");
        }
        const orders = await res.json();

        const hasValidOrder = orders.some(
          (order: any) =>
            order.items.some((item: any) => item.product_id === productId) &&
            order.status !== "canceled" &&
            order.status == "delivered"
        );

        setCanLeaveReview(hasValidOrder);
        setLoadingOrders(false);
      } catch (error) {
        console.error("Ошибка при проверке заказов:", error);
        setCanLeaveReview(false);
        setLoadingOrders(false);
      }
    };

    checkCanLeaveReview();
  }, [session, userId, productId]);

  useEffect(() => {
    // Сортируем отзывы: отзыв текущего пользователя (userReview) на первом месте
    if (userReview) {
      const otherReviews = reviews
        .filter((review) => review._id !== userReview._id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setSortedReviews([userReview, ...otherReviews]);
    } else {
      const sorted = [...reviews].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSortedReviews(sorted);
    }
  }, [userReview, reviews]);

  return (
    <Container className="bg-[#F9F8F8] rounded-3xl p-6 sm:p-8 w-full max-w-6xl mb-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Title
          text="Отзывы"
          size="md"
          className="text-2xl sm:text-3xl font-bold"
        />
        {loadingOrders ? (
          <p className="text-gray-500 text-sm">Проверка заказов...</p>
        ) : canLeaveReview ? (
          <div>
            {userReview ? (
              <ReviewForm
                productId={productId}
                onReviewAdded={() => {
                  window.location.reload();
                }}
                existingReview={userReview}
              />
            ) : (
              <ReviewForm
                productId={productId}
                onReviewAdded={() => {
                  window.location.reload();
                }}
              />
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Купите товар и дождитесь доставки, чтобы оставить отзыв
          </p>
        )}
      </div>
      {sortedReviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sortedReviews.map((review: any) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm sm:text-base">Пока нет отзывов.</p>
      )}
    </Container>
  );
};

export { ClientReviewSection };
