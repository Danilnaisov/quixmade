"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const UserPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  if (!session) {
    router.push("/api/auth/login");
    return null;
  }

  return (
    <div className="p-8">
      <Button onClick={() => router.push("/")}>На главную</Button>
      <h1 className="text-2xl font-bold">Личный кабинет</h1>
      <p>Добро пожаловать!</p>
      <p>Id: {session.user.id}</p>
      <p>Email: {session.user.email}</p>
      <p>Роль: {session.user.role}</p>
      <br />
      {session.user.role === "admin" && (
        <>
          <Button onClick={() => router.push("/admin")}>Админка</Button>
          <br />
          <br />
        </>
      )}
      <Button onClick={() => router.push("/cart")}>Корзина</Button>
      <br />
      <Button onClick={() => router.push("/order")}>Заказы</Button>
      <br />
      <br />
      <Button onClick={() => router.push("/api/auth/signout")}>Выйти</Button>
    </div>
  );
};

export default UserPage;
