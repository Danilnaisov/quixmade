"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface Props {
  productId: string;
}

export const AddToCartButton: React.FC<Props> = ({ productId }) => {
  const [inCart, setInCart] = useState<boolean | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  // Проверка наличия товара в корзине
  useEffect(() => {
    const checkIfInCart = async () => {
      try {
        const response = await fetch(`/api/cart?product_id=${productId}`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(errorData.error || "Ошибка при проверке корзины");
          return;
        }

        const data = await response.json();
        setInCart(data.inCart);
        setQuantity(data.quantity); // Устанавливаем количество товара
      } catch (error) {
        console.error("Ошибка при проверке корзины:", error);
      }
    };

    checkIfInCart();
  }, [productId]);

  // Добавление товара в корзину
  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка при добавлении товара в корзину");
        return;
      }

      alert("Товар успешно добавлен в корзину!");
      setInCart(true);
      setQuantity(1);
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
      alert("Произошла ошибка при добавлении товара в корзину");
    }
  };

  // Изменение количества товара
  const updateQuantity = async (newQuantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка при обновлении количества товара");
        return;
      }

      setQuantity(newQuantity); // Обновляем количество
    } catch (error) {
      console.error("Ошибка при обновлении количества товара:", error);
      alert("Произошла ошибка при обновлении количества товара");
    }
  };

  // Удаление товара из корзины
  const handleRemoveFromCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка при удалении товара из корзины");
        return;
      }

      alert("Товар успешно удален из корзины!");
      setInCart(false); // Обновляем состояние кнопки
      setQuantity(0); // Сбрасываем количество
    } catch (error) {
      console.error("Ошибка при удалении товара из корзины:", error);
      alert("Произошла ошибка при удалении товара из корзины");
    }
  };

  return (
    <div>
      {inCart ? (
        <div className="flex items-center gap-2">
          {/* Кнопка "-" */}
          <Button
            onClick={() => updateQuantity(Math.max(1, (quantity || 1) - 1))}
            className="w-9 h-9 bg-[#EE6319] hover:bg-orange-700 transition-colors"
          >
            <Minus />
          </Button>

          {/* Текущее количество */}
          <span className="w-max px-2">{quantity}</span>

          {/* Кнопка "+" */}
          <Button
            onClick={() => updateQuantity((quantity || 1) + 1)}
            className="w-9 h-9 bg-[#EE6319] hover:bg-orange-700 transition-colors"
          >
            <Plus />
          </Button>
          {/* Кнопка "Удалить" */}
          <Button
            onClick={handleRemoveFromCart}
            className="w-9 h-9 bg-[#EE1919] hover:bg-red-700 transition-colors"
          >
            <Trash2 />
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          className="p-4 bg-[#EE6319] shadow-[0px_4px_4px_0px_rgba(238,99,25,0.25)] text-white text-[20px] font-bold rounded-[15px] w-[156px] h-[55px] hover:bg-[#f17c3c] transition-all ease-in-out"
        >
          В корзину
        </Button>
      )}
    </div>
  );
};
