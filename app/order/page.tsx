"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container, Footer, Header, Title } from "@/components/shared";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  cart_id: string;
  createdAt: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/order")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка при загрузке заказов");
          }
          return res.json();
        })
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка загрузки заказов:", error);
          setError(error.message || "Произошла ошибка при загрузке заказов");
          setLoading(false);
          toast.error("Не удалось загрузить заказы", { duration: 3000 });
        });
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Container className="py-10 flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center w-full">
          <Title
            text="Мои заказы"
            className="text-4xl font-extrabold text-gray-900"
          />
        </div>
        {orders.length > 0 ? (
          <ul className="flex flex-col gap-6 w-full">
            {orders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              return (
                <li
                  key={order._id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="font-semibold text-gray-900">
                      Заказ от{" "}
                      {new Date(order.createdAt).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">ID: {order._id}</p>
                  </div>
                  <ul className="flex flex-col gap-4 border-t pt-4">
                    {order.items.map((item) => (
                      <li
                        key={item.product_id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.price.toLocaleString()} ₽ × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="text-right text-xl font-bold text-[#006933] mt-4">
                    Итого: {total.toLocaleString()} ₽
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">У вас пока нет заказов</p>
            <Button asChild variant="outline">
              <Link href="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default OrdersPage;
