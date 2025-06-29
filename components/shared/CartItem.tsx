"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

interface CartItemProps {
  item: {
    product_id: string;
    name: string;
    price: number;
    fullPrice: number;
    quantity: number;
    stock_quantity: number;
    savings: number;
    image: string; // Заменяем images на image
    link: string; // Используем link из API
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
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  if (item.stock_quantity === 0 && !isNotificationShown) {
    toast.error(`Товар "${item.name}" больше не доступен и удалён из корзины`, {
      duration: 3000,
    });
    setIsNotificationShown(true);
    onRemove();
    return null;
  } else if (item.quantity > item.stock_quantity && !isNotificationShown) {
    toast.error(
      `Превышено доступное количество "${item.name}". Товар удалён из корзины`,
      { duration: 3000 }
    );
    setIsNotificationShown(true);
    onRemove();
    return null;
  }

  return (
    <li className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/${item.link}`} className="flex items-center gap-4 flex-1">
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              title={item.name}
              width={1000}
              height={1000}
              className="w-24 h-24 object-cover"
            />
          ) : (
            <Skeleton className="w-24 h-24" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
          <p className="text-gray-600">
            {item.price.toLocaleString()} ₽
            {item.savings > 0 && (
              <span className="text-green-500 ml-2 text-sm">
                (Экономия: {item.savings.toLocaleString()} ₽)
              </span>
            )}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <Button
          onClick={onDecrease}
          disabled={isDisabled || item.quantity <= 1}
          variant="outline"
          size="sm"
          className="w-9 h-9"
        >
          <Minus size={16} />
        </Button>
        <span className="text-lg font-medium w-8 text-center">
          {item.quantity}
        </span>
        <Button
          onClick={onIncrease}
          disabled={isDisabled || item.quantity >= item.stock_quantity}
          variant="outline"
          size="sm"
          className="w-9 h-9"
        >
          <Plus size={16} />
        </Button>
        <Button
          onClick={onRemove}
          disabled={isDisabled}
          variant="destructive"
          size="sm"
          className="w-9 h-9"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
};
