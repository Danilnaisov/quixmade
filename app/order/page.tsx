"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
        });
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-8">
      <Button onClick={() => router.push("/")}>На главную</Button>
      <h1 className="text-2xl font-bold">Мои заказы</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="border-b py-4">
              <p className="font-bold">
                Дата заказа: {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul>
                {order.items.map((item) => (
                  <li
                    key={item.product_id}
                    className="flex justify-between py-2"
                  >
                    <div>
                      <p>{item.name}</p>
                      <p>
                        {item.price} ₽ × {item.quantity}
                      </p>
                    </div>
                    <p>{item.price * item.quantity} ₽</p>
                  </li>
                ))}
              </ul>
              <p className="text-right font-bold">
                Итого:{" "}
                {order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}{" "}
                ₽
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет заказов.</p>
      )}
    </div>
  );
};

export default OrdersPage;
