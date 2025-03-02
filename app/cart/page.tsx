"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/shared/CartItem";
import { CartSummary } from "@/components/shared/CartSummary";
import { Container, Footer, Header, Title } from "@/components/shared";
import { toast } from "sonner";

interface CartItemData {
  product_id: string;
  name: string;
  price: number;
  fullPrice: number;
  quantity: number;
  stock_quantity: number;
  savings: number;
  images: string[];
}

interface CartData {
  items: CartItemData[];
  summary: number;
  totalSavings: number;
  status: string | null;
}

const CartPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/cart`)
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch((error) => console.error("Ошибка загрузки корзины", error));
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, session, router]);

  if (status === "loading" || !cart) {
    return <p>Загрузка...</p>;
  }

  const updateQuantity = async (product_id: string, newQuantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast(errorData.error || "Ошибка при обновлении количества товара", {
          action: {
            label: "Ок",
            onClick: () => console.log(),
          },
        });
        // alert(errorData.error || "Ошибка при обновлении количества товара");
        return;
      }

      // Обновляем состояние корзины
      setCart((prevCart) => {
        if (!prevCart) return null;

        const updatedItems = prevCart.items.map((item) =>
          item.product_id === product_id
            ? {
                ...item,
                quantity: newQuantity,
                savings:
                  item.fullPrice > item.price
                    ? (item.fullPrice - item.price) * newQuantity
                    : 0,
              }
            : item
        );

        const updatedSummary = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const updatedTotalSavings = updatedItems.reduce(
          (sum, item) => sum + item.savings,
          0
        );

        return {
          ...prevCart,
          items: updatedItems,
          summary: updatedSummary,
          totalSavings: updatedTotalSavings,
        };
      });
    } catch (error) {
      console.error("Ошибка при обновлении количества товара:", error);

      toast("Ошибка при обновлении количества товара", {
        action: {
          label: "Ок",
          onClick: () => console.log(),
        },
      });

      // alert("Произошла ошибка при обновлении количества товара");
    }
  };

  // Функция для удаления товара из корзины
  const removeItem = async (product_id: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast(errorData.error || "Ошибка при удалении товара из корзины", {
          action: {
            label: "Ок",
            onClick: () => console.log(),
          },
        });
        // alert(errorData.error || "Ошибка при удалении товара из корзины");
        return;
      }

      setCart((prevCart) => {
        if (!prevCart) return null;

        const updatedItems = prevCart.items.filter(
          (item) => item.product_id !== product_id
        );

        const updatedSummary = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const updatedTotalSavings = updatedItems.reduce(
          (sum, item) => sum + item.savings,
          0
        );

        return {
          ...prevCart,
          items: updatedItems,
          summary: updatedSummary,
          totalSavings: updatedTotalSavings,
        };
      });
    } catch (error) {
      console.error("Ошибка при удалении товара из корзины:", error);
      toast("Произошла ошибка при удалении товара из корзины", {
        action: {
          label: "Ок",
          onClick: () => console.log(),
        },
      });
      // alert("Произошла ошибка при удалении товара из корзины");
    }
  };

  // Функция для оформления заказа
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        // alert(errorData.error || "Ошибка при оформлении заказа");
        toast(errorData.error || "Ошибка при оформлении заказа", {
          action: {
            label: "Ок",
            onClick: () => console.log(),
          },
        });
        return;
      }

      toast("Заказ успешно оформлен!", {
        action: {
          label: "Ок",
          onClick: () => console.log(),
        },
      });

      // alert("Заказ успешно оформлен!");
      // После успешного оформления заказа очищаем корзину
      setCart((prevCart) => ({
        ...prevCart!,
        items: [],
        summary: 0,
        totalSavings: 0,
        status: "payed",
      }));
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      toast("Произошла ошибка при оформлении заказа", {
        action: {
          label: "Ок",
          onClick: () => console.log(),
        },
      });
      // alert("Произошла ошибка при оформлении заказа");
    }
  };

  // Функция для очистки корзины
  const handleClearCart = async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        // alert(errorData.error || "Ошибка при очистке корзины");
        toast(errorData.error || "Ошибка при очистке корзины", {
          action: {
            label: "Ок",
            onClick: () => console.log(),
          },
        });
        return;
      }

      toast("Корзина успешно очищена!", {
        action: {
          label: "Ок",
          onClick: () => console.log(),
        },
      });
      // alert("Корзина успешно очищена!");

      setCart((prevCart) => ({
        ...prevCart!,
        items: [],
        summary: 0,
        totalSavings: 0,
        status: "pending",
      }));
    } catch (error) {
      console.error("Ошибка при очистке корзины:", error);
      toast("Произошла ошибка при очистке корзины", {
        action: {
          label: "Ок",
          onClick: () => console.log(),
        },
      });
      // alert("Произошла ошибка при очистке корзины");
    }
  };

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col">
      <Header />
      <Container className="pb-14 flex flex-col items-start justify-between w-full">
        <Title text="Корзина" className="text-[32px] font-bold" />
        {cart.items.length > 0 ? (
          <div className="flex gap-5">
            <ul className="flex flex-col w-[1142px] h-max gap-[15px] bg-[#F5F5F5] p-5 rounded-[20px]">
              {cart.items.map((item) => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onDecrease={() =>
                    updateQuantity(
                      item.product_id,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  onIncrease={() =>
                    updateQuantity(
                      item.product_id,
                      Math.min(item.stock_quantity, item.quantity + 1)
                    )
                  }
                  onRemove={() => removeItem(item.product_id)}
                  isDisabled={cart.status === "payed"}
                />
              ))}
            </ul>
            <CartSummary
              className="w-[258px]"
              totalItems={cart.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
              summary={cart.summary}
              totalSavings={cart.totalSavings}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              isDisabled={cart.status === "payed"}
            />
          </div>
        ) : (
          <p>Корзина пуста</p>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default CartPage;
