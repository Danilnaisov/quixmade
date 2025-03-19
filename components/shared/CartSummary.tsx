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
    <div
      className={cn(
        "flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md sticky top-20",
        className
      )}
    >
      <p className="text-2xl font-bold text-gray-900">Итого</p>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{totalItems} товара(-ов)</span>
          <span>
            {totalSavings > 0
              ? (summary + totalSavings).toLocaleString()
              : summary.toLocaleString()}{" "}
            ₽
          </span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span>Выгода:</span>
            <span className="text-green-500">
              -{totalSavings.toLocaleString()} ₽
            </span>
          </div>
        )}
      </div>
      <p className="text-3xl font-extrabold text-[#006933]">
        {summary.toLocaleString()} ₽
      </p>
      <div className="flex flex-col gap-3 mt-4">
        <Button
          onClick={onCheckout}
          disabled={isDisabled}
          className="bg-[#006933] hover:bg-[#004d24] text-white"
        >
          Оформить заказ
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isDisabled}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Очистить корзину
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Очистить корзину?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены? Это действие удалит все товары из корзины.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={onClearCart}
                className="bg-red-500 hover:bg-red-600"
              >
                Очистить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
