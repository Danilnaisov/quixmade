"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/components/shared/CartItem";
import { CartSummary } from "@/components/shared/CartSummary";
import { Container, Footer, Header, Title } from "@/components/shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface CartItemData {
  product_id: string;
  name: string;
  price: number;
  fullPrice: number;
  quantity: number;
  stock_quantity: number;
  savings: number;
  image: string;
  link: string;
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
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Загрузка...</p>
      </div>
    );
  }

  const updateQuantity = async (product_id: string, newQuantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id, quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Ошибка при обновлении количества", {
          duration: 3000,
        });
        return;
      }

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
      console.error("Ошибка при обновлении количества:", error);
      toast.error("Произошла ошибка при обновлении количества", {
        duration: 3000,
      });
    }
  };

  const removeItem = async (product_id: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Ошибка при удалении товара", {
          duration: 3000,
        });
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
      toast.success("Товар удалён из корзины", { duration: 2000 });
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
      toast.error("Произошла ошибка при удалении товара", { duration: 3000 });
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Ошибка при оформлении заказа", {
          duration: 3000,
        });
        return;
      }

      toast.success("Заказ успешно оформлен!", { duration: 3000 });
      setCart((prevCart) => ({
        ...prevCart!,
        items: [],
        summary: 0,
        totalSavings: 0,
        status: "payed",
      }));
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      toast.error("Произошла ошибка при оформлении заказа", { duration: 3000 });
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Ошибка при очистке корзины", {
          duration: 3000,
        });
        return;
      }

      toast.success("Корзина успешно очищена!", { duration: 2000 });
      setCart((prevCart) => ({
        ...prevCart!,
        items: [],
        summary: 0,
        totalSavings: 0,
        status: "pending",
      }));
    } catch (error) {
      console.error("Ошибка при очистке корзины:", error);
      toast.error("Произошла ошибка при очистке корзины", { duration: 3000 });
    }
  };

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Container className="py-10 flex flex-col items-center gap-8 w-full max-w-6xl mx-auto">
        <Title
          text="Ваша корзина"
          className="text-4xl font-extrabold text-gray-900"
        />
        {cart.items.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <ul className="flex flex-col gap-6 w-full md:w-2/3">
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
              className="w-full md:w-1/3"
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
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Ваша корзина пуста</p>
            <Button asChild variant="outline">
              <Link href="/catalog">Продолжить покупки</Link>
            </Button>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default CartPage;
