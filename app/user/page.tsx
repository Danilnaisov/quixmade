/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container, Footer, Header, Title } from "@/components/shared";
import { toast } from "sonner";
import { ShoppingBag, ShoppingCart, LogOut, Shield, Copy } from "lucide-react";
import Link from "next/link";
import { ReviewForm } from "@/components/shared/ReviewForm";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  fullPrice: number;
  quantity: number;
  image: string;
  link: string;
  stock_quantity: number;
  savings: number;
}

interface Order {
  _id: string;
  cart_id: string;
  user_id: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  status: string;
}

const UserPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [userReviews, setUserReviews] = useState<any[]>([]); // Инициализируем как пустой массив
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/order`
          );
          if (!res.ok) {
            throw new Error("Ошибка при загрузке заказов");
          }
          const data = await res.json();
          setOrders(data);
          setLoadingOrders(false);
        } catch (error) {
          console.error("Ошибка загрузки заказов:", error);
          toast.error("Не удалось загрузить заказы", { duration: 3000 });
          setLoadingOrders(false);
        }
      } else if (status === "unauthenticated") {
        router.push("/auth/login");
      }
    };

    const fetchUserReviews = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?userId=${session.user.id}`
          );
          if (!res.ok) {
            throw new Error("Ошибка при загрузке отзывов");
          }
          const reviews = await res.json();
          if (Array.isArray(reviews)) {
            setUserReviews(reviews);
          } else {
            console.error("API /api/reviews did not return an array:", reviews);
            setUserReviews([]);
          }
        } catch (error) {
          console.error("Ошибка загрузки отзывов:", error);
          toast.error("Не удалось загрузить отзывы", { duration: 3000 });
          setUserReviews([]);
        } finally {
          setLoadingReviews(false);
        }
      } else {
        setLoadingReviews(false);
      }
    };

    fetchOrders();
    fetchUserReviews();
  }, [status, router, session]);

  const shortenId = (id: string) => {
    if (id.length <= 8) return id;
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID заказа скопирован!", { duration: 2000 });
    } catch (error) {
      console.error("Ошибка при копировании:", error);
      toast.error("Не удалось скопировать ID", { duration: 2000 });
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: "canceled" }),
      });

      if (!res.ok) {
        throw new Error("Ошибка при отмене заказа");
      }

      // Обновляем список заказов после отмены
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "canceled" } : order
        )
      );
      toast.success("Заказ успешно отменён!", { duration: 2000 });
    } catch (error) {
      console.error("Ошибка при отмене заказа:", error);
      toast.error("Не удалось отменить заказ", { duration: 2000 });
    }
  };

  const getStatusTextAndColor = (status: string) => {
    switch (status) {
      case "assembly":
        return { text: "В сборке", color: "text-yellow-600" };
      case "delivery":
      case "indelivery":
        return { text: "В доставке", color: "text-teal-600" };
      case "canceled":
        return { text: "Отменён", color: "text-red-600" };
      case "delivered":
        return { text: "Получен", color: "text-green-600" };
      default:
        return { text: "Неизвестный статус", color: "text-gray-600" };
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
                  const { text: statusText, color: statusColor } =
                    getStatusTextAndColor(order.status);
                  return (
                    <li
                      key={order._id}
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
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
                          <p className={`text-sm font-medium ${statusColor}`}>
                            Статус: {statusText}
                          </p>
                        </div>
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
                        {order.items.map((item) => {
                          const existingReview = Array.isArray(userReviews)
                            ? userReviews.find(
                                (review) =>
                                  review.product_id.toString() ===
                                    item.product_id &&
                                  review.user_id.toString() === session.user.id
                              )
                            : null;
                          return (
                            <li
                              key={item.product_id}
                              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                            >
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {item.price.toLocaleString()} ₽ ×{" "}
                                    {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}{" "}
                                  ₽
                                </p>
                                {loadingReviews ? (
                                  <p className="text-gray-500 text-sm">
                                    Загрузка отзывов...
                                  </p>
                                ) : order.status == "delivered" ? (
                                  <ReviewForm
                                    productId={item.product_id}
                                    onReviewAdded={() =>
                                      window.location.reload()
                                    }
                                    existingReview={existingReview}
                                  />
                                ) : null}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-bold text-[#006933]">
                          Итого: {total.toLocaleString()} ₽
                        </p>
                        {order.status === "assembly" && (
                          <Button
                            variant="destructive"
                            onClick={() => cancelOrder(order._id)}
                          >
                            Отменить заказ
                          </Button>
                        )}
                      </div>
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
