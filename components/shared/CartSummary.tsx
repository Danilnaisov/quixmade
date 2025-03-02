"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  totalItems: number;
  summary: number;
  totalSavings: number;
  onClearCart: () => void;
  onCheckout: () => void;
  isDisabled: boolean;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  summary,
  totalSavings,
  onClearCart,
  onCheckout,
  isDisabled,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-[32px] font-bold">Итого:</p>
      {totalSavings > 0 ? (
        <span className="text-[16px] font-medium w-full flex justify-between">
          <p>{totalItems} товара(-ов)</p>
          <p>{summary + totalSavings} ₽</p>
        </span>
      ) : (
        <span className="text-[16px] font-medium w-full flex justify-between">
          <p>{totalItems} товара(-ов)</p>
          <p>{summary} ₽</p>
        </span>
      )}
      {totalSavings > 0 && (
        <span className="text-[16px] font-medium w-full flex justify-between">
          <p>Выгода: </p>
          <p className="text-[#9C341F]">-{totalSavings} ₽</p>
        </span>
      )}
      <p className="text-[32px] text-[#006933] font-bold">{summary} ₽</p>

      {/* Кнопки очистить и заказать */}
      <div className="flex flex-col gap-3 mt-4">
        {/* Диалоговое окно для очистки корзины */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isDisabled}
              className={`px-4 py-2 ${
                isDisabled && "opacity-50 cursor-not-allowed"
              }`}
            >
              Очистить корзину
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие очистит вашу корзину. Вы не сможете отменить это
                действие.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={onClearCart}>
                Очистить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Кнопка оформления заказа */}
        <Button
          onClick={onCheckout}
          disabled={isDisabled}
          className={`px-4 py-2 ${
            isDisabled && "opacity-50 cursor-not-allowed"
          }`}
        >
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};
