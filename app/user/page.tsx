"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container, Footer, Header, Title } from "@/components/shared";
import { toast } from "sonner";
import { ShoppingBag, ShoppingCart, LogOut, Shield, Copy } from "lucide-react";
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

const UserPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
          setLoadingOrders(false);
        })
        .catch((error) => {
          console.error("Ошибка загрузки заказов:", error);
          toast.error("Не удалось загрузить заказы", { duration: 3000 });
          setLoadingOrders(false);
        });
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Функция для укорачивания ID
  const shortenId = (id: string) => {
    if (id.length <= 8) return id;
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  // Функция для копирования ID в буфер обмена
  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID заказа скопирован!", { duration: 2000 });
    } catch (error) {
      console.error("Ошибка при копировании:", error);
      toast.error("Не удалось скопировать ID", { duration: 2000 });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Загрузка...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const userName = session.user.name || "Пользователь";
  const isAdmin = session.user.role === "admin";

  return (
    <div className="font-[family-name:var(--font-Montserrat)] flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Container className="py-10 flex flex-col gap-8 w-full max-w-4xl mx-auto">
        {/* Заголовок и кнопка выхода */}
        <div className="flex justify-between items-center">
          <Title
            text={`Личный кабинет`}
            className="text-4xl font-extrabold text-gray-900"
          />
          <Button
            variant="outline"
            onClick={async () => {
              await signOut({ callbackUrl: "/" });
            }}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Выйти
          </Button>
        </div>

        {/* Информация о пользователе */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            Добро пожаловать, {userName}!
          </p>
          <div className="flex flex-col gap-2 text-gray-700">
            <p>ID: {session.user.id}</p>
            <p>Email: {session.user.email}</p>
            <p>Роль: {session.user.role}</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link href="/cart">
                <ShoppingCart size={16} />
                Корзина
              </Link>
            </Button>
            {isAdmin && (
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link href="/admin">
                  <Shield size={16} />
                  Админка
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Список заказов */}
        <div className="flex flex-col gap-6">
          <Title
            text="Ваши заказы"
            className="text-2xl font-bold text-gray-900"
          />
          {loadingOrders ? (
            <p className="text-gray-600 animate-pulse">Загрузка заказов...</p>
          ) : orders.length > 0 ? (
            <ul className="flex flex-col gap-6">
              {orders
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((order) => {
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
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            ID: {shortenId(order._id)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(order._id)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Скопировать ID заказа"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
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
                                {item.price.toLocaleString()} ₽ ×{" "}
                                {item.quantity}
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
            <div className="text-center py-10">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-6">
                У вас пока нет заказов
              </p>
              <Button asChild variant="outline">
                <Link href="/catalog">Перейти в каталог</Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default UserPage;
