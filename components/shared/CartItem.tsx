"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface CartItemProps {
  item: {
    product_id: string;
    name: string;
    price: number;
    fullPrice: number;
    quantity: number;
    stock_quantity: number;
    savings: number;
    images: string[];
  };
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  isDisabled: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  isDisabled,
}) => {
  if (item.stock_quantity === 0) {
    alert(
      `Товар "${item.name}" больше не доступен. Он будет удален из корзины.`
    );
    onRemove();
    return null;
  } else if (item.quantity > item.stock_quantity) {
    alert(
      `Превышено доступное количество товара "${item.name}". Товар будет удален из корзины.`
    );
    onRemove();
    return null;
  }

  return (
    <li className="flex items-center bg-white p-[10px] w-full rounded-[10px] h-[144px] gap-4">
      {/* Картинка */}
      <div className="rounded-[10px] overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[1]}
            alt={item.name}
            className="w-[124px] h-[124px] object-cover"
          />
        ) : (
          <Skeleton className="w-[124px] h-[124px]"></Skeleton>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="flex-1">
        <p className="font-bold">{item.name}</p>
        <p className="text-lg text-gray-700">
          {item.price} ₽
          {item.savings > 0 && (
            <span className="text-green-500 ml-2">
              Выгода: {item.savings} ₽
            </span>
          )}
        </p>
      </div>

      {/* Счетчик и кнопки */}
      <div className="flex items-center gap-2">
        {/* Кнопка "-" */}
        <Button
          onClick={onDecrease}
          disabled={isDisabled || item.quantity <= 1}
          className={`w-9 h-9 bg-[#EE6319] hover:bg-orange-700 transition-colors ${
            (isDisabled || item.quantity <= 1) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          <Minus size={16} />
        </Button>

        {/* Текущее количество */}
        <span className="text-lg font-medium">{item.quantity}</span>

        {/* Кнопка "+" */}
        <Button
          onClick={onIncrease}
          disabled={isDisabled || item.quantity >= item.stock_quantity}
          className={`w-9 h-9 bg-[#EE6319] hover:bg-orange-700 transition-colors ${
            (isDisabled || item.quantity >= item.stock_quantity) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          <Plus size={16} />
        </Button>

        {/* Кнопка "Удалить" */}
        <Button
          onClick={onRemove}
          disabled={isDisabled}
          className={`px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${
            isDisabled && "opacity-50 cursor-not-allowed"
          }`}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
};
